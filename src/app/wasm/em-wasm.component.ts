import { AfterViewInit } from '@angular/core';
import { loadScript } from './tools';
import { environment } from '../../environments/environment';

export abstract class EmWasmComponent implements AfterViewInit {

  protected module: EmModule;
  private moduleId: string;
  private wasmJavaScriptLoader: string;
  private moduleFactory: (mod: EmModule) => EmModule;

  protected setupWasm(moduleId: string, wasmJavaScriptLoader: string, moduleFactory: (mod: EmModule) => EmModule) {
    this.moduleId = moduleId;
    this.wasmJavaScriptLoader = wasmJavaScriptLoader;
    this.moduleFactory = moduleFactory;
  }

  ngAfterViewInit(): void {
    loadScript(this.moduleId, `${environment.wasmAssetsPath}/${this.wasmJavaScriptLoader}`)
      .subscribe(() => {
        const baseModule = <EmModule>{
          locateFile: (file: string) => `${environment.wasmAssetsPath}/${file}`
        };
        this.module = window[this.moduleId](this.moduleFactory(baseModule));
      });
  }


  /**
   * Creates a danew data file in the memory
   * @param fileName the file name
   * @param inputArray the file contents
   */
  protected createDataFile(fileName: string, inputArray: Uint8Array, canRead?: boolean, canWrite?: boolean) {
    try {
      this.module.FS_createDataFile('/', fileName, inputArray, canRead, canWrite);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  }

  /**
   * Reads a file from the memory as a text
   * @param fileName the file name
   */
  protected readTextFile(fileName: string): string {
    return this.module.FS_readFile(fileName, { encoding: 'utf8' });
  }
}