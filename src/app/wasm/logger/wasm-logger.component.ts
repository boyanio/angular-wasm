import { Component, Input, OnInit, NgZone } from '@angular/core';
import { WasmService } from '../wasm.service';

@Component({
  selector: 'app-wasm-logger',
  templateUrl: './wasm-logger.component.html'
})
export class WasmLoggerComponent implements OnInit {
  logItems: string[] = [];

  constructor(private wasm: WasmService, private ngZone: NgZone) { }

  ngOnInit(): void {
    const Module = {
      locateFile: file => `/assets/wasm/${file}`,
      print: what => {
        this.ngZone.run(() => {
          this.logItems.push(what);
        });
      }
    };
    window["Module"] = Module;

    this.wasm.instantiateJs("/assets/wasm/wasm-logger.js").subscribe();
  }
}