import { Observable, range, defer, of, from } from "rxjs";
import { map, concatAll, delay, reduce, flatMap } from "rxjs/operators";

export type FibonacciFunction = (num: number) => number;

export interface BenchmarkSuite {
  name: string;
  fibonacciLoop: FibonacciFunction;
  fibonacciRec: FibonacciFunction;
  fibonacciMemo: FibonacciFunction;
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

function runAndMeasure(num: number, runs: number, func: (num: number) => number): Observable<number> {
  return range(1, runs).pipe(
    map(() =>
      defer(() => {
        const startTime = performance.now();
        func(num);
        const endTime = performance.now();
        let diff = endTime - startTime;
        if (diff === 0) {
          // Add some minimal difference, even if they are equal
          diff = 0.000000000001;
        }
        return of(diff);
      })
    ),
    concatAll(),
    delay(300),
    reduce((acc, val) => acc + val / runs, 0)
  );
}

export function runBenchmark(num: number, runs: number, suites: BenchmarkSuite[]): Observable<BenchmarkResult[]> {
  for (const suite of suites) {
    warmupSuite(suite);
  }

  return from(suites).pipe(
    map((suite) =>
      from(Object.keys(suite).filter((key) => key !== "name")).pipe(
        // Create an array of result pairs [{ func: diff }]
        map((funcName) => runAndMeasure(num, runs, suite[funcName]).pipe(map((avg) => ({ [funcName]: avg })))),
        concatAll(),

        // Convert the array into object { func1: diff1, funct2: diff2, ... }
        reduce<{ [x: string]: number }, BenchmarkResult>((acc, val) => Object.assign(acc, val), <BenchmarkResult>{
          name: suite.name,
        })
      )
    ),
    concatAll(),
    reduce<BenchmarkResult, BenchmarkResult[]>((acc, val) => [...acc, val], [])
  );
}
