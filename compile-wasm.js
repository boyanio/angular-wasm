const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const buildPromises = [
  'emcc -Os src/app/wasm/hello-world/hello-world.c -s WASM=1 -s SIDE_MODULE=1 -o src/assets/wasm/hello-world.wasm',
  'emcc -Os src/app/wasm/console-logger/console-logger.c -s WASM=1 -o src/assets/wasm/console-logger.js',
  'em++ -Os src/app/wasm/text-to-ascii/text-to-ascii.cpp -s WASM=1 -o src/assets/wasm/text-to-ascii.js --preload-file src/app/wasm/text-to-ascii/text-to-ascii.font.txt -s EXTRA_EXPORTED_RUNTIME_METHODS="[\'ccall\']"',
  'em++ -Os src/app/wasm/bmp-to-ascii/bmp-to-ascii.cpp -s WASM=1 -o src/assets/wasm/bmp-to-ascii.js --use-preload-plugins -s EXTRA_EXPORTED_RUNTIME_METHODS="[\'ccall\']"',
]
  .map(command => exec(command, { cwd: __dirname }));

return Promise.all(buildPromises)
  .then(([_, ...statuses]) => {
    console.log('All sources have been successfully compiled.\n');

    const status = statuses.map(s => s.stdour + s.stderr).filter(s => !!s && s !== 'undefined').join('\n');
    console.log(status);
  }, err => {
    console.error('Error while compiling the sources.');
    console.error(err);
  });