import * as THREE from "three";
/**
 * Stores the key points of a route.
 */
class MyRoute {
  constructor(mode) {
    this.keyFramesGroup = new THREE.Group();
    this.keyFramesGroup.name = "Key Frames";

    this.keyPoints = {
      RedCarModel: [
        new THREE.Vector3(4, 0.08, 8.5),
        new THREE.Vector3(15, 0.08, 10),
        new THREE.Vector3(20, 0.08, 5),
        new THREE.Vector3(16, 0.08, 0),
        new THREE.Vector3(16, 0.08, -5),
        new THREE.Vector3(20, 0.08, -10),
        new THREE.Vector3(20, 0.08, -15),
        new THREE.Vector3(15, 0.08, -20),
        new THREE.Vector3(10, 0.08, -20),
        new THREE.Vector3(5, 0.08, -20),
        new THREE.Vector3(5, 0.08, -15),
        new THREE.Vector3(10, 0.08, -13),
        new THREE.Vector3(15, 0.08, -10),
        new THREE.Vector3(10, 0.08, -5),
        new THREE.Vector3(10, 0.08, 0),
        new THREE.Vector3(3, 0.08, 0),
        new THREE.Vector3(5, 0.08, -5),
        new THREE.Vector3(5, 0.08, -10),
        new THREE.Vector3(0, 0.08, -10),
        new THREE.Vector3(0, 0.08, -5),
        new THREE.Vector3(-5, 0.08, 0),
        new THREE.Vector3(-10, 0.08, 0),
        new THREE.Vector3(-15, 0.08, 0),
        new THREE.Vector3(-15, 0.08, 5),
        new THREE.Vector3(-5, 0.08, 7),
        new THREE.Vector3(4, 0.08, 8.5),
      ],

      YellowCarModel: [
        new THREE.Vector3(4, 0.08, 8.5),
        new THREE.Vector3(10, 0.08, 10),
        new THREE.Vector3(16, 0.08, 10),
        new THREE.Vector3(20, 0.08, 5),
        new THREE.Vector3(15.5, 0.08, 0),
        new THREE.Vector3(16, 0.08, -5),
        new THREE.Vector3(20, 0.08, -9),
        new THREE.Vector3(20, 0.08, -15),
        new THREE.Vector3(15, 0.08, -20),
        new THREE.Vector3(10, 0.08, -20),
        new THREE.Vector3(5, 0.08, -20),
        new THREE.Vector3(5, 0.08, -15),
        new THREE.Vector3(15, 0.08, -11),
        new THREE.Vector3(15, 0.08, -8.5),
        new THREE.Vector3(10, 0.08, -5),
        new THREE.Vector3(10, 0.08, 0),
        new THREE.Vector3(3, 0.08, 0),
        new THREE.Vector3(5, 0.08, -5),
        new THREE.Vector3(5, 0.08, -10),
        new THREE.Vector3(0, 0.08, -10),
        new THREE.Vector3(0, 0.08, -5),
        new THREE.Vector3(-5, 0.08, 0),
        new THREE.Vector3(-15, 0.08, 0),
        new THREE.Vector3(-15, 0.08, 5),
        new THREE.Vector3(-5, 0.08, 7.5),
        new THREE.Vector3(4, 0.08, 8.5),
      ],
    };

    this.scaleKeyPoints(this.keyPoints, 2);

    this.mixer = null;
    this.mixerTime = 0;
    this.mixerPause = true;

    this.enableAnimationPosition = true;
    this.animationMaxDuration = mode === "EASY" ? 30 : 25; //seconds
    this.timeDivision =  mode === "EASY" ? 31.5 : 26; //seconds

    this.clock = new THREE.Clock();
    this.lapsCompleted = 0;
    this.finalTime = null;
  }

  init(selectedAutoCar, carModelName) {
    if (
      selectedAutoCar !== null &&
      this.keyPoints.hasOwnProperty(carModelName)
    ) {
      this.selectedAutoCar = selectedAutoCar;
      this.carModelName = carModelName;
      this.keyFramesGroup = new THREE.Group();
      this.keyFramesGroup.name = "Key Frames";
      this.setupAnimations(selectedAutoCar, carModelName);
      this.debugKeyFrames(carModelName);
    } else if (selectedAutoCar !== null) {
      console.error(`Route for car model '${carModelName}' not found.`);
    } else {
      console.log("No car selected yet.");
    }
  }

