import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import { fibonacciLoop, fibonacciMemo, fibonacciRec } from "./fibonacci";
import { BenchmarkSuite, BenchmarkResult, runBenchmark, FibonacciFunction } from "./benchmark";

const jsSuite: BenchmarkSuite = {
  name: "JavaScript",
  fibonacciLoop,
  fibonacciRec,
  fibonacciMemo,
};

@Component({
  templateUrl: "./fibonacci.component.html",
})
export class WasmFibonacciComponent implements OnInit, OnDestroy {
  loaded: boolean;
  number: number;
  runs: number;
  isCalculating: boolean;
  results: BenchmarkResult[];
  private runSubscription: Subscription;
  private wasmSuite: BenchmarkSuite;

  constructor(private http: HttpClient) {
    this.number = 25;
    this.runs = 10;
  }

  ngOnInit() {
    // Load "pure" WebAssembly, i.e. without any Emscripten API needed
    // to work with it
    this.instantiateWasm(`${environment.wasmAssetsPath}/fibonacci.wasm`, {}).then((result) => {
      const wasmInstance = result.instance;

      this.wasmSuite = {
        name: "WebAssembly",
        fibonacciLoop: wasmInstance.exports.fibonacciLoop as FibonacciFunction,
        fibonacciRec: wasmInstance.exports.fibonacciRec as FibonacciFunction,
        fibonacciMemo: wasmInstance.exports.fibonacciMemo as FibonacciFunction,
      };
      this.loaded = true;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeRun();
  }

  start() {
    if (this.number < 1 || this.runs < 1) {
      return;
    }

    this.results = null;
    this.isCalculating = true;

    this.unsubscribeRun();

    this.runSubscription = runBenchmark(this.number, this.runs, [jsSuite, this.wasmSuite]).subscribe((results) => {
      this.isCalculating = false;
      this.results = results;
    });
  }

  cellClass(result: BenchmarkResult, func: string) {
    return this.isFastest(result, func) ? "table-success" : "";
  }

  fastDiff(result: BenchmarkResult, func: string) {
    if (!this.isFastest(result, func)) {
      return "";
    }

    const fastest = result[func];
    const slowest = this.results.map((r) => r[func]).reduce((prev, val) => Math.max(prev, val), fastest);
    const diff = slowest / fastest;
    return ` (${diff > 1 && diff < 2 ? diff.toFixed(2) : Math.round(diff)}x)`;
  }

  private isFastest(result: BenchmarkResult, func: string) {
    return this.results.every((r) => r[func] >= result[func]);
  }

  private instantiateWasm(
    url: string,
    imports?: WebAssembly.Imports
  ): Promise<WebAssembly.WebAssemblyInstantiatedSource> {
    return this.http
      .get(url, { responseType: "arraybuffer" })
      .pipe(mergeMap((bytes) => WebAssembly.instantiate(bytes, imports)))
      .toPromise();
  }

  private unsubscribeRun() {
    if (this.runSubscription) {
      this.runSubscription.unsubscribe();
    }
  }
}
