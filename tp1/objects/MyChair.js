import * as THREE from "three";

class MyChair {
  constructor() {
    this.chairGroup = new THREE.Group();
    this.buildChair();
  }

  buildChair() {
    // chair geometry and texture
    const chairGeometry = new THREE.BoxGeometry(1.5, 1.5, 0.2);
    const chairTexture = new THREE.TextureLoader().load("./textures/table-tex.jpeg");
    const chairMaterial = new THREE.MeshPhongMaterial({
      map: chairTexture,
    });

    //back rest mesh
    const backrestMesh = new THREE.Mesh(chairGeometry, chairMaterial);
    backrestMesh.position.set(0, 0.8, -0.65);
    backrestMesh.castShadow = true;
    backrestMesh.receiveShadow = true;

    // seat mesh
    const seatMesh = new THREE.Mesh(chairGeometry, chairMaterial);
    seatMesh.rotation.x = Math.PI / 2;
    seatMesh.castShadow = true;
    seatMesh.receiveShadow = true;

    // legs mesh
    const legGeometry = new THREE.BoxGeometry(0.1, 2, 0.1);

    const leg1Mesh = new THREE.Mesh(legGeometry, chairMaterial);
    leg1Mesh.position.set(0.7, -1, 0.7);
    leg1Mesh.castShadow = true;
    leg1Mesh.receiveShadow = true;

    const leg2Mesh = new THREE.Mesh(legGeometry, chairMaterial);
    leg2Mesh.position.set(-0.7, -1, 0.7);
    leg2Mesh.castShadow = true;
    leg2Mesh.receiveShadow = true;

    const leg3Mesh = new THREE.Mesh(legGeometry, chairMaterial);
    leg3Mesh.position.set(-0.7, -1, -0.7);
    leg3Mesh.castShadow = true;
    leg3Mesh.receiveShadow = true;

    const leg4Mesh = new THREE.Mesh(legGeometry, chairMaterial);
    leg4Mesh.position.set(0.7, -1, -0.7);
    leg4Mesh.castShadow = true;
    leg4Mesh.receiveShadow = true;

    this.chairGroup.add(backrestMesh, seatMesh, leg1Mesh, leg2Mesh, leg3Mesh, leg4Mesh);
    this.chairGroup.position.set(1.5, 2, -2);
  }
}

export { MyChair };