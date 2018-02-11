const { promisify } = require('util');
const fs = require('fs');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);

async function fixBaseHref() {
  const indexHtml = await readFile('dist/index.html', 'utf8');
  const updatedHtml = indexHtml.replace('<base href="/">', '<base href="/angular-wasm/">');
  await writeFile('dist/index.html', updatedHtml);
  console.log('base href fixed on dist/index.html');
}

async function copyFileToFolder(src, dest) {
  await copyFile(src, dest);
  console.log(`${src} copied to ${dest}`);
}

return (async () => {
  await fixBaseHref();
  await copyFileToFolder('src/.htaccess', 'dist/.htaccess');
})();