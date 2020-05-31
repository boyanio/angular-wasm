const { promisify } = require("util");
const fs = require("fs");
const path = require("path");

const copyFile = promisify(fs.copyFile);

const rootDir = path.resolve(__dirname, "../");

async function copyFileToFolder(src, dest) {
  await copyFile(src, dest);
  console.log(`${src} copied to ${dest}`);
}

return (async () => {
  await copyFileToFolder(path.join(rootDir, "src/.htaccess"), path.join(rootDir, "dist/.htaccess"));
})();
