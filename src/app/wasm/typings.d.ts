/**
 * This is a simple typings definition for Emscripten's Module object
 */
interface EmReadFileOptions {
  encoding?: 'utf8' | 'binary';
  flags?: string;
}

interface CcallOptions {
  async?: boolean;
}

interface EmModule {
  noExitRuntime?: boolean;
  print?(what: string): void;
  printErr?(what: string): void;
  exit?(status: number, implicit?: boolean): void;
  locateFile?(file: string): string;
  arguments?: string[];
  ccall?(funcName: string, returnType: string, argumentTypes: string[], arguments: any[], options?: CcallOptions): any;
  preRun?: Function[];
  canvas?: HTMLCanvasElement;
}

interface EmFileSystem {
  createPreloadedFile(parent: string, name: string, url: string, canRead?: boolean, canWrite?: boolean); void;
  createDataFile(parent: string, name: string, data: string | Uint8Array, canRead?: boolean, canWrite?: boolean, canOwn?: boolean): void;
  readFile(url: string, options?: EmReadFileOptions): any;
  unlink(path: string): void;
}

interface Window {
  Module: EmModule;
  FS: EmFileSystem;
}

declare var FS: EmFileSystem;
declare var Module: EmModule;