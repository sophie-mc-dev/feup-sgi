import * as THREE from "three";

class MyPlate {
  constructor() {
    this.plateMesh = new THREE.Mesh();
    this.buildPlate();
  }

  buildPlate() {
    const plateGeometry = new THREE.CylinderGeometry(0.8, 0.1, 0.05, 32);
    const plateMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("./textures/plate-tex.png"),
    });

    this.plateMesh = new THREE.Mesh(plateGeometry, plateMaterial);
    this.plateMesh.castShadow = true;
    this.plateMesh.receiveShadow = true;

    this.plateMesh.position.set(0, 3.15, 0);

  }
}

export { MyPlate };
