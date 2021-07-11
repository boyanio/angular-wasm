# Angular & WebAssembly

This project shows how WebAssembly could be used in Angular in form of components and helper services. The examples are written in C/C++ and compiled to WebAssembly using [Emscripten](https://emscripten.org).

You can find the following examples:

- **Fibonacci** shows the "raw" communication between JavaScript and WebAssembly without using Emscripten's glue code. Inspired by [devlucky](https://hackernoon.com/how-to-get-a-performance-boost-using-webassembly-8844ec6dd665), the example demonstrates the performance difference between JavaScript and WebAssembly when calculating Fibonacci series using three different implementations.
- **Console Logger** binds to window click directly in the C code by using Emscripten's library. The C code uses `printf`, which I have overloaded to add items to the list instead of printing them to the console (default behavior).
- **Text-to-ASCII** allows you to convert text to ASCII art on the fly.
- **BPM-to-ASCII** allows you to convert simple bitmaps to ASCII art.
- **3D Cube** shows how you can render 3D graphics using OpenGL (which is then converted to WebGL) and manipulate it on the fly.
- **Proof of Work** is a simple [Proof of Work](https://en.bitcoin.it/wiki/Proof_of_work) system (similar to the one used in bitcoin), which demonstrates activities that might take long time to complete.
- **Person Record** shows how to pass complex data between JavaScript and WebAssembly.

## Build

You need Docker installed on your machine to compile the C/C++ examples to WebAssembly.  

To build the demo locally run:

```
npm i
npm run wasm
npm start
```

Then you can open your browser at `http://localhost:4200` to see it.

### Pre-compiled dependencies

For some of the examples, I have pre-compiled parts of the C/C++ source into linked bitcode (_.bc_ files) to ease the build process.

- [libSOIL](https://github.com/boyanio/SOIL-wasm) - Simple OpenGL Image Library (SOIL) is a tiny C library used primarily for uploading textures into OpenGL

## Questions & contribution

You can reach me on Twitter [@boyanio](https://twitter.com/boyanio). You can also open an issue here on GitHub or make a Pull-Request directly.
