import { Component, Input, OnInit } from '@angular/core';
import { WasmService } from './wasm.service';

@Component({
  selector: 'ng-wasm',
  template: `
    <ul>
      <li *ngFor="let logItem of logItems">{{ logItem }}</li>
    </ul>
  `
})
export class WasmComponent implements OnInit {
  @Input() url: string;
  @Input() imports?: Object;
  logItems: string[] = [];

  constructor(private wasm: WasmService) { }

  ngOnInit(): void {
    const imports = this.wasm.createDefaultImports();
    const env: any = imports.env;
    env._printf = ptr => {
      const heap = new Uint8Array(imports.env.memory.buffer);
      this.logItems.push(this.wasm.utf8ToString(heap, ptr));
    };

    this.wasm.instantiate(this.url, imports)
      .subscribe(result => {
        if (result.instance.exports._main) {
          result.instance.exports._main();
        }
      });
  }
}