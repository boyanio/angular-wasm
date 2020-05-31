import { Component, NgZone } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { SafeUrl } from "@angular/platform-browser";
import { EmscriptenWasmComponent } from "../emscripten-wasm.component";

const getFileName = (filePath: string) => filePath.split("/").reverse()[0];

const allowedMimeTypes = ["image/bmp", "image/x-windows-bmp"];

@Component({
  templateUrl: "./bmp-to-ascii.component.html",
  styleUrls: ["./bmp-to-ascii.component.css"],
})
export class WasmBmpToAsciiComponent extends EmscriptenWasmComponent {
  output: string;
  uploadedFile: SafeUrl;
  predefinedImages: string[];
  error: string;
  fileUploadAccept: string;

  constructor(private ngZone: NgZone, private domSanitizer: DomSanitizer, private httpClient: HttpClient) {
    super("BmpAsciiModule", "bmp-to-ascii.js");

    this.fileUploadAccept = allowedMimeTypes.join(",");
    this.predefinedImages = [
      "assets/img/ascii/hello.bmp",
      "assets/img/ascii/angular.bmp",
      "assets/img/ascii/heart.bmp",
    ];

    this.moduleDecorator = (mod) => {
      mod.printErr = (what: string) => {
        this.ngZone.run(() => (this.error = what));
      };
    };
  }

  convertPredefinedBitmap(index: number) {
    this.uploadedFile = null;
    this.error = null;

    const imageUrl: string = this.predefinedImages[index];
    this.httpClient.get(imageUrl, { responseType: "arraybuffer" }).subscribe((imageBytes) => {
      this.convertToAscii(getFileName(imageUrl), new Uint8Array(imageBytes));
    });
  }

  onFileUploaded(files: FileList) {
    if (!files.length) {
      return;
    }

    this.error = null;

    const file = files[0];
    if (allowedMimeTypes.indexOf(file.type) < 0) {
      this.error = `Unsupported mime type ${file.type}`;
      return;
    }

    const fileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      const inputArray = new Uint8Array(<ArrayBuffer>reader.result);
      this.convertToAscii(fileName, inputArray);

      this.ngZone.run(() => {
        this.uploadedFile = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob([inputArray])));
      });
    };
    reader.readAsArrayBuffer(file);
  }

  private convertToAscii(fileName: string, inputArray: Uint8Array) {
    // Create a virtual file name from the selected file
    this.createDataFile(fileName, inputArray, true);
    const resultCode = this.module.ccall("bmp_to_ascii", "int", ["string"], [fileName]);
    this.module.FS_unlink(fileName);

    if (resultCode) {
      throw Error("The selected file cannot be converted to ASCII");
    }

    this.ngZone.run(() => {
      // Read the contents of the created virtual output file
      this.output = this.module.FS_readFile("output.txt", { encoding: "utf8" });
    });
  }

  private createDataFile(fileName: string, inputArray: Uint8Array, canRead?: boolean, canWrite?: boolean) {
    try {
      this.module.FS_createDataFile("/", fileName, inputArray, canRead, canWrite);
    } catch (err) {
      if (err.code !== "EEXIST") {
        throw err;
      }
    }
  }
}
