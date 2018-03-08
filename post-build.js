const { promisify } = require('util');
const fs = require('fs');

const copyFile = promisify(fs.copyFile);

async function copyFileToFolder(src, dest) {
  await copyFile(src, dest);
  console.log(`${src} copied to ${dest}`);
}

return (async () => {
  await copyFileToFolder('src/.htaccess', 'dist/.htaccess');
})();