import * as THREE from "three";

class MyPolygon extends THREE.Object3D {
  constructor(scene, radius, stacks, slices, color_c, color_p) {
    super(scene);

    this.polygon = new THREE.Mesh();

    this.radius = radius;
    this.stacks = stacks;
    this.slices = slices;
    this.color_c = color_c;
    this.color_p = color_p;

    this.init();
  }

  init() {
    // create mesh
    const geometry = new THREE.CircleGeometry(this.radius, this.slices);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff, shadowSide: THREE.DoubleSide  });

    const colors = [];
    const colorCenter = new THREE.Color(this.color_c);
    const colorPeriphery = new THREE.Color(this.color_p);

    for (let i = 0; i <= this.stacks; i++) {
      for (let j = 0; j <= this.slices; j++) {
        const color = new THREE.Color().lerpColors(
          colorCenter,
          colorPeriphery,
          j / this.slices
        );
        colors.push(color.r, color.g, color.b);
      }
    }
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    this.polygon = new THREE.Mesh(geometry, material);
  }

  static buildPolygon(representation) {
    const { scene, radius, stacks, slices, color_c, color_p } = representation;
    const polygon = new MyPolygon(
      scene,
      radius,
      stacks,
      slices,
      color_c,
      color_p
    );
    return polygon.polygon;
  }
}

export { MyPolygon };
