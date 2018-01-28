import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { WasmModule } from './wasm/wasm.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WasmModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }