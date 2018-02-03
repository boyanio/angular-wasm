import { Component, Input, OnInit, NgZone } from '@angular/core';
import { WasmService } from '../wasm.service';

@Component({
  selector: 'app-wasm-hello-world',
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

  constructor(private wasm: WasmService, private ngZone: NgZone) { }

  ngOnInit(): void {
    const imports = this.wasm.createDefaultImports();
    Object.assign(imports.env, {
      _say: ptr => {
        const what = this.wasm.utf8ToString(new Uint8Array(imports.env.memory.buffer), ptr);
        this.ngZone.run(() => this.title = what);
      }
    });
    this.wasm.instantiateWasm('/assets/wasm/hello-world.wasm', imports)
      .subscribe(wasmInstance => {
        this.wasmInstance = wasmInstance;
        this.wasmInstance.exports._main();
        this.loaded = true;
      });
  }

  multiply() {
    this.result = this.wasmInstance.exports._mul(this.firstNumber, this.secondNumber);
  }
}