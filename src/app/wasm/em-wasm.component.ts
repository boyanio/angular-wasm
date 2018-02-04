import { OnInit, OnDestroy } from '@angular/core';
import { WasmService } from './wasm.service';
import { environment } from '../../environments/environment';

export class EmWasmComponent implements OnInit, OnDestroy {

  jsFile: string;
  emModule: EmModule;

  constructor(protected wasm: WasmService) { }

  ngOnInit(): void {
    const mod: EmModule = this.emModule || {};
    if (!mod.locateFile) {
      mod.locateFile = file => `${environment.wasmAssetsPath}/${file}`;
    };

    this.wasm.instantiateJs(`${environment.wasmAssetsPath}/${this.jsFile}`, mod).subscribe();
  }

  ngOnDestroy(): void {
    this.wasm.exitActiveEnvironment();
  }
}