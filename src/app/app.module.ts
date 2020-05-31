import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { WasmModule } from "./wasm/wasm.module";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";

@NgModule({
  imports: [BrowserModule, AppRoutingModule, WasmModule],
  declarations: [AppComponent, HomeComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
