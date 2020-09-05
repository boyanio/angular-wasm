exports.cmd =
  "docker run --rm -v $(pwd):/src emscripten/emsdk em++ -Os src/app/wasm/bmp-to-ascii/bmp-to-ascii.cpp -o src/assets/wasm/bmp-to-ascii.js --use-preload-plugins -s EXTRA_EXPORTED_RUNTIME_METHODS=\"['ccall','FS_readFile']\" -s MODULARIZE=1 -s EXPORT_NAME=\"BmpAsciiModule\"";
