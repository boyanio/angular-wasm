const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const pfs = ['exists', 'mkdir', 'readdir', 'unlink']
  .reduce((result, func) => Object.assign(result, { [func]: promisify(fs[func]) }), {});


const allPromises = [
  async () => {
    const src = 'src/assets/wasm';
    if (await pfs.exists(src)) {
      const files = await pfs.readdir(src);
      for (let file of files) {
        await pfs.unlink(path.join(src, file));
      }
    } else {
      await pfs.mkdir(src);
    }
  }
];

const buildCommands = [
  'emcc -Os src/app/wasm/hello-world/hello-world.c -s WASM=1 -s SIDE_MODULE=1 -o src/assets/wasm/hello-world.wasm',
  'emcc -Os src/app/wasm/console-logger/console-logger.c -s WASM=1 -o src/assets/wasm/console-logger.js',
  'em++ -Os src/app/wasm/text-to-ascii/text-to-ascii.cpp -s WASM=1 -o src/assets/wasm/text-to-ascii.js --preload-file src/app/wasm/text-to-ascii/text-to-ascii.font.txt -s EXTRA_EXPORTED_RUNTIME_METHODS="[\'ccall\']"',
  'em++ -Os src/app/wasm/bmp-to-ascii/bmp-to-ascii.cpp -s WASM=1 -o src/assets/wasm/bmp-to-ascii.js --use-preload-plugins -s EXTRA_EXPORTED_RUNTIME_METHODS="[\'ccall\']"',
  'emcc -Os src/app/wasm/3d-cube/soil/libSOIL.bc src/app/wasm/3d-cube/3d-cube.c -s WASM=1 -o src/assets/wasm/3d-cube.js -s LEGACY_GL_EMULATION=1 -Isrc/app/wasm/3d-cube/soil -s EXTRA_EXPORTED_RUNTIME_METHODS="[\'ccall\']"',
  'emcc -Os src/app/wasm/proof-of-work/sha256/sha256.c src/app/wasm/proof-of-work/proof-of-work.c -s WASM=1 -o src/assets/wasm/proof-of-work.js -s ALLOW_MEMORY_GROWTH=1 -s EXTRA_EXPORTED_RUNTIME_METHODS="[\'ccall\']" -s EMTERPRETIFY=1 -s EMTERPRETIFY_ASYNC=1 --js-library src/app/wasm/proof-of-work/proof-of-work.emlib.js',
];

allPromises.push(() => Promise.all(buildCommands.map(command => exec(command, { cwd: __dirname })))
  .then(([_, ...statuses]) => {
    const status = statuses.map(s => s.stdour + s.stderr).filter(s => !!s && s !== 'undefined').join('\n');
    console.log(status);
  }, err => {
    console.error('Error while compiling the sources.');
    console.error(err);
  }));

return (async () => {
  for (const promise of allPromises) {
    await promise();
  }

  console.log('All sources have been successfully compiled.\n');
})();