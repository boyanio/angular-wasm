import '../../rxjs-imports';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { WasmLoggerComponent } from './logger/wasm-logger.component';
import { WasmService } from './wasm.service';

@NgModule({
  declarations: [
    WasmLoggerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  exports: [
    WasmLoggerComponent
  ],
  providers: [
    WasmService
  ]
})
export class WasmModule { }