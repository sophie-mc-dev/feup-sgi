import * as THREE from "three";

class MyCameras {
  constructor() {
    this.cameras = {};
  }

  addCameras(data) {
    for (const id in data.cameras) {
      const cameraData = data.cameras[id];
      let camera;

      switch (cameraData.type) {
        case "perspective":
          camera = this.createPerspectiveCamera(cameraData);
          break;
        case "orthogonal":
          camera = this.createOrthographicCamera(cameraData);
          break;
      }
      camera.name = id; 
      if (camera) {
        this.cameras[id] = camera;
      }
    }
  }

  createPerspectiveCamera(cameraData) {
    const camera = new THREE.PerspectiveCamera(
      cameraData.angle,
      cameraData.aspect,
      cameraData.near,
      cameraData.far
    );
    this.setCameraPositionAndTarget(camera, cameraData);
    return camera;
  }

  createOrthographicCamera(cameraData) {
    const camera = new THREE.OrthographicCamera(
      cameraData.left,
      cameraData.right,
      cameraData.top,
      cameraData.bottom,
      cameraData.near,
      cameraData.far
    );
    this.setCameraPositionAndTarget(camera, cameraData);
    return camera;
  }

  setCameraPositionAndTarget(camera, cameraData) {
    // position
    camera.position.set(
      cameraData.location[0],
      cameraData.location[1],
      cameraData.location[2]
    );

    // target
    camera.lookAt(
      new THREE.Vector3(
        cameraData.target[0],
        cameraData.target[1],
        cameraData.target[2]
      )
    );
  }
}

export default MyCameras;
