import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export interface BenchmarkSuite {
  name: string;
  fibonacciLoop: (num: number) => number;
  fibonacciRec: (num: number) => number;
  fibonacciMemo: (num: number) => number;
}

export interface BenchmarkResult {
  name: string;
  fibonacciLoop: number;
  fibonacciRec: number;
  fibonacciMemo: number;
}

const warmupSuite = (suite: BenchmarkSuite) => {
  suite.fibonacciLoop(1);
  suite.fibonacciRec(1);
  suite.fibonacciMemo(1);
};

const runAndMeasure = (num: number, runs: number, func: (num: number) => number) =>
  Observable.range(1, runs)
    .map(() => Observable.defer(() => {
      const startTime = performance.now();
      func(num);
      const endTime = performance.now();
      const diff = endTime - startTime;
      return Observable.of(diff);
    }))
    .concatAll()
    .delay(300)
    .reduce((acc, val) => acc + (val / runs), 0);

export function runBenchmark(num: number, runs: number, suites: BenchmarkSuite[]) {
  for (let suite of suites) {
    warmupSuite(suite);
  }

  return Observable.from(suites)
    .map(suite => Observable.from(Object.keys(suite).filter(key => key !== 'name'))
      .map(funcName => runAndMeasure(num, runs, suite[funcName]).map(avg => ({ [funcName]: avg })))
      .concatAll()
      .reduce((acc, val) => Object.assign(acc, val), <BenchmarkResult>{ name: suite.name }))
    .concatAll()
    .reduce((acc, val) => [...acc, val], []);
};