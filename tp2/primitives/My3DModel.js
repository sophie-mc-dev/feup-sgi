import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class My3DModel extends THREE.Object3D {
  constructor(scene, filepath) {
    super(scene);

    this.filepath = filepath;

    this.init();
  }

  init() {
    const loader = new GLTFLoader();

    loader.load(this.filepath, (gltf) => {
      const model = gltf.scene;
      this.add(model);
    });
  }
}

export { My3DModel };
