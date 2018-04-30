import { Component, AfterContentInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-mountain',
  templateUrl: './mountain.component.html',
  styleUrls: ['./mountain.component.css']
})
export class MountainComponent implements AfterContentInit, OnChanges {
  el: HTMLElement;
  @Input() xLength: number;
  @Input() yLength: number;
  @Input() xNumberSegments: number;
  @Input() yNumberSegments: number;
  @Input() fovCamera: number;
  @Input() aspectCamera: number;
  @Input() nearCamera: number;
  @Input() farCamera: number;
  scene: THREE.scene;
  camera: THREE.camera;
  renderer: THREE.renderer;
  constructor() {
  }
  /**
   *  Where the canvas div is present draw for the first time and initialise all the needed objects.
   */
  async ngAfterContentInit() {
    // Get the canvas div.
    this.el = document.getElementById('canvas');
    // Create the geometry, material and the mesh.
    const geometry = new THREE.PlaneGeometry(this.xLength, this.yLength, this.xNumberSegments, this.yNumberSegments);
    const material = new THREE.MeshPhongMaterial({
      color: 0xdddddd
    });
    const mesh = new THREE.Mesh(geometry, material);
    // Create the renderer, camera and scene we will plot each frame.
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.xLength, this.yLength);
    this.el.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.add(mesh);
    this.camera = new THREE.PerspectiveCamera(this.fovCamera, this.aspectCamera, this.nearCamera, this.farCamera);
    this.camera.position.z = 10;
    this.animate();
  }
  /**
   * When the input of the component changes we will need to recalculate the drawing again.
   * Should keep this to the minimum possible.
   * USE ON CHANGES OBJECT TO DETERMINE WHAT CHANGED AND WHAT WE NEED TO RECALCULATE.
   */
  ngOnChanges(changes: SimpleChanges) {
    const xLengthChangePrevious: SimpleChange = changes.xLength.previousValue;
    const xLengthChangeCurrent: SimpleChange = changes.xLength.currentValue;
  }
  /**
   * This is called for each frame.
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

}
