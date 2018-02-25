export function utf8ToString(heap: Uint8Array, offset: number) {
  let s = '';
  for (let i = offset; heap[i]; i++) {
    s += String.fromCharCode(heap[i]);
  }
  return s;
};