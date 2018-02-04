import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { WasmHelloWorldComponent } from './wasm/hello-world/hello-world.component';
import { WasmConsoleLoggerComponent } from './wasm/console-logger/console-logger.component';
import { WasmTextToAsciiComponent } from './wasm/text-to-ascii/text-to-ascii.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hello-world', component: WasmHelloWorldComponent, data: { demo: true, name: 'Hello, World' } },
  { path: 'console-logger', component: WasmConsoleLoggerComponent, data: { demo: true, name: 'Console Logger' } },
  { path: 'text-to-ascii', component: WasmTextToAsciiComponent, data: { demo: true, name: 'Text to ASCII art converter' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }