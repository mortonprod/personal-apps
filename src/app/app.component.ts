import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  plane: {xLength: number; yLength: number; xNumberSegments: number; yNumberSegments: number};
  camera: {position: IPosition, fov: number; aspect: number; near: number; far: number};
  light: {position: IPosition};
  renderer: {alpha: boolean};
  constructor() {
    this.plane = {xLength: 200, yLength: 200, xNumberSegments: 10, yNumberSegments: 10};
    const cameraPosition = {x: 0, y: 0, z: 1000};
    this.camera = {position: cameraPosition, fov: 75, aspect: 0.5, near: 0.1, far: 10000};
    this.light = {position: {x: 100, y: 0, z: 100}};
    this.renderer = {alpha: false};
  }
}
