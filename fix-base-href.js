const { promisify } = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

return (async () => {
  const indexHtml = await readFile('dist/index.html', 'utf8');
  const updatedHtml = indexHtml.replace('<base href="/">', '<base href="/angular-wasm/">');
  await writeFile('dist/index.html', updatedHtml);
  console.log('base href fixed on dist/inde.html');
})();