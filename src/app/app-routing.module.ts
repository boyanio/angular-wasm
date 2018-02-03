import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { WasmLoggerComponent } from './wasm/logger/wasm-logger.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'logger', component: WasmLoggerComponent, data: { demo: true, name: 'Console Logger' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }