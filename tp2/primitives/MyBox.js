import * as THREE from "three";

class MyBox extends THREE.Object3D {
  constructor(scene, x1, y1, z1, x2, y2, z2, parts_x, parts_y, parts_z) {
    super(scene);

    this.box = new THREE.Mesh();

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;
    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;
    this.parts_x = parts_x;
    this.parts_y = parts_y;
    this.parts_z = parts_z;
    this.init();
  }

  init() {
    const width = Math.abs(this.x2 - this.x1);
    const height = Math.abs(this.y2 - this.y1);
    const depth = Math.abs(this.z2 - this.z1);

    const geometry = new THREE.BoxGeometry(width, height, depth, this.parts_x, this.parts_y, this.parts_z);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, shadowSide: THREE.DoubleSide });
    
    this.box = new THREE.Mesh(geometry, material);
  }

  update() {}

  static buildBox(representation) {

    const parts_x = representation.parts_x !== undefined ? representation.parts_x : 1;
    const parts_y = representation.parts_y !== undefined ? representation.parts_y : 1;
    const parts_z = representation.parts_z !== undefined ? representation.parts_z : 1;

    const box = new MyBox(
      representation.scene,
      representation.xyz1[0],
      representation.xyz1[1],
      representation.xyz1[2],
      representation.xyz2[0],
      representation.xyz2[1],
      representation.xyz2[2],
      parts_x,
      parts_y,
      parts_z
    );
    return box.box;
  }
}

export { MyBox };
