import { Component, AfterContentInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-mountain',
  templateUrl: './mountain.component.html',
  styleUrls: ['./mountain.component.css']
})
export class MountainComponent implements AfterContentInit, OnChanges {
  el: HTMLElement;
  /**
   * Plane geometry parameters
   * The plane is always along the x and y axis.
   */
  @Input() plane: {xLength: number; yLength: number; xNumberSegments: number; yNumberSegments: number};
  /**
   * The camera is composed of the angle (y axis) spread of camera (fov),
   * the aspect which determines the spread in (x axis),
   * the near and far plane which determines what volume is included in the field of view,
   * and the position of the camera.
   */
  @Input() camera: {position: IPosition, fov: number; aspect: number; near: number; far: number};
  three: {scene: THREE.Scene; camera: THREE.Camera; renderer: THREE.Renderer};
  constructor() {
    this.three = {scene: undefined, camera: undefined, renderer: undefined};
  }
  /**
   *  Where the canvas div is present draw for the first time and initialise all the needed objects.
   */
  async ngAfterContentInit() {
    // Get the canvas div.
    this.el = document.getElementById('canvas');
    // Create the geometry, material and the mesh.
    const geometry = new THREE.PlaneGeometry(
      this.plane.xLength,
      this.plane.yLength,
      this.plane.xNumberSegments,
      this.plane.yNumberSegments
    );
    const material = new THREE.MeshPhongMaterial({
      color: 0xdddddd
    });
    const mesh = new THREE.Mesh(geometry, material);
    // Create the renderer, camera and scene we will plot each frame.
    this.three.renderer = new THREE.WebGLRenderer();
    this.three.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
    this.el.appendChild(this.three.renderer.domElement);
    this.three.scene = new THREE.Scene();
    this.three.scene.add(mesh);
    this.camera = new THREE.PerspectiveCamera(this.camera.fov, this.camera.aspect, this.camera.near, this.camera.far);
    this.camera.position = this.camera.position;
    // this.three.camera.position = this.camera.position;
    this.three.camera.rotateX(90);
    this.animate();
  }
  /**
   * When the input of the component changes we will need to recalculate the drawing again.
   * Should keep this to the minimum possible.
   * USE ON CHANGES OBJECT TO DETERMINE WHAT CHANGED AND WHAT WE NEED TO RECALCULATE.
   */
  ngOnChanges(changes: SimpleChanges) {
    // const xLengthChangePrevious: SimpleChange = changes.xLength.previousValue;
    // const xLengthChangeCurrent: SimpleChange = changes.xLength.currentValue;
  }
  /**
   * This is called for each frame.
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.three.renderer.render(this.three.scene, this.camera);
  }

}
