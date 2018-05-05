import { Component, AfterContentInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import * as THREE from 'three';
import * as gaussian from 'gaussian';
import * as MultiGaussian from 'multivariate-gaussian';
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
  @Input() plane: {length: number; segments: number};
  /**
   * The camera is composed of the angle (y axis) spread of camera (fov),
   * the aspect which determines the spread in (x axis),
   * the near and far plane which determines what volume is included in the field of view,
   * and the position of the camera.
   */
  @Input() camera: {position: IPosition, fov: number; aspect: number; near: number; far: number};
  @Input() renderer: {alpha: boolean};
  @Input() light: {position: IPosition};
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
      this.plane.length,
      this.plane.length,
      this.plane.segments,
      this.plane.segments
    );
    // 500 is the area of the gaussian.
    randomVertices(geometry, 500);
    // The volume of the moutain in the first parameter and the second is the multiple of the diagonal of covariance matrix.
    centreMountain(geometry, 7000000, 20);
    const texture = await new THREE.TextureLoader().load( 'assets/greyStone.jpeg' );
    const material = new THREE.MeshLambertMaterial({
      // color: '#6000C7',
      map: texture
      // side: THREE.DoubleSide,
      // wireframe: true
    });
    const mesh = new THREE.Mesh(geometry, material);
  //   const mesh = new THREE.Mesh(
  //     new THREE.CubeGeometry( 1, 1, 1 ),
  //     new THREE.MeshNormalMaterial()
  // );
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
    light.position.set(this.light.position.x, this.light.position.y, this.light.position.z);
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
/**
 * Create Mountain from random plane geometry.
 * Geometry has a list of vertices which equate to x and y.
 * Plane with nX/xY slabs has (nX+1)/(nY+1) vertices.
 * Normal the the total volume of the mountain.
 * The variance factor is the multiple of the variance 
 */

 function centreMountain(geometry: THREE.PlaneGeometry, normal: number, varianceFactor: number) {
  const lastVertex = geometry.vertices[geometry.vertices.length - 1 ];
  const vara = Math.abs(lastVertex.x) * varianceFactor;
  const sigma = [[vara, 0], [0, vara]];
  const mu = [0, 0];
  const param = {
    sigma,
    mu
  };
  const multiGaussian = new MultiGaussian(param);
  const distribution = gaussian(0 , 30 * Math.abs(lastVertex.x));
  for (let i = 0; i < geometry.vertices.length; i++) {
    const zIncrease = normal * multiGaussian.density([geometry.vertices[i].x, geometry.vertices[i].y]);
    const newZ =  geometry.vertices[i].z + zIncrease;
    geometry.vertices[i].z = newZ;
    console.log(`${i} x: ${geometry.vertices[i].x} y: ${geometry.vertices[i].y} z: ${geometry.vertices[i].z}`);
  }

 }
/**
 * Add random variance to vertices.
 */
function randomVertices(geometry: THREE.PlaneGeometry, normal: number) {
  for (let i = 0; i < geometry.vertices.length; i++) {
    const z = gaussianCentre(Math.random(), normal);
    console.log(`Random ${i} x: ${geometry.vertices[i].x} y: ${geometry.vertices[i].y} z: ${geometry.vertices[i].z} add z: ${z}`);
    geometry.vertices[i].z = geometry.vertices[i].z + z;
  }
}
/**
 * This is a Gaussian which is centred on 0 by default.
 * The integrated area is 1 by default since it's a pdf.
 * The variance is 1 by default.
 * The x value gives the location on the Gaussain curve we should sample from.
 */
function gaussianCentre(x: number, normal = 1, variance = 1, mean = 0) {
  const distribution = gaussian(mean, variance);
  return normal * distribution.pdf(x);
}
