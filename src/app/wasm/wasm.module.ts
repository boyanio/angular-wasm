import '../../rxjs-imports';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { WasmHelloWorldComponent } from './hello-world/hello-world.component';
import { WasmConsoleLoggerComponent } from './console-logger/console-logger.component';
import { WasmTextToAsciiComponent } from './text-to-ascii/text-to-ascii.component';
import { WasmBmpToAsciiComponent } from './bmp-to-ascii/bmp-to-ascii.component';
import { Wasm3dCubeComponent } from './3d-cube/3d-cube.component';

import { WasmService } from './wasm.service';

@NgModule({
  declarations: [
    WasmHelloWorldComponent,
    WasmConsoleLoggerComponent,
    WasmTextToAsciiComponent,
    WasmBmpToAsciiComponent,
    Wasm3dCubeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [
    WasmHelloWorldComponent,
    WasmConsoleLoggerComponent,
    WasmTextToAsciiComponent,
    WasmBmpToAsciiComponent,
    Wasm3dCubeComponent
  ],
  providers: [
    WasmService
  ]
})
export class WasmModule { }