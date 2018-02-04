import '../../rxjs-imports';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { WasmHelloWorldComponent } from './hello-world/hello-world.component';
import { WasmConsoleLoggerComponent } from './console-logger/console-logger.component';
import { WasmTextToAsciiComponent } from './text-to-ascii/text-to-ascii.component';

import { WasmService } from './wasm.service';

@NgModule({
  declarations: [
    WasmConsoleLoggerComponent,
    WasmHelloWorldComponent,
    WasmTextToAsciiComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    WasmConsoleLoggerComponent,
    WasmHelloWorldComponent,
    WasmTextToAsciiComponent
  ],
  providers: [
    WasmService
  ]
})
export class WasmModule { }