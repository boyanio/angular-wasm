/**
 * This is a simple typings definition for Emscripten's Module object
 */
interface EmModule {
  noExitRuntime?: boolean;
  print?: (what: string) => void;
  exit?: (status: number, implicit?: boolean) => void;
  locateFile?: (file: string) => string;
  arguments?: string[];
  preRun?: () => void;
  ccall?: (funcName: string, returnType: string, argumentTypes: string[], arguments: any[]) => any;
}

interface EmFileSystem {
  createPreloadedFile: (parent: string, name: string, url: string, canRead?: boolean, canWrite?: boolean) => void;
}

interface Window {
  Module: EmModule;
  FS: EmFileSystem;
}

declare var FS: EmFileSystem;
declare var Module: EmModule;