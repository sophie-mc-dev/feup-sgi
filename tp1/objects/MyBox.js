import * as THREE from "three";

class MyBox {
  constructor(scene) {
    this.scene = scene;
    // box related attributes
    this.boxMesh = null;
    this.boxMeshSize = 1.0;
    this.boxEnabled = false; // true
    this.lastBoxEnabled = null;
    this.boxDisplacement = new THREE.Vector3(0,5,0);

    this.buildBox();
  }

  /**
   * builds the box mesh with material assigned
   */
  buildBox() {
    let boxMaterial = new THREE.MeshPhongMaterial({
      color: "#ffff77",
      specular: "#000000",
      emissive: "#000000",
      shininess: 90,
    });

    // Create a Cube Mesh with basic material
    let boxGeometry = new THREE.BoxGeometry(
      this.boxMeshSize,
      this.boxMeshSize,
      this.boxMeshSize
    );
    this.boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    this.boxMesh.rotation.x = -Math.PI / 2;
    this.boxMesh.position.y = this.boxDisplacement.y;

  }

  /**
   * rebuilds the box mesh if required
   * this method is called from the gui interface
   */
  rebuildBox() {
    // remove boxMesh if exists
    if (this.boxMesh !== undefined && this.boxMesh !== null) {
      this.scene.remove(this.boxMesh);
    }
    this.buildBox();
    this.lastBoxEnabled = null;
  }

  /**
   * updates the box mesh if required
   * this method is called from the render method of the app
   * updates are trigered by boxEnabled property changes
   */
  updateBoxIfRequired() {
    if (this.boxEnabled !== this.lastBoxEnabled) {
      this.lastBoxEnabled = this.boxEnabled;
      if (this.boxEnabled) {
        this.scene.add(this.boxMesh);
      } else {
        this.scene.remove(this.boxMesh);
      }
    }
  }
}

export { MyBox };
