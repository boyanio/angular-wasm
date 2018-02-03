/**
 * This is a simple typings definition for Emscripten's Module object
 */
interface EmModule {
  noExitRuntime?: boolean;
  print?: (what: string) => void;
  exit?: (status: number, implicit?: boolean) => void;
  locateFile?: (file: string) => string;
}

interface Window {
  Module: EmModule;
}