import * as THREE from "three";

import { MyNurbsBuilder } from "../MyNurbsBuilder.js";

class MyNewspaper {
  constructor() {
    this.newspaperMesh = new THREE.Mesh();

    const map = new THREE.TextureLoader().load("./textures/newspaper-tex.jpeg");
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    map.colorSpace = THREE.SRGBColorSpace;

    this.material = new THREE.MeshPhongMaterial({
      map: map,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1,
    });

    this.builder = new MyNurbsBuilder();

    this.samplesU = 24; // maximum defined in MyGuiInterface
    this.samplesV = 24; // maximum defined in MyGuiInterface

    this.buildNewspaper();
  }

  // Curved surfaces code
  buildNewspaper() {

    // declare local variables
    let controlPoints;
    let surfaceData;
    let orderU = 2;
    let orderV = 1;

    // build nurb #1
    controlPoints = [
      [
        // U = 0
        [-1, -1, 0.0, 1],
        [-1, 1, 0.0, 1],
      ],
      [
        // U = 1
        [0, -1, 1.5, 1],
        [0, 1, 1.5, 1],
      ],
      [
        // U = 2
        [1, -1, 0.0, 1],
        [1, 1, 0.0, 1],
      ],
    ];

    controlPoints[1][0][2] = 0.2; // Adjust the height of the middle control point

    surfaceData = this.builder.build(
      controlPoints,
      orderU,
      orderV,
      this.samplesU,
      this.samplesV,
      this.material
    );

    this.newspaperMesh = new THREE.Mesh(surfaceData, this.material);
    this.newspaperMesh.castShadow = true;

    this.newspaperMesh.rotation.x = 7 * Math.PI / 18;

    this.newspaperMesh.scale.set(1, 1, 1);
    this.newspaperMesh.position.set(1.5, 3.299, -1.2);

    this.newspaperMesh.scale.set(0.4, 0.4, 0.4); // You can adjust these values based on your preference

  }
}

export { MyNewspaper };
