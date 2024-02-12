import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

class MyParkingLot {
  constructor() {
    this.parkingsLot = new THREE.Group();

    this.init();
  }

  init() {
    this.createParkingLot();
  }

  createParkingLot() {
    // FLOOR
    const floorGeometry = new THREE.PlaneGeometry(10, 8);
    const texture = new THREE.TextureLoader().load(
      "./myGame/myTextures/parkingLot.jpeg"
    );

    const floorMaterial = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotateX(Math.PI / 2);
    floor.position.set(0, 0, 0);

    // VASE AND BUSH
    const vaseGeometry = new THREE.BoxGeometry(10, 1, 1); 
    const bushGeometry = new THREE.BoxGeometry(10, 1, 1); 

    const vase = new THREE.Mesh(vaseGeometry, new THREE.MeshStandardMaterial({ color: 0xf2f2f2 }));
    const bush = new THREE.Mesh(bushGeometry, new THREE.MeshStandardMaterial({ color: 0x228B22 }));
      vase.name = "vase";
    vase.position.set(0,0.5,4.5);
    bush.position.set(0,1.5,4.5);

    vase.castShadow = vase.receiveShadow = true;
    bush.castShadow = bush.receiveShadow = true;
    floor.castShadow = floor.receiveShadow = true;

    this.parkingsLot.add(floor, vase, bush);
    this.parkingsLot.name = "parkingLot";
    this.parkingsLot.position.set(-20, 0.01, 30);
    this.parkingsLot.castShadow = this.parkingsLot.receiveShadow = true;
  }
}

export { MyParkingLot };
