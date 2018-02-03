import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { WasmService } from '../wasm.service';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: './console-logger.component.html'
})
export class WasmConsoleLoggerComponent implements OnInit, OnDestroy {

  logItems: string[] = [];

  constructor(private wasm: WasmService, private ngZone: NgZone) { }

  ngOnInit(): void {
    const mod: EmModule = {
      locateFile: file => `${environment.wasmAssetsPath}/${file}`,
      print: what => {
        this.ngZone.run(() => {
          this.logItems.push(what);
        });
      }
    };

    this.wasm.instantiateJs(`${environment.wasmAssetsPath}/console-logger.js`, mod).subscribe();
  }

  ngOnDestroy(): void {
    this.wasm.exitActiveEnvironment();
  }
}