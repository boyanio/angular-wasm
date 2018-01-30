import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class WasmService {

  constructor(private http: HttpClient) { }

  instantiateJs(url: string): Observable<string> {
    const script = document.createElement('script');
    script.async = true;
    document.body.appendChild(script);

    return new Observable<string>(subscriber => {
      script.onload = () => {
        subscriber.next(script.innerHTML);
        subscriber.complete();
      };
      script.onerror = (ev: ErrorEvent) => subscriber.error(ev.error);
      script.src = url;
    });
  }

  instantiateWasm(url: string, imports?: Object): Observable<WebAssembly.Instance> {
    return this.http.get(url, { responseType: 'arraybuffer' })
      .mergeMap(bytes => WebAssembly.compile(bytes))
      .mergeMap(wasmModule => WebAssembly.instantiate(wasmModule, imports));
  }

  createDefaultImports() {
    return {
      env: {
        memory: new WebAssembly.Memory({ initial: 256 })
      }
    };
  }

  utf8ToString(heap: Uint8Array, offset: number): string {
    let s = '';
    for (let i = offset; heap[i]; i++) {
      s += String.fromCharCode(heap[i]);
    }
    return s;
  }
}