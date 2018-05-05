import { Component, AfterContentInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);

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
  @Input() renderer: {alpha: boolean};
  three: {scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer};
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
      color: '#6000C7'
    });
    // const mesh = new THREE.Mesh(geometry, material);
    const mesh = new THREE.Mesh(
      new THREE.CubeGeometry( 1, 1, 1 ),
      new THREE.MeshNormalMaterial()
  );
    // Create the renderer, camera and scene we will plot each frame.
    this.three.renderer = new THREE.WebGLRenderer({alpha: this.renderer.alpha});
    this.three.renderer.setClearColor(0x333F47, 1);
    // this.three.renderer = new THREE.WebGLRenderer();
    this.three.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
    this.el.appendChild(this.three.renderer.domElement);
    this.three.scene = new THREE.Scene();
    this.three.scene.add(mesh);
    this.three.camera = new THREE.PerspectiveCamera(this.camera.fov, this.camera.aspect, this.camera.near, this.camera.far);
    this.three.camera.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    // this.three.camera.rotateX(5);
    const light = new THREE.PointLight(0xffffff);
    light.position.set(100, 200, -100);
    this.three.scene.add(light);
    const controls = new OrbitControls(this.three.camera, this.three.renderer.domElement);
    this.animate();
  }
  onResize(event) {
    this.camera.aspect = this.el.clientWidth / this.el.clientHeight;
    this.three.renderer.setSize( this.el.clientWidth , this.el.clientHeight );
    this.three.camera.updateProjectionMatrix();

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
    this.three.renderer.render(this.three.scene, this.three.camera);
  }

}
