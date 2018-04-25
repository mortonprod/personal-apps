import { Component, AfterContentInit  } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements AfterContentInit {
  title = 'app';
  renderer;
  scene;
  camera;
  el: HTMLElement;
  cube: THREE.Mesh;
  isActive: Boolean;
  clientX: number;
  clientY: number;
  constructor() {
  }
  ngAfterContentInit() {
    this.el = document.getElementById('canvas');
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.el.clientWidth / this.el.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
    this.el.appendChild(this.renderer.domElement);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: '#66023C' });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.camera.position.z = 5;
    this.animate();
  }
  onResize(event) {
    this.camera.aspect = this.el.clientWidth / this.el.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.el.clientWidth , this.el.clientHeight );
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }
  onMouseMove(event: MouseEvent): void {
    this.clientX = event.clientX;
    this.clientY = event.clientY;
    console.log(`client ${this.clientX} ${this.clientY} ${this.el.clientWidth} ${this.el.clientHeight}`);
  }
  onMouseDown(event: MouseEvent) {
    this.isActive = true;
    console.log(`isActive: ${this.isActive}`);
  }
  onMouseUp(event: MouseEvent) {
    this.isActive = false;
    console.log(`isActive: ${this.isActive}`);
  }

}
