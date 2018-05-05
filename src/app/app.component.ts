import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  plane: {length: number, segments: number};
  camera: {position: IPosition, fov: number; aspect: number; near: number; far: number};
  light: {position: IPosition};
  renderer: {alpha: boolean};
  constructor() {
    this.plane = {length: 500, segments: 50};
    const cameraPosition = {x: 0, y: 0, z: 1000};
    this.camera = {position: cameraPosition, fov: 75, aspect: 0.5, near: 0.1, far: 10000};
    this.light = {position: {x: 0, y: 0, z: 1000}};
    this.renderer = {alpha: false};
  }
}
