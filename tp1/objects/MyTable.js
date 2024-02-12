import * as THREE from "three";

class MyTable {
  constructor() {
    this.tableGroup = new THREE.Group();
    this.buildTable();
  }

  buildTable() {
    // Create table top mesh
    const tableTopGeometry = new THREE.BoxGeometry(6, 0.25, 4); // width, height, depth

    const tableTexture = new THREE.TextureLoader().load("./textures/table-tex.jpeg");
    const tableTopMaterial = new THREE.MeshPhongMaterial({
      map: tableTexture,
      specular: "#964B00",
      shininess: 0,
    });

    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);

    tableTop.position.set(0, 3, 0);

    tableTop.castShadow = true;
    tableTop.receiveShadow = true;

    // Create table legs mesh
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);

    const tableLegTexture = new THREE.TextureLoader().load(
      "./textures/leg-tex.jpeg"
    );
    const legMaterial = new THREE.MeshPhongMaterial({
      map: tableLegTexture,
      specular: "#ffffff",
      shininess: 0,
    });

    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.position.set(-2.5, 1.5, -1.5);
    leg1.receiveShadow = true;
    leg1.castShadow = true;

    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.position.set(2.5, 1.5, -1.5);
    leg2.receiveShadow = true;
    leg2.castShadow = true;

    const leg3 = new THREE.Mesh(legGeometry, legMaterial);
    leg3.position.set(-2.5, 1.5, 1.5);
    leg3.receiveShadow = true;
    leg3.castShadow = true;

    const leg4 = new THREE.Mesh(legGeometry, legMaterial);
    leg4.position.set(2.5, 1.5, 1.5);
    leg4.receiveShadow = true;
    leg4.castShadow = true;

    // Add meshes to group
    this.tableGroup.add(tableTop, leg1, leg2, leg3, leg4);

    this.tableGroup.position.set(0, 0, 0);
    
  }
}

export { MyTable };
