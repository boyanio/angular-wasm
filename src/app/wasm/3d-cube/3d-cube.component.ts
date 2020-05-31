import { Component, ViewChild, ElementRef, NgZone } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EmscriptenWasmComponent } from "../emscripten-wasm.component";

const getFileName = (filePath: string) => filePath.split("/").reverse()[0];

const allowedMimeTypes = ["image/bmp", "image/x-windows-bmp", "image/jpeg", "image/pjpeg", "image/png"];

const defaultImage = "assets/img/3d-cube/angular.png";

const requestFullscreen =
  document.documentElement.requestFullscreen ||
  document.documentElement["webkitRequestFullscreen"] ||
  document.documentElement["msRequestFullscreen"] ||
  document.documentElement["mozRequestFullScreen"];

@Component({
  templateUrl: "./3d-cube.component.html",
  styleUrls: ["./3d-cube.component.css"],
})
export class Wasm3dCubeComponent extends EmscriptenWasmComponent {
  @ViewChild("canvas") canvas: ElementRef;
  predefinedImages: string[];
  error: string;
  fileUploadAccept: string;
  supportsFullscreen: boolean;

  constructor(private httpClient: HttpClient, private ngZone: NgZone) {
    super("Cube3dModule", "3d-cube.js");

    this.supportsFullscreen = !!requestFullscreen;
    this.fileUploadAccept = allowedMimeTypes.join(",");
    this.predefinedImages = [defaultImage, "assets/img/3d-cube/cat.png", "assets/img/3d-cube/embroidery.png"];

    this.moduleDecorator = (mod) => {
      mod.arguments = [getFileName(defaultImage)];
      mod.preRun = [
        () => {
          mod.FS_createPreloadedFile("/", getFileName(defaultImage), defaultImage, true);
        },
      ];
      mod.canvas = <HTMLCanvasElement>this.canvas.nativeElement;
      mod.printErr = (what: string) => {
        if (!what.startsWith("WARNING")) {
          this.ngZone.run(() => (this.error = what));
        }
      };
    };
  }

  toggleFullscreen() {
    if (requestFullscreen) {
      requestFullscreen.bind(this.canvas.nativeElement)();
    }
  }

  selectPredefinedImage(index: number) {
    this.error = null;

    const imageUrl: string = this.predefinedImages[index];
    this.httpClient
      .get(imageUrl, { responseType: "arraybuffer" })
      .subscribe((imageBytes) => this.setTexture(getFileName(imageUrl), new Uint8Array(imageBytes)));
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
      this.setTexture(fileName, inputArray);
    };
    reader.readAsArrayBuffer(file);
  }

  private setTexture(fileName: string, inputArray: Uint8Array) {
    const isDefaultImage = fileName === getFileName(defaultImage);

    // Default image is always there
    if (!isDefaultImage) {
      this.module.FS_createDataFile("/", fileName, inputArray, true);
    }

    this.module.ccall("set_texture", "void", ["string"], [fileName]);

    // Delete the file afterwards to free memory
    if (!isDefaultImage) {
      this.module.FS_unlink(fileName);
    }
  }
}
