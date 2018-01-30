import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
  <ul>
    <li><a routerLink="/logger">Wasm Logger</a></li>
  </ul>
  `
})
export class HomeComponent { }