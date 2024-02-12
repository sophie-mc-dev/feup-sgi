import * as THREE from "three";

class MyRectangle extends THREE.Object3D {

  constructor(scene, x1, y1, x2, y2, parts_x, parts_y) {
    super(scene);

    this.rectangle = new THREE.Mesh();

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.parts_x = parts_x;
    this.parts_y = parts_y;

    this.init();
  }

  init() {
    // calculate plane
    const width = Math.abs(this.x2 - this.x1);
    const height = Math.abs(this.y2 - this.y1);

    // create mesh
    const geometry = new THREE.PlaneGeometry(width, height, this.parts_x, this.parts_y);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, shadowSide: THREE.DoubleSide  });

    this.rectangle = new THREE.Mesh(geometry, material); 
  }

  static buildRectangle(representation) {
    const parts_x = representation.parts_x !== undefined ? representation.parts_x : 1;
    const parts_y = representation.parts_y !== undefined ? representation.parts_y : 1;
    const rectangle = new MyRectangle(
      representation.scene,
      representation.xy1[0],
      representation.xy1[1],
      representation.xy2[0],
      representation.xy2[1],
      parts_x,
      parts_y
    );
    return rectangle.rectangle;
  }

}

export { MyRectangle };
