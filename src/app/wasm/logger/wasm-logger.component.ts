import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { WasmService } from '../wasm.service';

@Component({
  selector: 'app-wasm-logger',
  templateUrl: './wasm-logger.component.html'
})
export class WasmLoggerComponent implements OnInit, OnDestroy {

  logItems: string[] = [];

  constructor(private wasm: WasmService, private ngZone: NgZone) { }

  ngOnInit(): void {
    const mod: EmModule = {
      locateFile: file => `/assets/wasm/${file}`,
      print: what => {
        this.ngZone.run(() => {
          this.logItems.push(what);
        });
      }
    };

    this.wasm.instantiateJs("/assets/wasm/wasm-logger.js", mod).subscribe();
  }

  ngOnDestroy(): void {
    this.wasm.exitActiveEnvironment();
  }
}