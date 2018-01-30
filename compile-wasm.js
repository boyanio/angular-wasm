const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const buildCommands = [
  'emcc -O2 src/c/wasm-logger.c -Os -s WASM=1 -o src/assets/wasm/wasm-logger.js'
];

return Promise.all(buildCommands.map(command => exec(command, { cwd: __dirname })));