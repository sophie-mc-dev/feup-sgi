import * as THREE from "three";

import { MyNurbsBuilder } from "../MyNurbsBuilder.js";

class MyNurbs extends THREE.Object3D {
  constructor(scene, controlPoints, degreeU, degreeV, partsU, partsV) {
    super(scene);

    this.nurbs = new THREE.Mesh();

    this.controlPoints = controlPoints;
    this.degreeU = degreeU;
    this.degreeV = degreeV;
    this.partsU = partsU;
    this.partsV = partsV;

    this.builder = new MyNurbsBuilder();

    this.init();
  }

  init(){
    const material = new THREE.MeshBasicMaterial({ shadowSide: THREE.DoubleSide }); 

    const surfaceData = this.builder.build(this.controlPoints, this.degreeU, this.degreeV, this.partsU, this.partsV, material)
    this.nurbs = new THREE.Mesh(surfaceData, material);

  }

   static convertControlPoints(controlPoints, u, v) {

    const nurbsControlPoints = [];
    let a = 0;

    for (let i = 0; i <= u; i++) {
      const row = [];
      for (let j = 0; j <= v; j++) {
        const point = controlPoints[a++];
        const { xx, yy, zz, type } = point;
        row.push([xx, yy, zz, 1]);
      }
      nurbsControlPoints.push(row);
    }

    return nurbsControlPoints;
  }

  static buildNurbs(representation) {
    const nurbs = new MyNurbs(
      representation.scene,
      MyNurbs.convertControlPoints(representation.controlpoints, representation.degree_u, representation.degree_v),
      representation.degree_u,
      representation.degree_v,
      representation.parts_u,
      representation.parts_v
    );
    return nurbs.nurbs;
  }
}

export { MyNurbs };
