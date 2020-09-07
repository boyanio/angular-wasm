import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { LaddaModule } from "angular2-ladda";

import { HumanizeTimePipe } from "./humanize-time-pipe";

import { WasmFibonacciComponent } from "./fibonacci/fibonacci.component";
import { WasmConsoleLoggerComponent } from "./console-logger/console-logger.component";
import { WasmTextToAsciiComponent } from "./text-to-ascii/text-to-ascii.component";
import { WasmBmpToAsciiComponent } from "./bmp-to-ascii/bmp-to-ascii.component";
import { Wasm3dCubeComponent } from "./3d-cube/3d-cube.component";
import { WasmProofOfWorkComponent } from "./proof-of-work/proof-of-work.component";
import { WasmPersonRecordComponent } from "./person-record/person-record.component";

@NgModule({
  declarations: [
    HumanizeTimePipe,
    WasmFibonacciComponent,
    WasmConsoleLoggerComponent,
    WasmTextToAsciiComponent,
    WasmBmpToAsciiComponent,
    Wasm3dCubeComponent,
    WasmProofOfWorkComponent,
    WasmPersonRecordComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    LaddaModule.forRoot({
      style: "zoom-in",
      spinnerSize: 30,
    }),
  ],
})
export class WasmModule {}
