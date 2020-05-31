import { AfterViewInit } from "@angular/core";
import { loadScript } from "./tools";
import { environment } from "../../environments/environment";

type EmscriptenModuleDecorator = (module: EmscriptenModule) => void;

export abstract class EmscriptenWasmComponent implements AfterViewInit {
  private resolvedModule: EmscriptenModule;
  protected moduleDecorator: EmscriptenModuleDecorator;

  protected constructor(private moduleExportName: string, private wasmJavaScriptLoader: string) {}

  get module(): EmscriptenModule {
    return this.resolvedModule;
  }

  ngAfterViewInit(): void {
    this.resolveModule();
  }

  protected resolveModule(): void {
    loadScript(this.moduleExportName, `${environment.wasmAssetsPath}/${this.wasmJavaScriptLoader}`).then(() => {
      const module = <EmscriptenModule>{
        locateFile: (file: string) => `${environment.wasmAssetsPath}/${file}`,
      };
      const moduleDecorator: EmscriptenModuleDecorator = this.moduleDecorator || ((mod: EmscriptenModule) => mod);
      moduleDecorator(module);

      this.resolvedModule = window[this.moduleExportName](module);
    });
  }
}
