import { BenchmarkSuite } from './benchmark';

const fibonacciLoop = (num: number) => {
  let a = 1;
  let b = 0;
  let temp;

  while (num >= 0) {
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  return b;
};

const fibonacciRec = (num: number) => {
  if (num <= 1)
    return 1;

  return fibonacciRec(num - 1) + fibonacciRec(num - 2);
};

const fibonacciMemo = (num: number, memo?: Object) => {
  memo = memo || {};

  if (memo[num])
    return memo[num];

  if (num <= 1)
    return 1;

  return memo[num] = fibonacciMemo(num - 1, memo) + fibonacciMemo(num - 2, memo);
};

export const jsSuite: BenchmarkSuite = {
  name: 'JavaScript',
  fibonacciLoop,
  fibonacciRec,
  fibonacciMemo
};