exports.cmd =
  'docker run --rm -v $(pwd):/src emscripten/emsdk emcc -Os src/app/wasm/proof-of-work/sha256/sha256.c src/app/wasm/proof-of-work/proof-of-work.c -o src/assets/wasm/proof-of-work.js -s ALLOW_MEMORY_GROWTH=1 -s EXTRA_EXPORTED_RUNTIME_METHODS="[\'ccall\']" -s ASYNCIFY=1 --js-library src/app/wasm/proof-of-work/proof-of-work.emlib.js -s MODULARIZE=1 -s EXPORT_NAME="ProofOfWorkModule"';
