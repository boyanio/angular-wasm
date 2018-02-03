#include <emscripten.h>

extern void say(const char *);

int main() {
  say("Multiplication in C\n");
  return 0;
}

EMSCRIPTEN_KEEPALIVE
int mul(int a, int b) {
  return a * b;
}