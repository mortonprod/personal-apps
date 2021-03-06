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
  images: string[];
  /**
   * Plane geometry parameters
   * The plane is always along the x and y axis.
   */
  @Input() plane: { length: number; segments: number };
  /**
   * The camera is composed of the angle (y axis) spread of camera (fov),
   * the aspect which determines the spread in (x axis),
   * the near and far plane which determines what volume is included in the field of view,
   * and the position of the camera.
   */
  @Input() camera: { position: IPosition, fov: number; aspect: number; near: number; far: number };
  @Input() renderer: { alpha: boolean };
  @Input() light: { position: IPosition };
  three: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer };
  constructor() {
    this.three = { scene: undefined, camera: undefined, renderer: undefined };
    this.images = [
      'assets/green0.jpeg',
      'assets/green1.jpeg',
      'assets/green2.jpeg',
      'assets/pinkStone.jpeg',
      'assets/orangeStone.jpeg',
      'assets/greyStone0.jpeg',
      'assets/greyStone1.jpeg',
      'assets/greyStone2.jpeg',
      'assets/greyStone3.jpeg',
      'assets/snow.jpeg',
    ];
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
    // randomVertices(geometry, 500);
    // The volume of the moutain in the first parameter and the second is the multiple of the diagonal of covariance matrix.
    centreMountain(geometry, 20000000, 20);
    const materials = createMesh(this.images);
    // randomMaterials(geometry, this.images.length);
    // materialHeightSegment(geometry, 0, 2, 0, 0.01);
    // materialHeightSegment(geometry, 3, 5, 0.01, 0.2);
    // materialHeightSegment(geometry, 5, 8, 0.2, 0.7);
    // materialHeightSegment(geometry, 9, 9, 0.7, 1);

    materialHeightAngleSegment(geometry, 2, 2, 0, 0.2, 0, 360);
    // materialHeightAngleSegment(geometry, 1, 2, 0, 0.01, 90, 360);
    // materialHeightSegment(geometry, 3, 5, 0.01, 0.2);
    // materialHeightSegment(geometry, 5, 8, 0.2, 0.7);
    // materialHeightSegment(geometry, 9, 9, 0.7, 1);

    const mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
    //   const mesh = new THREE.Mesh(
    //     new THREE.CubeGeometry( 1, 1, 1 ),
    //     new THREE.MeshNormalMaterial()
    // );
    // Create the renderer, camera and scene we will plot each frame.
    this.three.renderer = new THREE.WebGLRenderer({ alpha: this.renderer.alpha });
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
    this.three.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
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
function toRad (angle) {
  return angle * (Math.PI / 180);
}
/**
 * Create Mountain from random plane geometry.
 * Geometry has a list of vertices which equate to x and y.
 * Plane with nX/xY slabs has (nX+1)/(nY+1) vertices.
 * Normal the the total volume of the mountain.
 * The variance factor is the multiple of the variance 
 */

function centreMountain(geometry: THREE.PlaneGeometry, normal: number, varianceFactor: number) {
  const lastVertex = geometry.vertices[geometry.vertices.length - 1];
  const vara = Math.abs(lastVertex.x) * varianceFactor;
  const sigma = [[vara, 0], [0, vara]];
  const mu = [0, 0];
  const param = {
    sigma,
    mu
  };
  const multiGaussian = new MultiGaussian(param);
  const distribution = gaussian(0, 30 * Math.abs(lastVertex.x));
  for (let i = 0; i < geometry.vertices.length; i++) {
    const zIncrease = normal * multiGaussian.density([geometry.vertices[i].x, geometry.vertices[i].y]);
    const newZ = geometry.vertices[i].z + zIncrease;
    geometry.vertices[i].z = newZ;
    // console.log(`${i} x: ${geometry.vertices[i].x} y: ${geometry.vertices[i].y} z: ${geometry.vertices[i].z}`);
  }

}
/**
 * Add random variance to vertices.
 */
function randomVertices(geometry: THREE.PlaneGeometry, normal: number) {
  for (let i = 0; i < geometry.vertices.length; i++) {
    const z = gaussianCentre(Math.random(), normal);
    // console.log(`Random ${i} x: ${geometry.vertices[i].x} y: ${geometry.vertices[i].y} z: ${geometry.vertices[i].z} add z: ${z}`);
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

function randomMaterials(geometry: THREE.PlaneGeometry, num: number) {
  for (let i = 0; i < geometry.faces.length; i++) {
    geometry.faces[i].materialIndex = Math.floor(Math.random() * num);
    // geometry.faces[ i ].materialIndex = 0;
  }
}
/**
 * This function will put an image or a selection image at particular segement height of the mountain.
 * The height goes between 0 and 1.
 * The total height of the mountain is calculated from the middle face.
 */
function materialHeightSegment(geometry: THREE.PlaneGeometry, minImage: number, maxImage: number, fracMin: number, fracMax: number) {
  const maxHeight = getMaxHeight(geometry) + 1; // Add small increase to get top.
  for (let i = 0; i < geometry.faces.length; i++) {
    const face = geometry.faces[i];
    const vertexPos = geometry.vertices[face.a];
    const height = vertexPos.z;
    // console.log(height);
    if (maxHeight * fracMin < height && maxHeight * fracMax > height) {
      geometry.faces[i].materialIndex = Math.floor(Math.random() * (maxImage - minImage)) + minImage;
    }
  }
}

function materialHeightAngleSegment(geometry: THREE.PlaneGeometry,
  minImage: number, maxImage: number, fracMin: number, fracMax: number, phiMin: number, phiMax: number) {
  const maxHeight = getMaxHeight(geometry) + 1; // Add small increase to get top.
  for (let i = 0; i < geometry.faces.length; i++) {
    const face = geometry.faces[i];
    const vertexPos = geometry.vertices[face.a];
    const height = vertexPos.z;
    const spherical = cartesianToSpherical(vertexPos.x, vertexPos.y, vertexPos.z);
    console.log(`Angles ${toRad(phiMin)} ${toRad(phiMax)} ${spherical.phi}`);
    if (maxHeight * fracMin < height && maxHeight * fracMax > height && spherical.phi > toRad(phiMin) && spherical.phi < toRad(phiMax)) {
      geometry.faces[i].materialIndex = Math.floor(Math.random() * (maxImage - minImage)) + minImage;
    }
  }
}

function cartesianToSpherical(x, y, z) {
  const radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
  const theta = Math.acos(z / radius);
  const phi = Math.atan(y / x);
  // console.log(`X/Y ${y} ${z} ${phi}`);
  console.log(`${x} ${y} ${z} ${radius} ${theta} ${phi}`);
  return {
    radius,
    theta,
    phi
  };
}

function getMaxHeight(geometry) {
  let temp = 0;
  for (let i = 0; i < geometry.faces.length; i++) {
    const face = geometry.faces[i];
    const height = geometry.vertices[face.a].z;
    if (height > temp) {
      temp = height;
    }
  }
  return temp;
};

function createMesh(images: Array<string>) {
  const materials = [];
  // for (let i = 0; i < images.length; i++) {
  images.forEach(async (image) => {
    const texture = await new THREE.TextureLoader().load(image);
    const material = new THREE.MeshLambertMaterial({
      map: texture
    });
    materials.push(material);
  });
  return materials;
}
