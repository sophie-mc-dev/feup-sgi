import * as THREE from "three";

class MySphere extends THREE.Object3D {
  constructor(scene, radius, slices, stacks, thetastart, thetalength, phistart, philength) {
    super(scene);

    this.sphere = new THREE.Mesh();

    this.radius = radius;
    this.slices = slices;
    this.stacks = stacks;
    this.thetastart = thetastart;
    this.thetalength = thetalength;
    this.phistart = phistart;
    this.philength = philength;

    this.init();
  }

  init() {
    const geometry = new THREE.SphereGeometry(this.radius, this.slices, this.stacks, this.thetastart, this.thetalength, this.phistart, this.philength);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, shadowSide: THREE.DoubleSide  });

    this.sphere = new THREE.Mesh(geometry, material);
  }

  update() {}

  static buildSphere(representation) {
    const thetastart = representation.thetastart !== undefined ? representation.thetastart : 0;
    const thetalength = representation.thetalength !== undefined ? representation.thetalength : 2 * Math.PI;
    const phistart = representation.phistart !== undefined ? representation.phistart : 0;
    const philength = representation.philength !== undefined ? representation.philength : Math.PI;

    const sphere = new MySphere(
      representation.scene,
      representation.radius,
      representation.slices,
      representation.stacks,
      thetastart,
      thetalength,
      phistart,
      philength
    );
    return sphere.sphere;
  }
}

export { MySphere };
