import { Component, NgZone } from "@angular/core";
import { EmscriptenWasmComponent } from "../emscripten-wasm.component";

@Component({
  templateUrl: "./text-to-ascii.component.html",
})
export class WasmTextToAsciiComponent extends EmscriptenWasmComponent {
  input: string;
  foregroundChar: string;
  backgroundChar: string;
  output: string;

  constructor(ngZone: NgZone) {
    super("TextAsciiModule", "text-to-ascii.js");

    this.output = "";
    this.foregroundChar = "#";
    this.backgroundChar = ".";

    this.moduleDecorator = (mod) => {
      mod.print = (what: string) => {
        ngZone.run(() => {
          this.output += "\n" + what;
        });
      };
    };
  }

  onSettingsChanged() {
    this.output = "";

    const isInputValid = !!this.input && !!this.foregroundChar && !!this.backgroundChar;
    if (isInputValid) {
      this.module.ccall(
        "display_ascii",
        "void",
        ["string", "string", "string", "string"],
        ["/src/app/wasm/text-to-ascii/text-to-ascii.font.txt", this.input, this.foregroundChar, this.backgroundChar]
      );
    }
  }
}
