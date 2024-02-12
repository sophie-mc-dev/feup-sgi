import * as THREE from "three";

class MyDoor {
  constructor() {
    this.doorMesh = new THREE.Mesh();
    this.buildDoor();
  }

  buildDoor() {
    // create box meshes for frames
    const frameGeometry = new THREE.BoxGeometry(4.5, 9, 0.15);

    const frontDoor = new THREE.TextureLoader().load(
      "./textures/door-inside-tex.jpeg"
    );
    const backDoor = new THREE.TextureLoader().load(
      "./textures/door-outside-tex.jpeg"
    );
    const woodTex = new THREE.TextureLoader().load(
        "./textures/table-tex.jpeg"
      );

    const frameMaterial = [
      new THREE.MeshPhongMaterial({ map: woodTex }),
      new THREE.MeshPhongMaterial({ map: woodTex }), 
      new THREE.MeshPhongMaterial({ map: woodTex }),
      new THREE.MeshPhongMaterial({ map: woodTex }),
      new THREE.MeshPhongMaterial({ map: backDoor }),
      new THREE.MeshPhongMaterial({ map: frontDoor }),
    ];

    this.doorMesh = new THREE.Mesh(frameGeometry, frameMaterial);

    this.doorMesh.position.set(5, 4.5, 10);
  }
}

export { MyDoor };
