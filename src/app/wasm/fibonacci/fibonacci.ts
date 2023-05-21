export const fibonacciLoop = (num: number) => {
  let a = 1;
  let b = 0;
  let temp: number;

  while (num >= 0) {
    temp = a;
    a = a + b;
    b = temp;
    num--;
  }

  return b;
};

export const fibonacciRec = (num: number) => {
  if (num <= 1) {
    return 1;
  }

  return fibonacciRec(num - 1) + fibonacciRec(num - 2);
};

export const fibonacciMemo = (num: number, memo?: Record<number, number>) => {
  memo = memo || {};

  if (memo[num]) {
    return memo[num];
  }

  if (num <= 1) {
    return 1;
  }

  return (memo[num] = fibonacciMemo(num - 1, memo) + fibonacciMemo(num - 2, memo));
};
