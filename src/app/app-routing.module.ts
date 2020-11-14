import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { WasmFibonacciComponent } from "./wasm/fibonacci/fibonacci.component";
import { WasmConsoleLoggerComponent } from "./wasm/console-logger/console-logger.component";
import { WasmTextToAsciiComponent } from "./wasm/text-to-ascii/text-to-ascii.component";
import { WasmBmpToAsciiComponent } from "./wasm/bmp-to-ascii/bmp-to-ascii.component";
import { Wasm3dCubeComponent } from "./wasm/3d-cube/3d-cube.component";
import { WasmProofOfWorkComponent } from "./wasm/proof-of-work/proof-of-work.component";
import { WasmPersonRecordComponent } from "./wasm/person-record/person-record.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "fibonacci",
    component: WasmFibonacciComponent,
    data: { demo: true, name: "Fibonacci battlefield" },
  },
  {
    path: "console-logger",
    component: WasmConsoleLoggerComponent,
    data: { demo: true, name: "Console logger" },
  },
  {
    path: "text-to-ascii",
    component: WasmTextToAsciiComponent,
    data: { demo: true, name: "Text to ASCII art converter" },
  },
  {
    path: "bmp-to-ascii",
    component: WasmBmpToAsciiComponent,
    data: { demo: true, name: "Bitmap to ASCII art converter" },
  },
  { path: "3d-cube", component: Wasm3dCubeComponent, data: { demo: true, name: "3D cube" } },
  {
    path: "proof-of-work",
    component: WasmProofOfWorkComponent,
    data: { demo: true, name: "Proof of work" },
  },
  {
    path: "person-record",
    component: WasmPersonRecordComponent,
    data: { demo: true, name: "Person Record" },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
