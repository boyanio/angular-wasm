import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WasmService } from '../wasm.service';
import { EmWasmComponent } from '../em-wasm.component';

const getFileName = (filePath: string) => filePath.split('/').reverse()[0];

@Component({
  templateUrl: './3d-cube.component.html',
  styleUrls: ['./3d-cube.component.css']
})
export class Wasm3dCubeComponent extends EmWasmComponent {

  @ViewChild('canvas') canvas: ElementRef;
  predefinedImages: string[];

  constructor(wasm: WasmService, private httpClient: HttpClient) {
    super(wasm);

    this.jsFile = '3d-cube.js';
    this.predefinedImages = ['assets/img/3d-cube/angular.png', 'assets/img/3d-cube/cat.png', 'assets/img/3d-cube/embroidery.png'];
    this.emModule = () => ({
      preRun: [
        () => FS.createPreloadedFile('/', 'angular.png', 'assets/img/3d-cube/angular.png', true)
      ],
      canvas: <HTMLCanvasElement>this.canvas.nativeElement
    });
  }

  selectPredefinedImage(index: number) {
    const imageUrl: string = this.predefinedImages[index];
    this.httpClient.get(imageUrl, { responseType: 'arraybuffer' })
      .subscribe(imageBytes => this.setTexture(getFileName(imageUrl), new Uint8Array(imageBytes)));
  }

  onFileUploaded(files: FileList) {
    if (!files.length) {
      return;
    }

    const file = files[0];
    const fileName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      const inputArray = new Uint8Array(reader.result);
      this.setTexture(fileName, inputArray);
    };
    reader.readAsArrayBuffer(file);
  }

  private setTexture(fileName: string, inputArray: Uint8Array) {
    this.wasm.createDataFile(fileName, inputArray, true);
    Module.ccall('set_texture', 'void', ['string'], [fileName]);
  }
}