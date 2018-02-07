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

async function copyHtaccess() {
  await copyFile('src/.htaccess', 'dist/.htaccess');
  console.log('.htaccess copied to dist');
}

return (async () => {
  await fixBaseHref();
  await copyHtaccess();
})();