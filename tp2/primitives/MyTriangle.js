import * as THREE from "three";

class MyTriangle extends THREE.Object3D {
  constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
    super(scene);

    this.triangle = new THREE.Mesh();

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;

    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;

    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;

    this.init();
  }

  init() {
    const geometry = new THREE.Geometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, shadowSide: THREE.DoubleSide  });

    geometry.vertices.push(new THREE.Vector3(this.x1, this.y1, this.z1));
    geometry.vertices.push(new THREE.Vector3(this.x2, this.y2, this.z2));
    geometry.vertices.push(new THREE.Vector3(this.x3, this.y3, this.z3));

    this.triangle = new THREE.Mesh(geometry, material);
  }

  static buildTriangle(representation) {
    const triangle = new MyTriangle(
      representation.scene,
      representation.xyz1[0],
      representation.xyz1[1],
      representation.xyz1[2],
      representation.xyz2[0],
      representation.xyz2[1],
      representation.xyz2[2],
      representation.xyz3[0],
      representation.xyz3[1],
      representation.xyz3[2]
    );
    return triangle.triangle;
  }
}

export { MyTriangle };
