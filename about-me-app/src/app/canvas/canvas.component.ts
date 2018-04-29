import { Component, AfterContentInit, Input  } from '@angular/core';
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
  @Input() angleX: number;
  @Input() angleY: number;
  constructor() {
    this.angleX = 0;
    this.angleY = 0;
  }
  async ngAfterContentInit() {
    this.el = document.getElementById('canvas');
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.el.clientWidth / this.el.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
    this.el.appendChild(this.renderer.domElement);
    // const geometry = new THREE.SphereGeometry(2, 32, 32);
    // const geometry = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
    // const geometry = new THREE.SphereGeometry(3, 10, 10, 0, Math.PI * 2, 0, Math.PI * 2);
    const geometry = new THREE.SphereGeometry( 5, 24, 16, 0 * Math.PI/2, Math.PI/2 );
    // const material = new THREE.MeshBasicMaterial({ color: '#66023C' });
    const texture = await new THREE.TextureLoader().load( 'assets/Rectangle.jpg' );
    // const material = new THREE.MeshNormalMaterial();
    const material = new THREE.MeshBasicMaterial( { map: texture } );
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.camera.position.z = 10;
    this.animate();
  }
  onResize(event) {
    this.camera.aspect = this.el.clientWidth / this.el.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( this.el.clientWidth , this.el.clientHeight );
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    this.cube.rotation.x = this.angleX;
    this.cube.rotation.y = this.angleY;
    this.renderer.render(this.scene, this.camera);
  }

}
