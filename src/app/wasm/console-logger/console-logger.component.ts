import { Component, NgZone } from '@angular/core';
import { WasmService } from '../wasm.service';
import { EmWasmComponent } from '../em-wasm.component';

@Component({
  templateUrl: './console-logger.component.html'
})
export class WasmConsoleLoggerComponent extends EmWasmComponent {

  logItems: string[] = [];

  constructor(wasm: WasmService, ngZone: NgZone) {
    super(wasm);

    this.jsFile = 'console-logger.js';
    this.emModule = {
      print: what => {
        ngZone.run(() => {
          this.logItems.push(what);
        });
      }
    };
  }
}