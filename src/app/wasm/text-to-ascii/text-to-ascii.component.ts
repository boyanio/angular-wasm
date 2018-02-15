import { Component, NgZone } from '@angular/core';
import { EmWasmService } from '../em-wasm.service';
import { EmWasmComponent } from '../em-wasm.component';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: './text-to-ascii.component.html'
})
export class WasmTextToAsciiComponent extends EmWasmComponent {

  input: string;
  foregroundChar: string;
  backgroundChar: string;
  output: string;

  constructor(wasm: EmWasmService, ngZone: NgZone) {
    super(wasm);

    this.output = '';
    this.foregroundChar = '#';
    this.backgroundChar = '.';
    this.jsFile = 'text-to-ascii.js';
    this.emModule = () => ({
      print: what => {
        ngZone.run(() => {
          this.output += '\n' + what;
        });
      }
    });
  }

  onSettingsChanged() {
    this.output = '';

    const isInputValid = !!this.input && !!this.foregroundChar && !!this.backgroundChar;
    if (isInputValid) {
      Module.ccall(
        'display_ascii',
        'void',
        ['string', 'string', 'string', 'string'],
        ['/src/app/wasm/text-to-ascii/text-to-ascii.font.txt', this.input, this.foregroundChar, this.backgroundChar]);
    }
  }
}