import * as THREE from 'three';
import { MyNurbsBuilder } from "../MyNurbsBuilder.js";

class MyVase {
  constructor() {
    this.vaseGroup = new THREE.Group();+
    this.buildVase();
  }

  createMirroredVase(originalMesh) {
    const mirroredMesh = originalMesh.clone();

    // Mirror the mesh in the Z-axis
    mirroredMesh.scale.set(1, 1, -1);

    // Adjust the position as needed
    // mirroredMesh.position.set(x, y, z);

    return mirroredMesh;
}

  // Curved surfaces code
  buildVase() {

    this.vaseMesh = new THREE.Mesh();

    const map = new THREE.TextureLoader().load("./textures/vase.jpeg");
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

    this.samplesU = 100;
    this.samplesV = 100;

    const controlPoints = [
      [ // V = 0..2;

      [ -1.5, -1.5, 0.0, 1 ],
  
      [ -0.5, 0.75, 0.0, 1 ],
  
      [ -1,  1.5, 0.0, 1 ]
  
  ],
  
  // U = 1
  
  [ // V = 0..2
  
      [ 0, -1.5, 2.0, 1 ],
  
      [ 0, 0.75, 2.0, 1 ],
  
      [ 0,  1.5, 2.0, 1 ]
  
  ],
  
  // U = 2
  
  [ // V = 0..2
  
      [ 1.5, -1.5, 0.0, 1 ],
      
      [ 0.5, 0.75, 0.0, 1 ],
  
      [ 1,  1.5, 0.0, 1 ]
  
  ]
      ];
      const degreeU = 2; // Degree in the U direction
      const degreeV = 2; // Degree in the V direction

      const surfaceData = this.builder.build(
        controlPoints,
        degreeU,
        degreeV,
        this.samplesU,
        this.samplesV,
        this.material
      );
  
      this.vaseMesh = new THREE.Mesh(surfaceData, this.material);

      this.vaseMesh.rotation.x = 0;
      this.vaseMesh.rotation.y = 4;
      this.vaseMesh.rotation.z = 0;
      this.vaseMesh.scale.set(1, 1, 1);
      this.vaseMesh.position.set(-8.5, 1.5, -8.5);

      const vaseMesh2 = this.createMirroredVase(this.vaseMesh);
      
      this.vaseGroup.add(this.vaseMesh, vaseMesh2);

    }
          
  }
  
  export { MyVase };