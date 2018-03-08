import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { fibonacciLoop, fibonacciMemo, fibonacciRec } from './fibonacci';
import { BenchmarkSuite, BenchmarkResult, runBenchmark } from './benchmark';

const jsSuite: BenchmarkSuite = {
  name: 'JavaScript',
  fibonacciLoop,
  fibonacciRec,
  fibonacciMemo
};

@Component({
  templateUrl: './fibonacci.component.html'
})
export class WasmFibonacciComponent implements OnInit {

  loaded: boolean;
  number: number;
  runs: number;
  isCalculating: boolean;
  results: BenchmarkResult[];
  private wasmSuite: BenchmarkSuite;

  constructor(private http: HttpClient) {
    this.number = 25;
    this.runs = 10;
  }

  ngOnInit() {
    const imports = {
      env: {
        memoryBase: 0,
        memory: new WebAssembly.Memory({ initial: 256 }),
        tableBase: 0,
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
      }
    };

    this.instantiateWasm(`${environment.wasmAssetsPath}/fibonacci.wasm`, imports)
      .subscribe(result => {
        const wasmInstance = result.instance;

        this.wasmSuite = {
          name: 'WebAssembly',
          fibonacciLoop: wasmInstance.exports._fibonacciLoop,
          fibonacciRec: wasmInstance.exports._fibonacciRec,
          fibonacciMemo: wasmInstance.exports._fibonacciMemo
        };
        this.loaded = true;
      });
  }

  start() {
    if (this.number < 1 || this.runs < 1)
      return;

    this.results = null;
    this.isCalculating = true;
    runBenchmark(this.number, this.runs, [jsSuite, this.wasmSuite])
      .subscribe(results => {
        this.isCalculating = false;
        this.results = results;
      });
  }

  cellClass(result: BenchmarkResult, func: string) {
    return this.isFastest(result, func) ? 'table-success' : '';
  }

  fastDiff(result: BenchmarkResult, func: string) {
    if (!this.isFastest(result, func))
      return '';

    const fastest = result[func];
    const slowest = this.results
      .map(r => r[func])
      .reduce((prev, val) => Math.max(prev, val), fastest);
    const diff = slowest / fastest;
    return ` (${diff > 1 && diff < 2 ? diff.toFixed(2) : Math.round(diff)}x)`;
  }

  private isFastest(result: BenchmarkResult, func: string) {
    return this.results.every(r => r[func] >= result[func]);
  }

  private instantiateWasm(url: string, imports?: Object): Observable<WebAssembly.ResultObject> {
    return this.http.get(url, { responseType: 'arraybuffer' })
      .mergeMap(bytes => WebAssembly.instantiate(bytes, imports));
  }
}