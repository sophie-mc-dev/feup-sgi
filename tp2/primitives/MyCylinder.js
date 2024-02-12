import * as THREE from "three";

class MyCylinder extends THREE.Object3D {
  constructor(
    scene,
    top,
    bottom,
    height,
    slices,
    stacks,
    capsclose,
    thetastart,
    thetalength
  ) {
    super(scene);

    this.cylinder = new THREE.Mesh();

    this.top = top;
    this.bottom = bottom;
    this.height = height;
    this.slices = slices;
    this.stacks = stacks;
    this.capsclose = capsclose;
    this.thetastart = thetastart;
    this.thetalength = thetalength;

    this.init();
  }

  init() {
    const geometry = new THREE.CylinderGeometry(
      this.top,
      this.bottom,
      this.height,
      this.slices,
      this.slacks,
      this.capsclose,
      this.thetastart,
      this.thetalength
    );
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, shadowSide: THREE.DoubleSide  });

    this.cylinder = new THREE.Mesh(geometry, material);
  }

  static buildCylinder(representation) {
    const capsclose =
      representation.partsx !== undefined ? representation.partsx : false;
    const thetastart =
      representation.partsy !== undefined ? representation.partsy : 0;
    const thetalength =
      representation.partsy !== undefined ? representation.partsy : 2 * Math.PI;

    const cylinder = new MyCylinder(
      representation.scene,
      representation.top,
      representation.base,
      representation.height,
      representation.slices,
      representation.stacks,
      capsclose,
      thetastart,
      thetalength
    );

    return cylinder.cylinder;
  }
  
}

export { MyCylinder };
