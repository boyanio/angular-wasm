import { Component, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { WasmService } from '../wasm.service';
import { EmWasmComponent } from '../em-wasm.component';

const getFileName = (filePath: string) => filePath.split('/').reverse()[0];

@Component({
  templateUrl: './bmp-to-ascii.component.html',
  styleUrls: ['./bmp-to-ascii.component.css']
})
export class WasmBmpToAsciiComponent extends EmWasmComponent {

  output: string;
  uploadedFile: SafeUrl;
  predefinedImages: string[];

  constructor(
    wasm: WasmService,
    private ngZone: NgZone,
    private domSanitizer: DomSanitizer,
    private httpClient: HttpClient) {

    super(wasm);

    this.jsFile = 'bmp-to-ascii.js';
    this.predefinedImages = ['assets/img/ascii/hello.bmp', 'assets/img/ascii/angular.bmp', 'assets/img/ascii/heart.bmp'];
  }

  convertPredefinedBitmap(index: number) {
    const imageUrl: string = this.predefinedImages[index];
    this.httpClient.get(imageUrl, { responseType: 'arraybuffer' })
      .subscribe(imageBytes => this.convertToAscii(getFileName(imageUrl), new Uint8Array(imageBytes)));
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
      this.convertToAscii(fileName, inputArray);

      this.ngZone.run(() => {
        this.uploadedFile = this.domSanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(new Blob([inputArray])));
      });
    };
    reader.readAsArrayBuffer(file);
  }

  private convertToAscii(fileName: string, inputArray: Uint8Array) {
    // Create a virtual file name from the selected file
    this.wasm.createDataFile(fileName, inputArray, true);
    const resultCode = Module.ccall('bmp_to_ascii', 'int', ['string'], [fileName]);
    if (resultCode) {
      throw Error('The selected file cannot be converted to ASCII');
    }

    this.ngZone.run(() => {
      // Read the contents of the created virtual output file
      this.output = this.wasm.readTextFile('output.txt');
    });
  }
}