  setupAnimations(selectedAutoCar, carModelName) {
    const positionKeyframes = [];
    const quaternionKeyframes = [];

    for (let i = 0; i < this.keyPoints[carModelName].length; i++) {
      const point = this.keyPoints[carModelName][i];
      positionKeyframes.push(point.x, point.y, point.z);

      const nextIndex = i === this.keyPoints[carModelName].length - 1 ? i : i + 1;
      const currentPoint = this.keyPoints[carModelName][i];
      const nextPoint = this.keyPoints[carModelName][nextIndex];

      const direction = new THREE.Vector3()
        .subVectors(nextPoint, currentPoint)
        .normalize();
        
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        direction
      );

      const euler = new THREE.Euler();
      euler.setFromQuaternion(quaternion);
      quaternionKeyframes.push(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );
    }

    const positionKF = new THREE.VectorKeyframeTrack(
      ".position",
      this.getKeyframeTimes(carModelName), // Array of times (0, 1, 2, ...)
      positionKeyframes,
      THREE.InterpolateSmooth
    );

    const quaternionKF = new THREE.QuaternionKeyframeTrack(
      ".quaternion",
      this.getKeyframeTimes(carModelName),
      quaternionKeyframes
    );

    const positionClip = new THREE.AnimationClip(
      "positionAnimation",
      this.animationMaxDuration,
      [positionKF]
    );
    const rotationClip = new THREE.AnimationClip(
      "rotationAnimation",
      this.animationMaxDuration,
      [quaternionKF]
    );

    this.mixer = new THREE.AnimationMixer(selectedAutoCar);
    const positionAction = this.mixer.clipAction(positionClip);
    const rotationAction = this.mixer.clipAction(rotationClip);

    // positionAction.play();
    rotationAction.play();
  }

  /**
   * Get an array of keyframe times based on the number of key points for a specific car model.
   * @param {string} carModelName - The name of the car model.
   * @returns {number[]} - An array of keyframe times.
   */
  getKeyframeTimes(carModelName) {
    const numKeyPoints = this.keyPoints[carModelName].length;
    return Array.from({ length: numKeyPoints }, (_, i) => i * (this.timeDivision / numKeyPoints));
  }

  /**
   * Set a specific point in the animation clip
   */
  setMixerTime() {
    this.mixer.setTime(this.mixerTime);
  }

  /**
   * Build control points and a visual path for debug
   */
  debugKeyFrames(carModelName) {
    if (this.keyPoints.hasOwnProperty(carModelName) && Array.isArray(this.keyPoints[carModelName])) {
      let spline = new THREE.CatmullRomCurve3([...this.keyPoints[carModelName]]);
  
      // Setup visual control points
      for (let i = 0; i < this.keyPoints[carModelName].length; i++) {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.scale.set(0.1, 0.1, 0.1);
        sphere.position.set(...this.keyPoints[carModelName][i]);
  
        this.keyFramesGroup.add(sphere);
      }
  
      const tubeGeometry = new THREE.TubeGeometry(spline, 100, 0.01, 10, false);
      const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
  
      this.keyFramesGroup.add(tubeMesh);
      // this.keyFramesGroup.rotateZ(Math.PI);
      this.keyFramesGroup.position.set(0, 0.2, 0);
      this.keyFramesGroup.visible = false;
    } else {
      console.error(`Key points for car model '${carModelName}' are not valid.`);
    }
  }
  

  /**
   * Start/Stop all animations
   */
  checkAnimationStateIsPause() {
    if (this.mixerPause) this.mixer.timeScale = 0;
    else this.mixer.timeScale = 1;
  }

  /**
   * Start/Stop if position or rotation animation track is running
   */
  checkTracksEnabled() {
    const actions = this.mixer._actions;
    for (let i = 0; i < actions.length; i++) {
      const track = actions[i]._clip.tracks[0];

      if (
        track.name === ".position" &&
        this.enableAnimationPosition === false
      ) {
        actions[i].stop();
      } else {
        if (!actions[i].isRunning()) actions[i].play();
      }
    }
  }

  scaleKeyPoints(keyPoints, scaleFactor) {
    for (const carModel in keyPoints) {
      if (keyPoints.hasOwnProperty(carModel)) {
        keyPoints[carModel] = keyPoints[carModel].map(point => {
          return new THREE.Vector3(point.x * scaleFactor, point.y * scaleFactor, point.z * scaleFactor);
        });
      }
    }
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   */
  update() {
    if (this.mixer !== null) {
      const delta = this.clock.getDelta();
      this.mixer.update(delta);

      this.checkAnimationStateIsPause();
      this.checkTracksEnabled();
      
    }
  }
}

export { MyRoute };
