exports.cmd =
  'docker run --rm -v $(pwd):/src emscripten/emsdk em++ -Os src/app/wasm/text-to-ascii/text-to-ascii.cpp -o src/assets/wasm/text-to-ascii.js --preload-file src/app/wasm/text-to-ascii/text-to-ascii.font.txt -s EXTRA_EXPORTED_RUNTIME_METHODS="[\'ccall\']" -s MODULARIZE=1 -s EXPORT_NAME="TextAsciiModule"';
