import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { fibonacciLoop, fibonacciMemo, fibonacciRec } from './fibonacci';
import { BenchmarkSuite, BenchmarkResult, runBenchmark, FibonacciFunction } from './benchmark';

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
    this.instantiateWasm(`${environment.wasmAssetsPath}/fibonacci.wasm`, {}).subscribe(result => {
      const wasmInstance = result.instance;

      this.wasmSuite = {
        name: 'WebAssembly',
        fibonacciLoop: wasmInstance.exports.fibonacciLoop as FibonacciFunction,
        fibonacciRec: wasmInstance.exports.fibonacciRec as FibonacciFunction,
        fibonacciMemo: wasmInstance.exports.fibonacciMemo as FibonacciFunction
      };
      this.loaded = true;
    });
  }

  start() {
    if (this.number < 1 || this.runs < 1) {
      return;
    }

    this.results = null;
    this.isCalculating = true;
    runBenchmark(this.number, this.runs, [jsSuite, this.wasmSuite]).subscribe(results => {
      this.isCalculating = false;
      this.results = results;
    });
  }

  cellClass(result: BenchmarkResult, func: string) {
    return this.isFastest(result, func) ? 'table-success' : '';
  }

  fastDiff(result: BenchmarkResult, func: string) {
    if (!this.isFastest(result, func)) {
      return '';
    }

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

  private instantiateWasm(
    url: string,
    imports?: WebAssembly.Imports
  ): Observable<WebAssembly.WebAssemblyInstantiatedSource> {
    return this.http
      .get(url, { responseType: 'arraybuffer' })
      .pipe(mergeMap(bytes => WebAssembly.instantiate(bytes, imports)));
  }
}
