import { app } from "../../app";
import * as THREE from "three";
// import * as dat from "dat.gui";

import { InjectModel } from "../../index.js";

export class Folio extends app {
  /**
   * Constructor
   */
  scene = new THREE.Scene();
  renderer: THREE.WebGLRenderer;
  camera_1 = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001,
    1000
  );

  constructor(
    @InjectModel("time") readonly time: any,
    @InjectModel("controls") readonly controls: any,
    @InjectModel("resource") readonly resources: any,
    @InjectModel("debug") readonly debug: any,
    @InjectModel("sizes") readonly sizes: any,
    @InjectModel("camera") readonly camera: any,
    @InjectModel("passes") readonly passes: any,
    @InjectModel("config") readonly config: any
  ) {
    // Options
    super();
    // Set up

    this.adaptMobile();

    this.renderer = new THREE.WebGLRenderer({
      canvas: config.$canvas,
      alpha: true,
      antialias: true,
    });
    this.setRenderer();
    this.setCamera();

    this.setWorld();
    // this.setTitle();
  }

  adaptMobile() {
    window.addEventListener(
      "touchstart",
      () => {
        this.config.touch = true;
        this.controls.setTouch();
      },
      { once: true }
    );
  }

  /**
   * Set debug
   */

  /**
   * Set renderer
   */
  setRenderer() {
    this.renderer.setClearColor(this.config.clearColor || 0x000000, 1);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.sizes.viewport.width,
      this.sizes.viewport.height
    );
    this.renderer.physicallyCorrectLights = true;
    (this.renderer as any).gammaFactor = 2.2;
    (this.renderer as any).gammaOutPut = true;
    this.sizes.on("resize", () => {
      this.renderer.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      );
    });
  }
  setCamera() {
    this.camera_1.position.set(-2, 0, 0);
    this.scene.add(this.camera.container);
  }

  startRender() {
    this.time.on("tick", () => {
      this.renderer.render(this.scene, this.camera_1);
    });
  }
  setWorld() {
    this.resources.on("ready", () => {
      this.loadAll();
      
    });
  }
}
