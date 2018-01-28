import './rxjs-imports';
import { NgModule } from '@angular/core';
import { WasmComponent } from './wasm.component';
import { Wasm3dComponent } from './wasm-3d.component';

@NgModule({
  declarations: [
    WasmComponent,
    Wasm3dComponent
  ],
  exports: [
    WasmComponent,
    Wasm3dComponent
  ]
})
export class WasmModule { }