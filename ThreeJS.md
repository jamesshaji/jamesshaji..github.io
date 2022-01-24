npm install three

Best is to import individual classes or use a generalized import 
import * as THREE from "three";//Not suggested

  import {
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';    //Suggested and best practice

//TS File

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as THREE from "three";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'learn1';

  
  @ViewChild('canvas', { static: true })
  private canvasRef: ElementRef;


  ngOnInit() {
    //Create a scene
    const scene = new THREE.Scene();

    //Set the background color
    scene.background = new THREE.Color('skyblue');
    
    //Create a camera
    const fov = 35 //Field of view
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 100;


    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //Default position is 0,0,0
    camera.position.set(0,0,10);


    //
    const geometry = new THREE.BoxBufferGeometry(2,2,2);

    //default material
    const material = new THREE.MeshBasicMaterial();

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    //Create the renderer
    const renderer = new THREE.WebGL1Renderer();
    //Set the renderer to same size as our container element
    renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    renderer.render(scene, camera);
    

    //to animate
    const animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };
    camera.position.z = 5;
    renderer.render(scene, camera);
    animate();
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
}

//Component

<canvas #canvas id="canvas" style="height: 100%;width: 100%;"></canvas>

