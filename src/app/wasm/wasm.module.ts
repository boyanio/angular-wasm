import '../../rxjs-imports';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { WasmConsoleLoggerComponent } from './console-logger/console-logger.component';
import { WasmHelloWorldComponent } from './hello-world/hello-world.component';
import { WasmService } from './wasm.service';

@NgModule({
  declarations: [
    WasmConsoleLoggerComponent,
    WasmHelloWorldComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    WasmConsoleLoggerComponent,
    WasmHelloWorldComponent
  ],
  providers: [
    WasmService
  ]
})
export class WasmModule { }