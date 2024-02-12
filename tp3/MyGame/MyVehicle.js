import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class MyVehicle {
  constructor(myReader) {
    this.myReader = myReader;
    this.manualCarModels = [];
    this.autonomousCarModels = [];

    // Car movement variables
    this.speed = 0;
    this.maxSpeed = 3;
    this.acceleration = 0.02;
    this.maxAcceleration = 0.02;
    this.brakeSpeed = -0.02;
    this.turnSpeed = 0.05;
    this.rotationAngle = 0;

    // Variables to track car movement
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.wheelRotationSpeed = 0.1;
    this.turningLeft = false;
    this.turningRight = false;
    this.isCoasting = false;
    this.leftWheel = null;
    this.rightWheel = null;

    // Speed at which the car moves
    this.carMoveSpeed = 0.1;

    this.accelerate = false;
    this.brake = false;

    // Direction vector
    this.direction = new THREE.Vector3(1, 0, 0);

    this.collisionSphere = new THREE.Sphere(new THREE.Vector3(), 0.35); // Adjust the radius as needed

    const collisionSphereGeometry = new THREE.SphereGeometry(0.35, 32, 32); // Adjust the radius and segments as needed
    const collisionSphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000, // Set the color to red (adjust as needed)
      transparent: true,
      opacity: 0.5, // Set the opacity to make it semi-transparent
    });

    this.collisionSphereMesh = new THREE.Mesh(
      collisionSphereGeometry,
      collisionSphereMaterial
    );
    this.collisionSphereMesh.visible = false; // Initially, make the sphere invisible
    this.myReader.app.scene.add(this.collisionSphereMesh);

    // Create a camera for the car's view
    this.camera = new THREE.PerspectiveCamera(
      75, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );

    // Set initial camera position and look-at direction
    this.camera.position.set(0, 3, -5); // Adjust the initial position based on your preference
    this.camera.lookAt(0, 1, 0); // Adjust the look-at direction based on your preference

    // Add the camera to the scene
    this.myReader.app.cameras["Car"] = this.camera;

    const obstacleButton = document.getElementById("pickObstacle");
    obstacleButton.addEventListener("click", this.pickObstacle.bind(this));
    const doneButton = document.getElementById("obstaclePickingDone");
    doneButton.addEventListener("click", this.donePicking.bind(this));

    const positionObstacle = document.getElementById("positionObstacle");
    positionObstacle.addEventListener(
      "click",
      this.positionObstacle.bind(this)
    );
    const donePositioningObstacle = document.getElementById(
      "obstaclePositionDone"
    );
    donePositioningObstacle.addEventListener(
      "click",
      this.donePositionObstacle.bind(this)
    );

    this.init();
  }

  startListening() {
    // Event listeners for key presses
    document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    document.addEventListener("keyup", this.onKeyUp.bind(this), false);
  }

  init() {
    this.createVehicles();
  }

  addAutoCar(autoCar) {
    this.autonomousCarModels.push(autoCar);
  }

  addManualCar(manualCar) {
    this.manualCarModels.push(manualCar);
  }

  getAutoCars() {
    return this.autonomousCarModels;
  }

  getManualCars() {
    return this.manualCarModels;
  }

  loadCarModel(url, type) {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const carModel = {
          type: type,
          model: gltf.scene,
        };
        carModel.model.castShadow = carModel.model.receiveShadow = true;
        if (type === "manual") {
          this.addManualCarModel(carModel.model);
        } else if (type === "autonomous") {
          this.addAutoCar(carModel.model);
        }
      },
      undefined,
      (error) => {
        console.error("Error loading car model:", error);
      }
    );
  }

  createVehicles() {
    // MANUAL
    this.loadCarModel("./MyGame/myModels/go-kart/go-kart.glb", "manual");
    this.loadCarModel("./MyGame/myModels/red-car/red-kart.glb", "manual");

    // AUTO
    this.loadCarModel("./MyGame/myModels/go-kart/go-kart.glb", "autonomous");
    this.loadCarModel("./MyGame/myModels/red-car/red-kart.glb", "autonomous");
  }

  addManualCarModel(model) {
    this.manualCarModels.push(model);
  }

  addAutonomousCarModel(model) {
    this.autonomousCarModels.push(model);
  }

  onKeyDown(event) {
    switch (event.code) {
      case "KeyW":
        this.accelerate = true;
        this.moveForward = true;
        break;
      case "KeyS":
        this.brake = true;
        this.moveBackward = true;
        break;
      case "KeyA":
        this.moveLeft = true;
        this.turningLeft = true;
        break;
      case "KeyD":
        this.moveRight = true;
        this.turningRight = true;
        break;
      case "KeyP":
        if (!this.myReader.myRoute.mixerPause) {
          this.myReader.app.setActiveCamera("Custom Perspective");
          this.myReader.app.cameras["Custom Perspective"].position.set(
            45,
            10,
            -30
          );
          this.myReader.app.controls.target.copy(
            this.myReader.myOutdoor.display.position
          );
          this.myReader.myOutdoor.updateDisplay();
          this.myReader.myRoute.mixerPause = true;
          const obstacleMenu = document.getElementById("obstacleMenu");
          obstacleMenu.style.display = "block";
        } else {
          this.myReader.app.setActiveCamera("Car");
          this.myReader.myRoute.mixerPause = false;
          const obstacleMenu = document.getElementById("obstacleMenu");
          obstacleMenu.style.display = "none";
        }
        break;
      // case "KeyR":
      //   this.myReader.endGame();
    }
  }

  pickObstacle() {
    console.log("Picking obstacle...");
    this.myReader.app.activeCameraName = "Parking Lot";
    this.myReader.app.cameras["Parking Lot"].position.set(-7, 3, 25);
    this.myReader.app.controls.target.set(-7, 0, 30);
    const startMenu = document.getElementById("obstacleMenu");
    startMenu.style.display = "none";
    const doneButton = document.getElementById("obstaclePickingDoneMenu");
    doneButton.style.display = "block";
  }

  donePicking() {
    this.myReader.app.activeCameraName = "Custom Perspective";
    this.myReader.app.cameras["Custom Perspective"].position.set(45, 10, -30);
    this.myReader.app.controls.target.copy(
      this.myReader.myOutdoor.display.position
    );
    this.myReader.myOutdoor.updateDisplay();
    const doneButton = document.getElementById("obstaclePickingDoneMenu");
    doneButton.style.display = "none";
    const obstacleMenu = document.getElementById("obstacleMenu");
    obstacleMenu.style.display = "block";
  }

  positionObstacle() {
    console.log("Positioning obstacle...");
    this.myReader.app.setActiveCamera("Custom Perspective");
    this.myReader.app.activeCameraName = "Custom Perspective";
    this.myReader.app.cameras["Custom Perspective"].position.set(10, 10, 0);
    this.myReader.app.controls.target.set(0, 0, 0);
    const startMenu = document.getElementById("obstaclePickingDoneMenu");
    startMenu.style.display = "none";
    const doneButton = document.getElementById("obstaclePositionDoneMenu");
    doneButton.style.display = "block";
  }

  donePositionObstacle() {
    this.myReader.app.setActiveCamera("Parking Lot");
    this.myReader.app.activeCameraName = "Parking Lot";
    this.myReader.app.cameras["Parking Lot"].position.set(-7, 3, 25);
    this.myReader.app.controls.target.set(-7, 0, 30);
    const doneButton = document.getElementById("obstaclePositionDoneMenu");
    doneButton.style.display = "none";
    const startMenu = document.getElementById("obstaclePickingDoneMenu");
    startMenu.style.display = "block";
  }

  // Event handler for key up
  onKeyUp(event) {
    switch (event.code) {
      case "KeyW":
        this.accelerate = false;
        this.moveForward = false;
        break;
      case "KeyS":
        this.brake = false;
        this.moveBackward = false;
        break;
      case "KeyA":
        this.moveLeft = false;
        this.turningLeft = false;
        break;
      case "KeyD":
        this.moveRight = false;
        this.turningRight = false;
        break;
    }
  }

  // Update function to move the car based on key presses
  updateCarMovement(selectedManualCar) {
    if (selectedManualCar) {
      const carPosition = selectedManualCar.position;
      const carRotation = selectedManualCar.rotation.y;

      // Calculate the offset from the car's position
      const offset = new THREE.Vector3(0, 2, -3); // Adjust the offset based on your preference

      // Apply the car's rotation to the offset
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), carRotation);

      // Set the camera position to the sum of the car's position and the offset
      this.camera.position.copy(carPosition).add(offset);
    }

    if (this.myReader.myRoute.mixerPause) return;

    this.myReader.myHud.maxSpeed = Math.max(
      this.myReader.myHud.maxSpeed,
      this.speed
    );
    const closestPoint = this.findClosestPointOnCurve(
      this.myReader.myTrack.path,
      this.collisionSphere.center
    );
    const distance = closestPoint.distanceTo(this.collisionSphere.center);
    if (distance > this.myReader.myTrack.width / 2) {
      this.maxSpeed = 1;
      this.acceleration = this.maxAcceleration / 2 - 0.002;
    } else {
      this.maxSpeed = 5;
      this.acceleration = this.maxAcceleration;
    }

    if (selectedManualCar) {
      this.collisionSphere.center.copy(selectedManualCar.position);
      if (this.collisionSphereMesh) {
        this.collisionSphereMesh.position.copy(selectedManualCar.position);
      }

      this.myReader.myObstacle.boundingSpheres.forEach((obstacle, index) => {
        if (
          this.checkCollision(this.collisionSphere, obstacle) &&
          this.myReader.myObstacle.obstaclesLayer[index]
        ) {
          const obstacleType =
            this.myReader.myObstacle.obstaclesLayer[index].name;

          if (obstacleType === "red") {
            this.myReader.myObstacle.slowDown(
              5,
              this.speed,
              this.myReader.myHud
            );
          } else if (obstacleType === "yellow") {
            this.myReader.myObstacle.increaseElapsedTime(
              this.myReader.myHud,
              5
            );
          }
        }
      });

      this.myReader.myPowerUp.boundingSpheres.forEach((powerUp, index) => {
        if (
          this.checkCollision(this.collisionSphere, powerUp) &&
          this.myReader.myPowerUp.powerUpsLayer.children[index]
        ) {
          const powerUpType =
            this.myReader.myPowerUp.powerUpsLayer.children[index].name;
          console.log(this.myReader.myPowerUp.powerUpsLayer.children);

          if (powerUpType === "green") {
            this.myReader.myPowerUp.speedUp(5, this, this.myReader.myHud);
            console.log(this.maxAcceleration);
          } else if (powerUpType === "blue") {
            this.myReader.myPowerUp.decreaseElapsedTime(
              this.myReader.myHud,
              -5
            );
          }
        }
      });

      if (
        this.checkCollision(
          this.collisionSphere,
          this.myReader.myTrack.collisionSphere
        )
      ) {
        if (this.myReader.myHud.lapsCompleted < this.myReader.myHud.maxLaps)
          this.myReader.myTrack.completeLap(this.myReader.myHud);
      }

      // Acceleration and braking logic
      if (this.accelerate) {
        this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        this.isCoasting = false; // Reset coasting when accelerating
      } else if (this.brake) {
        this.speed = Math.max(this.speed + this.brakeSpeed, -this.maxSpeed);
        this.isCoasting = false; // Reset coasting when braking
      } else if (!this.isCoasting) {
        // Start coasting
        this.isCoasting = true;
        this.coastingStartTime = Date.now();
      }

      // Coasting logic
      if (this.isCoasting) {
        const coastingTime = (Date.now() - this.coastingStartTime) / 1000; // in seconds
        const deceleration = 0.1; // Adjust as needed

        // Apply deceleration based on the direction of movement
        const decelerationFactor = this.speed >= 0 ? 1 : -1;
        const calc =
          this.speed - deceleration * coastingTime * decelerationFactor;
        this.speed = this.speed >= 0 ? Math.max(calc, 0) : Math.min(calc, 0);
      }

      // Turning logic
      const turnAngle = this.turnSpeed * this.speed;
      if (this.turningLeft) {
        // Apply rotation to the car around the rear axle (center of the rear axle)
        const rearAxlePosition = new THREE.Vector3(0, 0, -1); // Adjust the position based on your model
        selectedManualCar.position.add(rearAxlePosition);
        selectedManualCar.rotation.y += turnAngle;
        this.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), turnAngle);
        selectedManualCar.position.sub(rearAxlePosition);
        this.rotateWheels(true, selectedManualCar);
      }
      if (this.turningRight) {
        // Apply rotation to the car around the rear axle (center of the rear axle)
        const rearAxlePosition = new THREE.Vector3(0, 0, -1); // Adjust the position based on your model
        selectedManualCar.position.add(rearAxlePosition);
        selectedManualCar.rotation.y -= turnAngle;
        this.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), -turnAngle);
        selectedManualCar.position.sub(rearAxlePosition);
        this.rotateWheels(false, selectedManualCar);
      }

      // Movement logic
      const moveDirection = this.direction
        .clone()
        .multiplyScalar(this.carMoveSpeed * this.speed);
      selectedManualCar.position.add(moveDirection);

      // Update the speed based on deceleration
      if (!this.accelerate && !this.brake && !this.isCoasting) {
        const deceleration =
          this.speed > 0 ? this.brakeSpeed : -this.brakeSpeed;
        this.speed = Math.max(this.speed + deceleration, 0);
      }
    }
  }

  checkCollision(sphere1, sphere2) {
    const distanceSquared = sphere1.center.distanceToSquared(sphere2.center);
    const sumOfRadiiSquared = sphere1.radius + sphere2.radius;
    return distanceSquared < sumOfRadiiSquared;
  }

  rotateWheels(left, selectedCar) {
    const maxRot = left ? 60 : -60;
    if (selectedCar.children[0] && selectedCar.children[4]) {
      if (left) {
        selectedCar.children[0].rotation.y = Math.min(
          this.wheelRotationSpeed * this.speed,
          maxRot
        );
        selectedCar.children[4].rotation.y = Math.min(
          this.wheelRotationSpeed * this.speed,
          maxRot
        );
      } else {
        selectedCar.children[0].rotation.y = Math.max(
          -this.wheelRotationSpeed * this.speed,
          maxRot
        );
        selectedCar.children[4].rotation.y = Math.max(
          -this.wheelRotationSpeed * this.speed,
          maxRot
        );
      }
    }
  }

  findClosestPointOnCurve(curve, point) {
    const divisions = curve.points.length * 10; // Adjust the number of divisions as needed
    let closestPoint = null;
    let closestDistance = Infinity;

    for (let i = 0; i <= divisions; i++) {
      const t = i / divisions;
      const curvePoint = curve.getPointAt(t);
      const distance = curvePoint.distanceTo(point);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint = curvePoint.clone(); // Clone to avoid modifying the original point on the curve
      }
    }
    return closestPoint;
  }

  update() {
    this.updateCarMovement(selectedManualCar);
  }
}

export { MyVehicle };
