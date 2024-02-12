import * as THREE from "three";
import { MyFrame } from "./MyFrame.js";

class MyBeetle {
  constructor() {
    this.beetleGroup = new THREE.Group();
    this.numberOfSamples = 50;
    this.initCubicBezierCurve();
  }

  initCubicBezierCurve() {
    // WHEEL
    let wheelPoints = [
      new THREE.Vector3(0, 0, 0), // starting point
      new THREE.Vector3(0, 0.45, 0.0), // control point
      new THREE.Vector3(0.6, 0.45, 0.0),
      new THREE.Vector3(0.6, 0, 0), // ending point
    ];

    // CAR FRONT
    let carFrontPoints = [
      new THREE.Vector3(0, 0, 0), // starting point
      new THREE.Vector3(0.03, 0.3, 0.0), // control point
      new THREE.Vector3(0.15, 0.35, 0.0),
      new THREE.Vector3(0.4, 0.4, 0), // ending point
    ];

    // CAR BACK
    let carBackPoints = [
      new THREE.Vector3(0, 0, 0), // starting point
      new THREE.Vector3(0.1, 0.6, 0.0), // control point
      new THREE.Vector3(0.45, 0.78, 0.0),
      new THREE.Vector3(0.8, 0.8, 0), // ending point
    ];

    let wheelCurve = new THREE.CubicBezierCurve3(
      wheelPoints[0],
      wheelPoints[1],
      wheelPoints[2],
      wheelPoints[3]
    );

    let carFrontCurve = new THREE.CubicBezierCurve3(
      carFrontPoints[0],
      carFrontPoints[1],
      carFrontPoints[2],
      carFrontPoints[3]
    );
    let carBackCurve = new THREE.CubicBezierCurve3(
      carBackPoints[0],
      carBackPoints[1],
      carBackPoints[2],
      carBackPoints[3]
    );

    this.curveGeometryWheel = new THREE.BufferGeometry().setFromPoints(
      wheelCurve.getPoints(this.numberOfSamples)
    );
    this.curveGeometryFront = new THREE.BufferGeometry().setFromPoints(
      carFrontCurve.getPoints(this.numberOfSamples)
    );
    this.curveGeometryBack = new THREE.BufferGeometry().setFromPoints(
      carBackCurve.getPoints(this.numberOfSamples)
    );

    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });

    this.lineObj = new THREE.Line(this.curveGeometryWheel, this.lineMaterial); // roda1
    this.lineObj2 = new THREE.Line(this.curveGeometryWheel, this.lineMaterial); // roda2
    this.lineObj3 = new THREE.Line(this.curveGeometryFront, this.lineMaterial); // front1
    this.lineObj4 = new THREE.Line(this.curveGeometryFront, this.lineMaterial); // front2
    this.lineObj5 = new THREE.Line(this.curveGeometryBack, this.lineMaterial); // back1

    this.lineObj.position.set(0, 0, 0);
    this.lineObj2.position.set(1, 0, 0);
    this.lineObj3.position.set(1.6, 0, 0);
    this.lineObj4.position.set(1.2, 0.4, 0);
    this.lineObj5.position.set(0, 0, 0);

    this.lineObj3.rotateY(Math.PI);
    this.lineObj4.rotateY(Math.PI);

    // Create Beetle
    this.beetle = new THREE.Group();
    this.beetle.add(
      this.lineObj,
      this.lineObj2,
      this.lineObj3,
      this.lineObj4,
      this.lineObj5
    );
    this.beetle.rotateY(Math.PI);
    this.beetle.position.set(-1.5, 6.3, 9.7);

    this.beetle.scale.set(2,2,2); // You can adjust these values based on your preference

    // Add custom beetle frame
    this.beetleFrame = new MyFrame();
    this.beetleFrame.addPicture("./textures/wall-tex-2.jpeg");
    this.beetleFrame.frameGroup.rotateZ(Math.PI / 2);
    this.beetleFrame.frameGroup.rotateY(Math.PI );
    this.beetleFrame.frameGroup.position.set(7, 7, 9.9);
    this.beetleFrame.frameGroup.scale.set(2,2,2);

    this.beetleGroup.add(this.beetle, this.beetleFrame.frameGroup);
  }
}

export { MyBeetle };
