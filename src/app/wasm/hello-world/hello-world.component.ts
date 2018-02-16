import { Component, Input, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

const utf8ToString = (heap: Uint8Array, offset: number) => {
  let s = '';
  for (let i = offset; heap[i]; i++) {
    s += String.fromCharCode(heap[i]);
  }
  return s;
};

@Component({
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class WasmHelloWorldComponent implements OnInit {

  title: string;
  loaded: boolean;
  firstNumber: number;
  secondNumber: number;
  result: number;
  wasmInstance: WebAssembly.Instance;

  constructor(private http: HttpClient, private ngZone: NgZone) { }

  ngOnInit(): void {
    const imports = {
      env: {
        memoryBase: 0,
        memory: new WebAssembly.Memory({ initial: 256 }),
        tableBase: 0,
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
        _say: ptr => {
          const what = utf8ToString(new Uint8Array(imports.env.memory.buffer), ptr);
          this.ngZone.run(() => this.title = what);
        }
      }
    };

    this.instantiateWasm(`${environment.wasmAssetsPath}/hello-world.wasm`, imports)
      .subscribe(wasmInstance => {
        this.wasmInstance = wasmInstance;
        this.wasmInstance.exports._main();
        this.loaded = true;
      });
  }

  multiply() {
    this.result = this.wasmInstance.exports._mul(this.firstNumber, this.secondNumber);
  }

  private instantiateWasm(url: string, imports?: Object): Observable<WebAssembly.Instance> {
    return this.http.get(url, { responseType: 'arraybuffer' })
      .mergeMap(bytes => WebAssembly.compile(bytes))
      .mergeMap(wasmModule => WebAssembly.instantiate(wasmModule, imports));
  }
}