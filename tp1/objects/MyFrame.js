import * as THREE from "three";

class MyFrame {
  constructor() {
    this.frameGroup = new THREE.Group();
    this.buildFrame();
    this.addPicture();
  }

  buildFrame() {
    const frameGeometry = new THREE.BoxGeometry(2.2, 2.75, 0.1);
    const frameMaterial = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load("./textures/frame-tex.jpeg"),
    });

    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.castShadow = true;
    frame.position.set(0, 5, 0);

    this.frameGroup.add(frame);
    this.frameGroup.position.set(-2, 3, -9.9);

    this.frameGroup.castShadow = true;
  }

  addPicture(path) {
    const picGeometry = new THREE.PlaneGeometry(1.8, 2.3, 1);
    const picMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.05,
      map: new THREE.TextureLoader().load(path),
    });

    const picture = new THREE.Mesh(picGeometry, picMaterial);
    picture.position.set(0, 5, 0.055);

    this.frameGroup.add(picture);
  }
}

export { MyFrame };
