exports.cmd =
  'docker run --rm -v $(pwd):/src emscripten/emsdk emcc -Os src/app/wasm/3d-cube/soil/libSOIL.bc src/app/wasm/3d-cube/3d-cube.c -o src/assets/wasm/3d-cube.js -s LEGACY_GL_EMULATION=1 -Isrc/app/wasm/3d-cube/soil -s EXTRA_EXPORTED_RUNTIME_METHODS="[\'ccall\']" -s FORCE_FILESYSTEM=1 -s MODULARIZE=1 -s EXPORT_NAME="Cube3dModule"';
