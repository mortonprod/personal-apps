import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  xLength: number;
  yLength: number;
  xNumberSegments: number;
  yNumberSegments: number;
  fovCamera: number;
  aspectCamera: number;
  nearCamera: number;
  farCamera: number;
  constructor() {
    this.xLength = 300;
    this.yLength = 300;
    this.xNumberSegments = 10;
    this.yNumberSegments = 10;
    this.fovCamera = 75;
    this.aspectCamera = 200;
    this.nearCamera = 0.1;
    this.farCamera = 1000;
  }
}
