/**
 * This script generates hash for the Emscripten-generated files (js and wasm),
 * so that the client can fetch the correct one without cache issues.
 */
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const rootDir = path.resolve(__dirname, "../");

const generateChecksum = (str, algorithm, encoding) =>
  crypto
    .createHash(algorithm || "md5")
    .update(str, "utf8")
    .digest(encoding || "hex");

const result = {};

const wasmDir = path.resolve(rootDir, "src/assets/wasm");
for (let item of fs.readdirSync(wasmDir)) {
  const itemPath = path.join(wasmDir, item);
  if (!fs.lstatSync(itemPath).isFile()) {
    continue;
  }

  const content = fs.readFileSync(itemPath, { encoding: "utf-8" });
  result[item] = generateChecksum(content);
}

const cacheBustingFilePath = path.join(rootDir, "src/wasm-cache-busting.json");
fs.writeFileSync(cacheBustingFilePath, JSON.stringify(result, null, 2));
