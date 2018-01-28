import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'ng-wasm-3d',
  template: '<canvas style="width: 100%; height: 100%; border: 0;" oncontextmenu="event.preventDefault()"></canvas>'
})
export class Wasm3dComponent implements OnInit {
  @Input() url: string;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(this.url, { responseType: 'arraybuffer' })
      .mergeMap(bytes => WebAssembly.compile(bytes))
      .mergeMap(wasmModule => {
        window["a"] = wasmModule;
        const memory = new WebAssembly.Memory({ initial: 2, maximum: 10 });
        const imports = { env: { memory } };
        return WebAssembly.instantiate(wasmModule, imports);
      })
      .subscribe(wasmInstance => {
        console.log(wasmInstance);
      });
  }
}