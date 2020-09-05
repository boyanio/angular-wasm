import { AfterViewInit, Directive } from "@angular/core";
import { loadScript } from "./tools";
import { environment } from "../../environments/environment";
import wasmCacheBusting from "../../wasm-cache-busting.json";

type EmscriptenModuleDecorator = (module: EmscriptenModule) => void;

const noopModuleDecorator = (mod: EmscriptenModule) => mod;

@Directive()
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
    const jsVersion = wasmCacheBusting[this.wasmJavaScriptLoader]
      ? `?v=${wasmCacheBusting[this.wasmJavaScriptLoader]}`
      : "";
    loadScript(this.moduleExportName, `${environment.wasmAssetsPath}/${this.wasmJavaScriptLoader}${jsVersion}`)
      .then(() => {
        const module = <EmscriptenModule>{
          locateFile: (file: string) => {
            const fileVersion = wasmCacheBusting[file] ? `?v=${wasmCacheBusting[file]}` : "";
            return `${environment.wasmAssetsPath}/${file}${fileVersion}`;
          },
        };
        const moduleDecorator: EmscriptenModuleDecorator = this.moduleDecorator || noopModuleDecorator;
        moduleDecorator(module);

        return window[this.moduleExportName](module);
      })
      .then((mod) => {
        this.resolvedModule = mod;
      });
  }
}
