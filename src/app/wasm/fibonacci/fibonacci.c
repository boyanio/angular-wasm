#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int fibonacciLoop(int num) {
  int a = 1;
  int b = 1;

  while (num-- > 1) {
    int t = a;
    a = b;
    b += t;
  }
  return b;
}

EMSCRIPTEN_KEEPALIVE
int fibonacciRec(int num) {
  if (num <= 1)
    return 1;

  return fibonacciRec(num - 1) + fibonacciRec(num - 2);
}

int memo[10000];

EMSCRIPTEN_KEEPALIVE
int fibonacciMemo(int num) {
  if (memo[num] != -1)
    return memo[num];

  if (num == 1 || num == 2) {
    return 1;
  } else {
    return memo[num] = fibonacciMemo(num - 1) + fibonacciMemo(num - 2);
  }
}