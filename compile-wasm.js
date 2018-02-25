const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');
const path = require('path');

const pfs = ['exists', 'mkdir', 'readdir', 'unlink', 'lstat']
  .reduce((result, func) => Object.assign(result, { [func]: promisify(fs[func]) }), {});

const prepareWasmOutput = async () => {
  console.log('Preparing wasm output folder...\n');

  const src = 'src/assets/wasm';
  if (await pfs.exists(src)) {
    const files = await pfs.readdir(src);
    for (let file of files) {
      await pfs.unlink(path.join(src, file));
    }
  } else {
    await pfs.mkdir(src);
  }
};

const compileWasm = async () => {
  console.log('Compiling wasm sources...\n');

  const commands = [];
  for (let file of await pfs.readdir('src/app/wasm')) {
    if ((await pfs.lstat(`src/app/wasm/${file}`)).isDirectory()) {
      const command = require(`./src/app/wasm/${file}/build-cmd.js`).cmd;
      commands.push(command);
    }
  }

  return Promise.all(commands.map(command => exec(command, { cwd: __dirname })))
    .then(([_, ...statuses]) => {
      const status = statuses.map(s => s.stdour + s.stderr).filter(s => !!s && s !== 'undefined').join('\n');
      console.log(status);
    }, err => {
      console.error('Error while compiling the sources.');
      console.error(err);
    });
};

const allPromises = [
  prepareWasmOutput,
  compileWasm
];

return (async () => {
  for (const promise of allPromises) {
    await promise();
  }

  console.log('All sources have been successfully compiled.\n');
})();