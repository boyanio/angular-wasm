import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const utf8ToString = (heap, offset) => {
  let s = '';
  for (let i = offset; heap[i]; i++) {
    s += String.fromCharCode(heap[i]);
  }
  return s;
};

@Component({
  selector: 'ng-wasm-3d',
  template: '<canvas style="width: 100%; height: 100%; border: 0;" oncontextmenu="event.preventDefault()"></canvas>'
})
export class Wasm3dComponent implements OnInit {
  @Input() url: string;
  @Input() imports?: Object;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(this.url, { responseType: 'arraybuffer' })
      .mergeMap(bytes => WebAssembly.compile(bytes))
      .mergeMap(wasmModule => {
        const memory = new WebAssembly.Memory({ initial: 256 });
        const minImports = {
          env: {
            memoryBase: 0,
            tableBase: 0,
            memory,
            table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
            _printf: ptr => {
              const heap = new Uint8Array(memory.buffer);
              console.log(utf8ToString(heap, ptr));
            }
          }
        };
        return WebAssembly.instantiate(wasmModule, Object.assign(minImports, this.imports || {}));
      })
      .subscribe(wasmInstance => {
        if (wasmInstance.exports._main) {
          wasmInstance.exports._main();
        }
      });
  }
}