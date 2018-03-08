import { AfterViewInit, OnDestroy } from '@angular/core';
import { instantiateJs, exitActiveEnvironment } from './tools';
import { environment } from '../../environments/environment';

export abstract class EmWasmComponent implements AfterViewInit, OnDestroy {

  jsFile: string;
  emModule?: () => EmModule;

  ngAfterViewInit(): void {
    const mod: EmModule = (this.emModule && this.emModule()) || {};
    if (!mod.locateFile) {
      mod.locateFile = file => `${environment.wasmAssetsPath}/${file}`;
    }

    instantiateJs(`${environment.wasmAssetsPath}/${this.jsFile}`, mod).subscribe();
  }

  ngOnDestroy(): void {
    exitActiveEnvironment();
  }
}