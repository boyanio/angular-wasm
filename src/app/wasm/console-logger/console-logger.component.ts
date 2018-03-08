import { Component, NgZone } from '@angular/core';
import { EmWasmComponent } from '../em-wasm.component';

@Component({
  templateUrl: './console-logger.component.html'
})
export class WasmConsoleLoggerComponent extends EmWasmComponent {

  logItems: string[] = [];

  constructor(ngZone: NgZone) {
    super();

    this.jsFile = 'console-logger.js';
    this.emModule = () => ({
      print: what => {
        ngZone.run(() => this.logItems.push(what));
      }
    });
  }
}