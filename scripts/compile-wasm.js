const { promisify } = require("util");
const exec = promisify(require("child_process").exec);
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const rootDir = path.resolve(__dirname, "../");

const pfs = ["exists", "mkdir", "readdir", "unlink", "lstat"].reduce(
  (result, func) => Object.assign(result, { [func]: promisify(fs[func]) }),
  {}
);

const ensureWasmOutputDirExists = async () => {
  console.log("Preparing wasm output folder...\n");

  const src = path.resolve(rootDir, "src/assets/wasm");
  if (await pfs.exists(src)) {
    const files = await pfs.readdir(src);
    for (let file of files) {
      await pfs.unlink(path.join(src, file));
    }
  } else {
    await pfs.mkdir(src);
  }
};

const execCommand = (command) =>
  exec(command, { cwd: rootDir }).then(({ stdout, stderr }) => {
    const status = stdout + stderr;
    if (status && status !== "undefined") {
      console.log(chalk.grey(status));
    }
  });

const compileWasmSources = async () => {
  console.log("Compiling wasm sources...\n");

  const wasmDir = path.resolve(rootDir, "src/app/wasm");
  for (let item of await pfs.readdir(wasmDir)) {
    const itemPath = path.join(wasmDir, item);
    if ((await pfs.lstat(itemPath)).isDirectory()) {
      const buildFilePath = path.join(itemPath, "build-cmd.js");
      const { cmd } = require(buildFilePath);

      console.log("Compiling wasm source for", chalk.green(item));
      console.log(`${cmd}\n`);
      try {
        await execCommand(cmd);
      } catch ({ stderr }) {
        console.error(chalk.red(`Error: ${stderr}\n`));
        process.exit(-1);
      }
    }
  }
};

const allPromises = [ensureWasmOutputDirExists, compileWasmSources];

return (async () => {
  for (const promise of allPromises) {
    await promise();
  }

  console.log("All sources have been successfully compiled.\n");
})();
