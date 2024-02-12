import * as THREE from "three";

class MyRoom {
  constructor() {
    this.roomGroup = new THREE.Group();

    this.floorMaterial = new THREE.MeshPhongMaterial({});
    this.wallMaterial = new THREE.MeshPhongMaterial({});

    this.buildFloor();
    this.buildWalls();
  }

  buildFloor(floorSizeU, floorSizeV) {
    // Texture
    this.floorTexture = new THREE.TextureLoader().load("./textures/floor-tex.jpeg");
    this.floorTexture.wrapS = THREE.RepeatWrapping;
    this.floorTexture.wrapT = THREE.RepeatWrapping;

    // Material
    this.floorMaterial = new THREE.MeshPhongMaterial({
      color: "rgb(128,128,128)",
      specular: "rgb(0,0,0)",
      emissive: "#000000",
      shininess: 0,
      side: THREE.DoubleSide,
      map: this.floorTexture,
    });

    let floorUVRate = floorSizeV / floorSizeU;
    let floorTextureUVRate = 20 / 20; // image dimensions

    let floorTextureRepeatU = 1;
    let floorTextureRepeatV = floorTextureRepeatU * floorUVRate * floorTextureUVRate;

    this.floorTexture.repeat.set(floorTextureRepeatU, floorTextureRepeatV);
    this.floorTexture.rotation = 0;
    this.floorTexture.offset = new THREE.Vector2(0, 0);
    
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(floorSizeU, floorSizeV);
    const floor = new THREE.Mesh(floorGeometry, this.floorMaterial);

    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;

    this.roomGroup.add(floor);
  }

  buildWalls(height, width) {
    this.wallMaterial = new THREE.MeshPhongMaterial({
      color: "#ffffff",
      map: new THREE.TextureLoader().load("./textures/wall-tex-2.jpeg"),
      // side: THREE.DoubleSide,
    });

    const wall1Geometry = new THREE.PlaneGeometry(height, width);
    const wall1 = new THREE.Mesh(wall1Geometry, this.wallMaterial);
    wall1.rotation.y = Math.PI / 2;
    wall1.position.set(-10, 10, 0);

    const wall2Geometry = new THREE.PlaneGeometry(height, width);
    const wall2 = new THREE.Mesh(wall2Geometry, this.wallMaterial);
    wall2.rotation.y = -Math.PI / 2;
    wall2.position.set(10, 10, 0);

    const wall3Geometry = new THREE.PlaneGeometry(height, width);
    const wall3 = new THREE.Mesh(wall3Geometry, this.wallMaterial);
    wall3.rotation.y = Math.PI;
    wall3.position.set(0, 10, 10);

    const wall4Geometry = new THREE.PlaneGeometry(height, 20);
    const wall4 = new THREE.Mesh(wall4Geometry, this.wallMaterial);
    wall4.rotation.y = 2 * Math.PI;
    wall4.position.set(0, 10, -10);

    // Add meshes to the group
    this.roomGroup.add(wall1, wall2, wall3, wall4);
  }
}

export { MyRoom };