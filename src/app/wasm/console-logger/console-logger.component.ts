import { Component, NgZone } from '@angular/core';
import { EmWasmComponent } from '../em-wasm.component';

@Component({
  templateUrl: './console-logger.component.html'
})
export class WasmConsoleLoggerComponent extends EmWasmComponent {

  logItems: string[] = [];

  constructor(ngZone: NgZone) {
    super();

    this.setupWasm(
      'ConsoleLoggerModule',
      'console-logger.js',
      mod => Object.assign(mod, {
        print: (what: string) => {
          ngZone.run(() => this.logItems.push(what));
        }
      }));
  }
}