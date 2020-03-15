import { Observable } from 'rxjs';

/**
 * Loads a JavaScript script async into the page
 * @param id the HTML id for the script
 * @param url the URL to the generated JavaScript loader
 */
export function loadScript(id: string, url: string): Observable<boolean> {
  return new Observable<boolean>(subscriber => {
    let script = <HTMLScriptElement>document.getElementById(id);
    if (script) {
      subscriber.next(false);
      subscriber.complete();
    } else {
      script = document.createElement('script');
      document.body.appendChild(script);

      script.onload = () => {
        subscriber.next(true);
        subscriber.complete();
      };
      script.onerror = (ev: ErrorEvent) => subscriber.error(ev.error);
      script.id = id;
      script.async = true;
      script.src = url;
    }
  });
}

/**
 * Reads a string from the HEAP
 * @param heap the HEAP
 * @param offset the offset
 */
export function utf8ToString(heap: Uint8Array, offset: number) {
  let s = '';
  for (let i = offset; heap[i]; i++) {
    s += String.fromCharCode(heap[i]);
  }
  return s;
}
