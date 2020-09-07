exports.cmd =
  'docker run --rm -v $(pwd):/src emscripten/emsdk em++ -Os --bind src/app/wasm/person-record/person-record.cpp -o src/assets/wasm/person-record.js -s MODULARIZE=1 -s EXPORT_NAME="PersonRecordModule"';
