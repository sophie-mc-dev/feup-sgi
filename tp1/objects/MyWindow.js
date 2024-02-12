import * as THREE from "three";

class MyWindow {
  constructor() {
    this.windowGroup = new THREE.Group();
    this.buildWindow();
    this.addView();
    this.setPosition();
  }

  buildWindow() {
    // create box meshes for frames
    const frameGeometry = new THREE.BoxGeometry(3, 9, 0.15);
    const frameMaterial = new THREE.MeshPhongMaterial({
      color: "#ffffff",
      map: new THREE.TextureLoader().load("./textures/white-wood-tex.jpeg"),
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 6, 0);

    this.windowGroup.add(frame);
    this.windowGroup.rotation.y = Math.PI / 2;
    this.windowGroup.position.set(0, 0, 0);
  }

  addView(path) {
    // create plane meshes for landscape view
    const windowGeometry = new THREE.PlaneGeometry(2.5, 8.5, 1);
    const windowMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(path),
     
      
    });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(0, 6, 0.08);

    this.windowGroup.add(window);
  }

  setPosition(x, y, z) {
    this.windowGroup.position.x = x;
    this.windowGroup.position.y = y;
    this.windowGroup.position.z = z;
  }
}

export { MyWindow };
