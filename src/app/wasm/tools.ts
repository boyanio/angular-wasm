/**
 * Loads a JavaScript script async into the page
 *
 * @param id the HTML id for the script
 * @param url the URL to the generated JavaScript loader
 */
export function loadScript(id: string, url: string): Promise<void> {
  let script = <HTMLScriptElement>document.getElementById(id);
  if (script) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    script = document.createElement("script");
    document.body.appendChild(script);

    script.onload = () => resolve();
    script.onerror = (ev: ErrorEvent) => reject(ev.error);
    script.id = id;
    script.async = true;
    script.src = url;
  });
}

/**
 * Reads a string from a HEAP
 *
 * @param heap the HEAP
 * @param offset the offset
 */
export function utf8ToString(heap: Uint8Array, offset: number) {
  let s = "";
  for (let i = offset; heap[i]; i++) {
    s += String.fromCharCode(heap[i]);
  }
  return s;
}
