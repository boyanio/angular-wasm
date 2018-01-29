import { Component, Input, OnInit } from '@angular/core';
import { WasmService } from './wasm.service';

@Component({
  selector: 'ng-wasm-logger',
  template: `
    <ul>
      <li *ngFor="let logItem of logItems">{{ logItem }}</li>
    </ul>
  `
})
export class WasmLoggerComponent implements OnInit {
  @Input() url: string;
  @Input() imports?: Object;
  logItems: string[] = [];

  constructor(private wasm: WasmService) { }

  ngOnInit(): void {
    const imports = this.wasm.createDefaultImports();
    const heap = new Uint8Array(imports.env.memory.buffer);
    const env: any = imports.env;
    env._puts = env._printf = (ptr) => {
      this.logItems.push(this.wasm.utf8ToString(heap, ptr));
    };

    this.wasm.instantiate(this.url, imports)
      .subscribe(instance => {
        if (instance.exports._main) {
          instance.exports._main();
        }
      });
  }
}