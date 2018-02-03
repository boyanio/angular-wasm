const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const buildCommands = [
  'emcc -Os src/app/wasm/hello-world/hello-world.c -s WASM=1 -s SIDE_MODULE=1 -o src/assets/wasm/hello-world.wasm',
  'emcc -Os src/app/wasm/console-logger/console-logger.c -s WASM=1 -o src/assets/wasm/console-logger.js'
];

return Promise.all(buildCommands.map(command => exec(command, { cwd: __dirname })))
  .then(() => {
    console.log('All sources have been successfully compiled.');
  }, err => {
    console.error('Error while compiling the sources.');
    console.error(err);
  });