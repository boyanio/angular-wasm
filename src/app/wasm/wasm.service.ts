import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class WasmService {

  constructor(private http: HttpClient) { }

  instantiate(url: string, imports?: Object): Observable<WebAssembly.ResultObject> {
    return this.http.get(url, { responseType: 'arraybuffer' })
      .mergeMap(bytes => WebAssembly.instantiate(bytes, imports));
  }

  createDefaultImports() {
    return {
      env: {
        memoryBase: 0,
        memory: new WebAssembly.Memory({ initial: 256 }),
        tableBase: 0,
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
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