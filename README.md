# Angular & WebAssembly

A simple project showing how WebAssembly could be used in Angular in form of components and helper services.

## Prerequisites

You need to download and install Emscripten as described on the official [website](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html).

I have tested the build using Emscripten 1.39.10

## Build

To build the demo, run the following in the root folder:

```
npm install
npm start
```

Then you can open your browser at `http://localhost:4200` to see the demo.

### Pre-compiled dependencies

For some of the examples, I have pre-compiled parts of the C/C++ source into linked bitcode (*.bc* files) to ease the build process.

+ [libSOIL](https://github.com/boyanio/SOIL-wasm) - Simple OpenGL Image Library (SOIL) is a tiny C library used primarily for uploading textures into OpenGL

## Questions & contribution

You can follow me on Twitter [@boyanio](https://twitter.com/boyanio) and ask me questions you might have. You can also open an issue here on GitHub. Pull requests are welcome too :-)
