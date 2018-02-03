import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { WasmLoggerComponent } from './wasm/logger/wasm-logger.component';
import { WasmHelloWorldComponent } from './wasm/hello-world/hello-world.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hello-world', component: WasmHelloWorldComponent, data: { demo: true, name: 'Hello, World' } },
  { path: 'logger', component: WasmLoggerComponent, data: { demo: true, name: 'Console Logger' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }