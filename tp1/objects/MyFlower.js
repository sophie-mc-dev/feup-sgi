import * as THREE from "three";

class MyFlower {
  constructor() {
    this.flowerGroup = new THREE.Group();
    this.buildFlower();
  }

  // Create a function to generate custom petal geometry
  createPetalGeometry() {
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(1, 2, 0, 4);
    petalShape.quadraticCurveTo(-1, 2, 0, 0);

    const extrudeSettings = {
      steps: 2,
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.2,
      bevelSegments: 1,
    };

    return new THREE.ExtrudeGeometry(petalShape, extrudeSettings);
  }

  buildFlower() {
    const centerGeometry = new THREE.CircleGeometry(1, 32);
    const centerMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("./textures/polen.jpeg"),
      side: THREE.DoubleSide,
    });
    const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
    centerMesh.position.set(9.7, 8, 0);
    centerMesh.rotation.y = -Math.PI / 2;

    const stalkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(10, 8, 0),
      new THREE.Vector3(10, 8, -3),
      new THREE.Vector3(10, 4, -6),
      new THREE.Vector3(10, 0, -9),
    ]);

    const stalkGeometry = new THREE.TubeGeometry(stalkCurve, 64, 0.1, 8, false);
    const stalkMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("./textures/stalk.jpeg"),
      side: THREE.DoubleSide,
    });
    const stalkMesh = new THREE.Mesh(stalkGeometry, stalkMaterial);

    // Create the flower petals
    const petalMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("./textures/petals.jpeg"),
      side: THREE.DoubleSide,
    });
    const numPetals = 10; // You can adjust the number of petals as needed

    for (let i = 0; i < numPetals; i++) {
      const petalGeometry = this.createPetalGeometry();
      const petalMesh = new THREE.Mesh(petalGeometry, petalMaterial);
      petalMesh.position.set(10, 8, 0);
      petalMesh.rotation.z = Math.PI / 2;
      petalMesh.rotation.y = Math.PI / 2;
      petalMesh.rotation.z = (Math.PI / numPetals) * i * 2;

      // Add each petal to the flower group
      this.flowerGroup.add(petalMesh);
    }

    this.flowerGroup.add(centerMesh, stalkMesh);

    // Create the flower petals
    const leafMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("./textures/stalk.jpeg"),
      side: THREE.DoubleSide,
    });

    const leafGeometry = this.createPetalGeometry();
    const leafMesh = new THREE.Mesh(leafGeometry, leafMaterial);
    leafMesh.position.set(10, 5.9, -5);
    leafMesh.rotation.z = Math.PI / 2;
    leafMesh.rotation.y = Math.PI / 2;
    leafMesh.rotation.z = -Math.PI / 4;

    this.flowerGroup.add(centerMesh, stalkMesh, leafMesh);
  }
}

export { MyFlower };
