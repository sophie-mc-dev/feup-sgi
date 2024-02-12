import * as THREE from "three";

class MySpring {
  constructor() {
    this.springMesh = new THREE.Mesh();
    this.numberOfSamples = 100;
    

    this.buildSpring();
  }

  buildSpring() {
    const a = 0.1; // radius of the spring
    const b = 0.8; // height of the spring
    const w = 5; // number of windings

    const controlPoints = [];

    // The variable t represents the parameter along the curve
    for (let t = 0; t <= 1; t += 1 / this.numberOfSamples) {
      let x = a * Math.sin(2 * Math.PI * w * t);
      let y = a * Math.cos(2 * Math.PI * w * t);
      let z = b * t;

      controlPoints.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(controlPoints);

    // Create spring mesh
    let geometry = new THREE.TubeGeometry(curve, 100, 0.02, 20, false);
    const material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("./textures/spring.png"),
    });
    this.springMesh = new THREE.Mesh(geometry, material);

    this.springMesh.position.set(-2.5, 3.25, 0); 

    this.springMesh.castShadow = true;
  }
}

export { MySpring };
