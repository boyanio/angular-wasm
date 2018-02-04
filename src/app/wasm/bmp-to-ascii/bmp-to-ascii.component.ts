import { Component, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { WasmService } from '../wasm.service';
import { EmWasmComponent } from '../em-wasm.component';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: './bmp-to-ascii.component.html',
  styleUrls: ['./bmp-to-ascii.component.css']
})
export class WasmBmpToAsciiComponent extends EmWasmComponent {

  output: string;
  uploadedFile: SafeUrl;
  predefinedImages: string[];
  private fileId: number;

  constructor(
    wasm: WasmService,
    private ngZone: NgZone,
    private domSanitizer: DomSanitizer,
    private httpClient: HttpClient) {

    super(wasm);

    this.jsFile = 'bmp-to-ascii.js';
    this.fileId = 1;
    this.predefinedImages = ['assets/img/ascii/hello.bmp', 'assets/img/ascii/angular.bmp', 'assets/img/ascii/heart.bmp'];
  }

  convertPredefinedBitmap(index: number) {
    this.httpClient.get(this.predefinedImages[index], { responseType: 'arraybuffer' })
      .subscribe(imageBytes => {
        this.convertToAscii(new Uint8Array(imageBytes));
      });
  }

  onFileUploaded(files: FileList) {
    if (!files.length) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const inputArray = new Uint8Array(reader.result);
      this.convertToAscii(inputArray);

      this.ngZone.run(() => {
        this.uploadedFile = this.domSanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(new Blob([inputArray])));
      });
    }
    reader.readAsArrayBuffer(files[0]);
  }

  private convertToAscii(inputArray: Uint8Array) {
    // Create a virtual file name from the selected file
    const fileName = `source-${this.fileId}.bmp`;
    FS.createDataFile('/', fileName, inputArray, true, true);
    const resultCode = Module.ccall('bmp_to_ascii', 'int', ['string'], [fileName]);
    if (resultCode) {
      throw Error('The selected file cannot be converted to ASCII');
    }

    // Read the contents of the created virtual output file
    const output = FS.readFile('output.txt', { encoding: 'utf8' });

    this.fileId++;
    this.ngZone.run(() => {
      this.output = output;
    });
  }
}