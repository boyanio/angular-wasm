/**
 * This script generates hash for the Emscripten-generated files (js and wasm),
 * so that the client can fetch the correct one without cache issues.
 */
const crypto = require("crypto");
const glob = require("glob");
const path = require("path");
const fs = require("fs");

const rootDir = path.resolve(__dirname, "../");

const generateChecksum = (str, algorithm, encoding) =>
  crypto
    .createHash(algorithm || "md5")
    .update(str, "utf8")
    .digest(encoding || "hex");

const result = {};

glob.sync(path.join(rootDir, "src/assets/wasm/*.{js,wasm}")).forEach((filePath) => {
  const fileName = path.basename(filePath);
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });
  result[fileName] = generateChecksum(content);
});

const cacheBustingFilePath = path.join(rootDir, "src/wasm-cache-busting.json");
fs.writeFileSync(cacheBustingFilePath, JSON.stringify(result, null, 2));
