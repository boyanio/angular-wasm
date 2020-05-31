import { Component, NgZone } from "@angular/core";
import { EmscriptenWasmComponent } from "../emscripten-wasm.component";

@Component({
  templateUrl: "./console-logger.component.html",
})
export class WasmConsoleLoggerComponent extends EmscriptenWasmComponent {
  logItems: string[] = [];

  constructor(ngZone: NgZone) {
    super("ConsoleLoggerModule", "console-logger.js");

    this.moduleDecorator = (mod) => {
      mod.print = (what: string) => {
        ngZone.run(() => this.logItems.push(what));
      };
    };
  }
}
