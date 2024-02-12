import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { MyAxis } from "./MyAxis.js";
import { MyTrack } from "./MyGame/MyTrack.js";
import { MyVehicle } from "./MyGame/MyVehicle.js";
import { MyRoute } from "./MyGame/MyRoute.js";
import { MyPowerUp } from "./MyGame/MyPowerUp.js";
import { MyObstacle } from "./MyGame/MyObstacle.js";
import { MyParkingLot } from "./MyGame/MyParkingLot.js";
import { MyHeadsUpDisplay } from "./MyHUD.js";
import { MyScenario } from "./MyGame/MyScenario.js";
import { OutdoorDisplay } from "./MyGame/MyOutdoor.js";
import { MyFirework } from "./MyGame/MyFirework.js";
import { MyBillboard } from "./MyGame/MyBillboard.js";

/**
 *  This class contains the contents of our application
 *  Interprets the information and instantiates the scene's objects,
 *  in the corresponding (x, z) positions.
 */
class MyReader {
  constructor(app) {
    this.app = app;
    this.axis = null;

    this.gltfLoader = new GLTFLoader();

    // Picking
    this.raycaster = new THREE.Raycaster();
    this.raycaster.near = 1;
    this.raycaster.far = 50;
    this.pointer = new THREE.Vector2();

    this.hoveredObject = null;
    this.pickableObjects = [];
    this.draggableObjects = [];

    this.selectedObstacle = null;
    this.clonedAutoCar = null;
    this.clonedManualCar = null;

    this.obstaclePlacementRaycaster = new THREE.Raycaster();
    this.obstaclePlacementPointer = new THREE.Vector2();

    this.textureLoader = new THREE.TextureLoader();

    this.fireworks = [];
    this.fireworksEnabled = true;

    this.debugKeyframesEnabled = false;
    this.isDragging = false;
    this.isMovingCamera = false;

    // INIT CLASSES
    this.myVehicle = new MyVehicle(this);
    this.myPowerUp = new MyPowerUp();
    this.myObstacle = new MyObstacle();
    this.myTrack = new MyTrack();
    this.myRoute = new MyRoute("EASY");
    this.myHud = new MyHeadsUpDisplay(this);
    this.myScenario = new MyScenario();
    this.myOutdoor = new OutdoorDisplay(this.myHud);
    this.myBillboard = new MyBillboard();
    this.playerName = null;

    this.selectedManualCar = null;
    this.selectedAutoCar = null;
    this.clonedAutoCarColisionSphere = new THREE.Sphere(new THREE.Vector3(), 0.35);
    this.lastCollisionTime = null;

    // Add event listener for the player name input
    const playerNameInput = document.getElementById("playerName");
    playerNameInput.addEventListener("input", this.updatePlayerName.bind(this));

    // Add event listener for the start button
    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", this.startGame.bind(this));

    // Add event listeners for picking Manual Car and Autonomous Car
    const pickManualCarButton = document.getElementById("pickManualCarButton");
    pickManualCarButton.addEventListener("click",this.pickManualCar.bind(this));

    const pickAutonomousCarButton = document.getElementById("pickAutonomousCarButton");
    pickAutonomousCarButton.addEventListener("click",this.pickAutonomousCar.bind(this));

    // Add event listener for the done button
    const carPickingDone = document.getElementById("carPickingDone");
    carPickingDone.addEventListener("click", this.donePicking.bind(this));

    this.countdownElement = document.getElementById("countdown");
    this.countdownDuration = 3; // Set the countdown duration in seconds
    this.countdownTimer = null;

    this.modeButton = document.getElementById("modeButton");
    this.mode = "EASY"; // Default mode is easy

    const returnToMenu = document.getElementById("returnToMenuButton");
    returnToMenu.addEventListener("click", this.returnToMenu.bind(this));

    const decreaseLap = document.getElementById("decreaseLap");
    decreaseLap.addEventListener("click", () => this.adjustLaps(-1));

    const increaseLap = document.getElementById("increaseLap");
    increaseLap.addEventListener("click", () => this.adjustLaps(1));

    this.modeButton.addEventListener("click", () => {
      this.toggleMode();
    });

    this.loadModels().then(() => {
      this.init();
    });
  }

  /**
   * Initializes the contents
   */
  init() {
    if (this.axis === null) {
      this.axis = new MyAxis(this);
      // this.app.scene.add(this.axis);
    }

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.app.scene.add(ambientLight);

    // Directional Light
    this.directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
    const helper = new THREE.DirectionalLightHelper(this.directionalLight);
    this.directionalLight.position.set(30, 40, 30);
    this.directionalLight.target.position.set(0, 0, 0);
    // this.directionalLight.castShadow = this.directionalLight.receiveShadow = true;
    this.app.scene.add(this.directionalLight);
    this.app.scene.add(this.directionalLight.target);

    this.app.scene.background = new THREE.Color(0x89cff0);

    // OBJECTS STORAGE
    this.autonomousCars = this.myVehicle.getAutoCars();
    this.manualCars = this.myVehicle.getManualCars();
    this.powerUps = this.myPowerUp.getPowerUps();
    this.obstacles = this.myObstacle.getObstacles();

    // ADD PICKABLE OBJECTS TO PARKING LOT
    const pickableManCar1 = this.manualCars[0]; // green
    const pickableManCar2 = this.manualCars[1]; // blue
    pickableManCar1.name = "blue-car";
    pickableManCar2.name = "green-car";
    pickableManCar2.children[0].children[0].material.color = new THREE.Color(0x00ff00);
    pickableManCar2.children[0].children[0].material.color = new THREE.Color(0x00ff00);
    pickableManCar1.position.set(-20, 1, 30);
    pickableManCar2.position.set(-23, 1, 30);
    pickableManCar1.rotateY(Math.PI);
    pickableManCar2.children[0].rotateY(Math.PI / 2);
    pickableManCar1.scale.set(0.05, 0.05, 0.05);
    pickableManCar2.scale.set(0.01, 0.01, 0.01);
    this.app.scene.add(pickableManCar1);
    this.app.scene.add(pickableManCar2);
    this.pickableObjects.push(pickableManCar1);
    this.pickableObjects.push(pickableManCar2);

    const pickableAutoCar1 = this.autonomousCars[0]; // yellow
    const pickableAutoCar2 = this.autonomousCars[1]; // red
    pickableAutoCar1.name = "yellow-car";
    pickableAutoCar2.name = "red-car";
    pickableAutoCar1.children[6].children[6].material.color = new THREE.Color(0xffff00);
    pickableAutoCar1.children[6].children[7].material.color = new THREE.Color(0xffff00);
    pickableAutoCar1.position.set(-16, 1, 30);
    pickableAutoCar2.position.set(-13, 1, 30);
    pickableAutoCar1.rotateY(Math.PI / 2);
    pickableAutoCar2.children[0].rotateY(Math.PI / 2);
    pickableAutoCar1.scale.set(0.05, 0.05, 0.05);
    pickableAutoCar2.scale.set(0.01, 0.01, 0.01);
    this.app.scene.add(pickableAutoCar1);
    this.app.scene.add(pickableAutoCar2);
    this.pickableObjects.push(pickableAutoCar1);
    this.pickableObjects.push(pickableAutoCar2);

    const pickableObs1 = this.obstacles[0];
    const pickableObs2 = this.obstacles[1];
    pickableObs1.position.set(-9, 1, 30);
    pickableObs2.position.set(-6, 1, 30);
    this.app.scene.add(pickableObs1);
    this.app.scene.add(pickableObs2);
    this.pickableObjects.push(pickableObs1);
    this.pickableObjects.push(pickableObs2);

    // PARKING LOTS
    this.parkingLots = new THREE.Group();
    this.parkingLot1 = new MyParkingLot().parkingsLot;
    this.parkingLot2 = new MyParkingLot().parkingsLot;
    this.parkingLot2.position.set(-10, 0.01, 30);
    this.parkingLots.add(this.parkingLot1, this.parkingLot2);
    this.parkingLots.name = "parkingLots"
    this.parkingLots.castShadow = this.parkingLots.receiveShadow = true;
    this.app.scene.add(this.parkingLots);

    // ===== ADD OBJECTS TO SCENE =====
    this.app.scene.add(this.myTrack.track);

    this.greenPowerUp = this.powerUps[0];
    this.bluePowerUp = this.powerUps[1];
    this.myPowerUp.positionGreenPowerUps(this.greenPowerUp);
    this.myPowerUp.positionBluePowerUps(this.bluePowerUp);
    this.app.scene.add(this.myPowerUp.powerUpsLayer);

    this.myScenario.init();
    this.app.scene.add(this.myScenario.terrain);
    this.app.scene.add(this.myBillboard.billboard);
    this.addScenarioObjects();

    this.myOutdoor.addToScene(this.app.scene);
    this.myOutdoor.setPosition(5.3, 8.5, -34.3);
    this.myOutdoor.display.scale.set(2, 2, 2);
    this.myOutdoor.display.rotateY(Math.PI / 2 - 0.2);

    // Rotate pickable objects
    this.animatePickableObjects();

    // Add Sprites to pickable objects
    this.createSpriteWord("ENEMY YELLOW", pickableAutoCar1.position);
    this.createSpriteWord("ENEMY RED", pickableAutoCar2.position);
    this.createSpriteWord("PLAYER BLUE", pickableManCar1.position);
    this.createSpriteWord("PLAYER GREEN", pickableManCar2.position);
    this.createSpriteWord("SLOW DOWN", pickableObs1.position);
    this.createSpriteWord("INCREASE TIME", pickableObs2.position);

    // EVENT LISTENERS
    document.addEventListener("pointermove", this.onObjectHover.bind(this));
    document.addEventListener("click", this.onClick.bind(this));
    document.addEventListener("click", this.onClickAddedObjects.bind(this));
  }

  loadModels() {
    return new Promise((resolve) => {
      const waitForModelLoad = setInterval(() => {
        if (this.myVehicle.manualCarModels.length > 0) {
          clearInterval(waitForModelLoad);
          resolve();
        }
      }, 100);
    });
  }

  toggleMode() {
    // Toggle between easy and hard modes
    this.mode = this.mode === "EASY" ? "HARD" : "EASY";
    this.updateDifficultyInfo();
    if (this.myRoute.selectedAutoCar && this.myRoute.carModelName) {
      console.log("Switching mode...");
      const existingAutonomousCar = this.myRoute.selectedAutoCar;
      const existingCarModelName = this.myRoute.carModelName;
      this.myRoute = new MyRoute(this.mode);
      this.myRoute.init(existingAutonomousCar, existingCarModelName);
      this.myRoute.debugKeyFrames(existingCarModelName);
      this.app.scene.add(this.myRoute.keyFramesGroup);
    }
    this.myRoute = new MyRoute(this.mode);
    console.log(`Mode switched to: ${this.mode}`);
  }

  updatePlayerName(event) {
    this.playerName = event.target.value.trim();
    this.myHud.update();
  }

  updateStartButtonState() {
    const startButton = document.getElementById("startButton");
    if (
      this.playerName == null ||
      this.playerName === "" ||
      this.clonedManualCar == null ||
      this.clonedAutoCar == null
    ) {
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  }

  startGame() {
    // Check if the player name is filled
    if (!this.playerName) {
      alert("Please enter your name before starting the game.");
      return;
    }

    if (!this.clonedManualCar) {
      alert("Please pick a manual car before starting the game.");
      return;
    }

    if (!this.clonedAutoCar) {
      alert("Please pick an autonomous car before starting the game.");
      return;
    }
    this.gameEnded = false;
    this.gameStarted = true;

    // Remove the start menu
    const startMenu = document.getElementById("startMenu");
    startMenu.style.display = "none";
    this.myVehicle.startListening();
    this.app.activeCameraName = "Car";
    this.startCountdown();
  }

  endGame() {
    if (this.gameEnded) return;

    const players = [
      { name: "Computer", time: this.myRoute.finalTime },
      { name: this.playerName, time: this.myHud.finalTime },
      // Add more players as needed
    ];

    // Sort players by time (assuming lower time is better)
    players.sort((a, b) => a.time - b.time);

    const resultsContainer = document.getElementById("results");

    // Display player information
    players.forEach((player, index) => {
      const playerDiv = document.createElement("div");
      playerDiv.textContent = `#${index + 1} ${player.name} - Time: ${player.time ? this.myHud.formatTime(player.time) : "null"} seconds`;
      resultsContainer.appendChild(playerDiv);
    });

    // Display the winner
    const winnerDiv = document.createElement("div");
    winnerDiv.textContent = `Winner: ${players[0].name}!`;
    resultsContainer.appendChild(winnerDiv);

    this.updateDifficultyInfo();

    // Show the final screen
    document.getElementById("finalScreen").style.display = "block";

    //TODO - Put vitorious car bouncing
    
    this.myHud.update();
    this.clonedAutoCar.position.set(8, 0.2, 17);
    this.clonedManualCar.position.set(8, 0.2, 15);
    this.clonedManualCar.rotation.y = (Math.PI / 2);

    this.app.setActiveCamera("Finish Camera");
    this.myRoute.mixerPause = true;
    this.gameEnded = true;

  }

  updateDifficultyInfo() {
    document.getElementById("difficultyInfo").textContent = `Difficulty: ${this.mode.toUpperCase()}`;
  }

  returnToMenu() {
    location.reload();
  }

  startCountdown() {
    this.countdownElement.style.display = "block";
    let countdownValue = this.countdownDuration;

    const updateCountdown = () => {
      this.countdownElement.textContent = countdownValue;

      if (countdownValue === 0) {
        // Start the game when the countdown reaches 0
        this.myRoute.mixerPause = false;
        this.countdownElement.style.display = "none";
      } else {
        countdownValue--;
        // Schedule the next update after 1 second
        this.countdownTimer = setTimeout(updateCountdown, 1000);
      }
    };
    // Start the initial countdown
    updateCountdown();
  }

  pickManualCar() {
    this.app.activeCameraName = "Parking Lot";
    this.app.cameras["Parking Lot"].position.set(-21, 3, 25);
    this.app.controls.target.set(-21, 1, 30);
    const startMenu = document.getElementById("startMenu");
    startMenu.style.display = "none";
    const doneButton = document.getElementById("doneMenu");
    doneButton.style.display = "block";
  }

  pickAutonomousCar() {
    this.app.activeCameraName = "Parking Lot";
    this.app.cameras["Parking Lot"].position.set(-15, 3, 25);
    this.app.controls.target.set(-15, 1, 30);
    const startMenu = document.getElementById("startMenu");
    startMenu.style.display = "none";
    const doneButton = document.getElementById("doneMenu");
    doneButton.style.display = "block";
  }

  donePicking() {
    const doneButton = document.getElementById("doneMenu");
    doneButton.style.display = "none";
    const startMenu = document.getElementById("startMenu");
    startMenu.style.display = "block";
  }

  adjustLaps(amount) {
    this.myHud.maxLaps = Math.max(1, this.myHud.maxLaps + amount);

    this.updateLapCount();
  }

  updateLapCount() {
    document.getElementById("lapCount").textContent = `${
      this.myHud.maxLaps
    } Lap${this.myHud.maxLaps > 1 ? "s" : ""}`;
  }

  addScenarioObjects() {
    // ADD BANNER
    this.gltfLoader.load("./MyGame/myModels/banner.glb", (gltf) => {
      const banner = gltf.scene;
      banner.name = "banner";
      banner.scale.set(0.2, 0.2, 0.2);
      banner.position.set(10, 2, 16);
      banner.rotateY(-0.1);
      banner.castShadow = banner.receiveShadow = true;
      this.app.scene.add(banner);
    });

    // ADD TREES
    this.gltfLoader.load("./MyGame/myModels/tree.glb", (gltf) => {
      const tree1 = gltf.scene;
      tree1.name = "tree1";
      tree1.scale.set(5, 5, 5);
      tree1.castShadow = tree1.receiveShadow = true;

      const tree2 = tree1.clone();
      tree1.name = "tree2";
      const tree3 = tree1.clone();
      tree1.name = "tree3";
      const tree4 = tree1.clone();
      tree1.name = "tree4";
      const tree5 = tree1.clone();
      tree1.name = "tree5";

      tree1.position.set(15, 6, -5);
      tree2.position.set(-22, 6, 6);
      tree3.position.set(6, 6, -15);
      tree4.position.set(30, 6, 15);
      tree5.position.set(30, 6, -35);

      this.app.scene.add(tree1);
      this.app.scene.add(tree2);
      this.app.scene.add(tree3);
      this.app.scene.add(tree4);
      this.app.scene.add(tree5);
    });

    // ADD BUILDING
    this.gltfLoader.load("./MyGame/myModels/building.glb", (gltf) => {
      const building = gltf.scene;
      building.name = "building";
      building.position.set(5, 1.8, 30);
      building.scale.set(7, 7, 7);
      building.castShadow = building.receiveShadow = true;
      this.app.scene.add(building);
    });

    // ADD SEATS
    this.gltfLoader.load("./MyGame/myModels/seats.glb", (gltf) => {
      const seats1 = gltf.scene;
      seats1.name = "seats1";
      seats1.scale.set(0.5, 0.5, 0.5);
      seats1.castShadow = seats1.receiveShadow = true;

      const seats2 = seats1.clone();
      seats2.name = "seats2";
      const seats3 = seats1.clone();
      seats3.name = "seats3";

      seats1.rotateY(Math.PI - 0.05);
      seats1.position.set(0, 1.8, 9);

      seats2.position.set(-9, 1.8, -9);
      seats2.rotateY(Math.PI / 4);
      seats2.rotateY(Math.PI);

      seats3.position.set(40, 1.8, -5);
      seats3.rotateY(Math.PI / 2);

      this.app.scene.add(seats1);
      this.app.scene.add(seats2);
      this.app.scene.add(seats3);
    });

    this.gltfLoader.load("./MyGame/myModels/outdoor.glb", (gltf) => {
      const outdoor = gltf.scene;
      outdoor.name = "outdoor";
      outdoor.position.set(6, 5, -39);
      outdoor.scale.set(20, 20, 20);
      outdoor.rotateY(5);
      outdoor.castShadow = outdoor.receiveShadow = true;
      this.app.scene.add(outdoor);
    });
  }

  /**
   * Displays pickable objects wireframe when hovered
   * @param {*} event 
   */
  onObjectHover(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

    const intersects = this.raycaster.intersectObjects(
      this.pickableObjects,
      true
    );

    if (intersects.length > 0) {
      if (this.hoveredObject) {
        this.hoveredObject.material.wireframe = false;
      }
      this.hoveredObject = intersects[0].object;
      this.hoveredObject.material.wireframe = true;
    } else {
      if (this.hoveredObject) {
        this.hoveredObject.material.wireframe = false;
        this.hoveredObject = null;
      }
    }
  }

  /**
   * Click function to handle click only on obstacles objects
   * that have been added to the scene
   * @param {*} event
   */
  onClickAddedObjects(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

    this.draggableObjects = this.myObstacle.obstaclesLayer;

    const intersects = this.raycaster.intersectObjects(this.draggableObjects);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      this.startDragging(selectedObject);
      console.log(selectedObject.position);
    }
  }

  /**
   * Allows the dragging of obstacles that have been added to the scene
   * @param {*} object
   */
  startDragging(object) {
    const domElement = this.app.renderer.domElement;

    let previousMousePosition = {
      x: 0,
      y: 0,
    };

    const onMouseMove = (event) => {
      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
        z: 0, 
      };

      if (this.isDragging) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

        const intersects = raycaster.intersectObjects(this.draggableObjects);

        if (intersects.length > 0) {
          const intersectedObject = intersects[0].object;
          if (intersectedObject === object) {
            // Calculate the potential new positions
            const newX = object.position.x + deltaMove.x * 0.02;
            const newY = object.position.y - deltaMove.y * 0.02;
            const newZ = object.position.z + deltaMove.z * 0.02;

            // Update object's position within constraints
            object.position.x = newX;
            object.position.y = Math.max(newY, 0); // Restrict y position to y = 0
            object.position.z = newZ;
          }
        }
      }

      previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const onMouseDown = () => {
      this.isDragging = true;
    };

    const onMouseUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
      }
    };

    domElement.addEventListener("mousemove", onMouseMove, false);
    domElement.addEventListener("mousedown", onMouseDown, false);
    domElement.addEventListener("mouseup", onMouseUp, false);
  }

  /**
   * Click function for picking objects from the parking lot and adding them to the scene accordingly
   * @param {*} event 
   */
  onClick(event) {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.app.getActiveCamera());

    const intersects = this.raycaster.intersectObjects(this.pickableObjects);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;

      // Find parent group of cars
      const findParentCarGroup = (object) => {
        if (
          object.parent &&
          object.parent.type === "Group" &&
          object.parent.name.includes("car")
        ) {
          return object.parent;
        } else if (object.parent) {
          return findParentCarGroup(object.parent);
        } else {
          return null;
        }
      };

      // Find the parent car group for the selected object
      const selectedCarGroup = findParentCarGroup(selectedObject);

      ///////////////////////////////////////////////// ADD OBSTACLE /////////////////////////////////////////////
      if (this.obstacles.some((obstacle) => obstacle === selectedObject)) {
        this.selectedObstacle = selectedObject;
        console.log(`Picked ${selectedObject.name} obstacle!`);

        const addedObstacleMesh = this.myObstacle.addNewObstacle(
          this.selectedObstacle,
          new THREE.Vector3(0, 0.1, 0)
        );
        this.app.scene.add(addedObstacleMesh);

        ///////////////////////////////////////////////// ADD MANUAL CAR /////////////////////////////////////////////
      } else if (this.manualCars.some((car) => car === selectedCarGroup)) {
        const selectedCarIndex = this.manualCars.indexOf(selectedCarGroup);
        const selectedCar = this.manualCars[selectedCarIndex];
        console.log(`Picked manual ${selectedCar.name}!`);
        this.selectedManualCar = selectedCar;
        this.myHud.update();

        // Cloning the selected car object
        this.clonedManualCar = selectedCar.clone();
        this.clonedManualCar.rotation.set(0, 0, 0); // reset rotation
        this.clonedManualCar.position.set(0, 0, 0); // reset position
        this.clonedManualCar.name = "ManualCar";
        // Turn off wireframes for all meshes within the cloned manual car group
        this.clonedManualCar.traverse((child) => {
          if (child.isMesh) {
            child.material.wireframe = false;
          }
        });

        const existingManualCar = this.app.scene.getObjectByName("ManualCar");

        if (existingManualCar) {
          this.app.scene.remove(existingManualCar);
        }

        this.clonedManualCar.position.set(8, 0.2, 15);
        this.clonedManualCar.rotateY(Math.PI / 2);
        this.app.scene.add(this.clonedManualCar);

        ///////////////////////////////////////////////// ADD AUTO CAR /////////////////////////////////////////////
      } else if (this.autonomousCars.some((car) => car === selectedCarGroup)) {
        const selectedCarIndex = this.autonomousCars.indexOf(selectedCarGroup);
        const selectedCar = this.autonomousCars[selectedCarIndex];
        console.log(`Picked autonomous ${selectedCar.name}!`);

        this.selectedAutoCar = selectedCar;

        // Cloning the selected car object
        this.clonedAutoCar = selectedCar.clone();

        // Turn off wireframes for all meshes within the cloned auto car group
        this.clonedAutoCar.traverse((child) => {
          if (child.isMesh) {
            child.material.wireframe = false;
          }
        });

        // Check if another autonomous car is already in the scene
        const existingAutonomousCar =
          this.app.scene.getObjectByName("AutonomousCar");

        if (existingAutonomousCar) {
          this.app.scene.remove(existingAutonomousCar);
          this.app.scene.remove(this.app.scene.getObjectByName("Key Frames"));
        }

        if (selectedCar === this.autonomousCars[0]) {
          this.clonedAutoCar.name = "AutonomousCar";
          this.app.scene.add(this.clonedAutoCar);
          this.myRoute.init(this.clonedAutoCar, "YellowCarModel");
          this.myRoute.debugKeyFrames("YellowCarModel");
          this.app.scene.add(this.myRoute.keyFramesGroup);
        } else if (selectedCar === this.autonomousCars[1]) {
          this.clonedAutoCar.name = "AutonomousCar";
          this.app.scene.add(this.clonedAutoCar);
          this.myRoute.init(this.clonedAutoCar, "RedCarModel");
          this.myRoute.debugKeyFrames("RedCarModel");
          this.app.scene.add(this.myRoute.keyFramesGroup);
        }
      }
    }
  }

  /**
   * Creates a sprite for a specific word and position
   * @param {*} word
   * @param {*} meshPosition
   * @returns
   */
  createSpriteWord(word, meshPosition) {
    return new Promise((resolve, reject) => {
      const spriteGroup = new THREE.Group();
      let currentXPosition = 0;
      const asciiOffset = 32;

      this.textureLoader.load(
        "./MyGame/myTextures/spritesheet.png",
        (texture) => {
          const spritesheetW = texture.image.width;
          const spritesheetH = texture.image.height;

          const cellW = spritesheetW / 16;
          const cellH = spritesheetH / 14;

          const charsPerRow = spritesheetW / cellW;
          const charsPerColumn = spritesheetH / cellH;

          for (let i = 0; i < word.length; i++) {
            const asciiCode = word.charCodeAt(i);
            const adjustedAscii = asciiCode - asciiOffset;

            if (adjustedAscii >= 0) {
              const totalChars = charsPerRow * charsPerColumn;

              if (adjustedAscii < totalChars) {
                let row = Math.floor(adjustedAscii / charsPerRow);
                let column = adjustedAscii % charsPerRow;

                row = charsPerColumn - row - 1;

                const u = (column * cellW) / spritesheetW;
                const v = (row * cellH) / spritesheetH;
                const u2 = ((column + 1) * cellW) / spritesheetW;
                const v2 = ((row + 1) * cellH) / spritesheetH;

                const spriteMaterial = new THREE.SpriteMaterial({
                  map: texture.clone(),
                  rotation: 0,
                  fog: false,
                  transparent: true,
                  opacity: 1,
                });

                spriteMaterial.map.minFilter = THREE.LinearFilter;
                spriteMaterial.map.magFilter = THREE.LinearFilter;
                spriteMaterial.map.anisotropy = 16;

                spriteMaterial.map.offset.set(u, v);
                spriteMaterial.map.repeat.set(u2 - u, v2 - v);

                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.position.set(currentXPosition, 0, 0);
                currentXPosition += 1;

                spriteGroup.add(sprite);
              }
            }
          }

          spriteGroup.position.copy(meshPosition);
          spriteGroup.position.y += 1;
          spriteGroup.position.x += 1;
          spriteGroup.scale.set(0.16, 0.16, 0.16);
          spriteGroup.rotateY(Math.PI);
          spriteGroup.name = "spriteGroup";
          this.app.scene.add(spriteGroup);

          resolve(spriteGroup);
        },
        undefined,
        reject
      );
    });
  }

  /**
   * Function to add a skybox to the scene's background
   */
  mySkybox() {
    const textures = {
      front: "./MyGame/myTextures/skybox/front.jpg",
      back: "./MyGame/myTextures/skybox/back.jpg",
      up: "./MyGame/myTextures/skybox/up.jpg",
      down: "./MyGame/myTextures/skybox/down.jpg",
      right: "./MyGame/myTextures/skybox/right.jpg",
      left: "./MyGame/myTextures/skybox/left.jpg",
    };
    const textureLoader = new THREE.TextureLoader();

    const materials = Object.keys(textures).map((side) => {
      const texture = textureLoader.load(textures[side]);
      return new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
      });
    });

    const geometry = new THREE.BoxGeometry(1000, 1000, 1000);
    this.skybox = new THREE.Mesh(geometry, materials);

    this.app.scene.add(this.skybox);
  }

  /**
   * Function that removes obstacles from the scene and cleans obstacles array
   */
  removeObstacles() {
    this.myObstacle.obstaclesLayer.forEach((obstacle) => {
      this.app.scene.remove(obstacle);
    });
    this.myObstacle.obstaclesLayer.length = 0;
  }

  /**
   * Function that toggles the visibility of Debug Keyframe Meshes ON or OFF
   */
  toggleKeyFramesVisibility() {
    this.debugKeyframesEnabled = !this.debugKeyframesEnabled;
    if (this.myRoute.keyFramesGroup) {
      this.myRoute.keyFramesGroup.visible = this.debugKeyframesEnabled;
    }
  }

  /**
   * Function that animates the objects in the parking lot.
   * The cars have a rotation applied to them.
   * The obstacles move up and down and its shape varies in time, giving them a pulsating effect.
   */
  animatePickableObjects() {
    const animateObjects = () => {
      this.pickableObjects.forEach((object) => {
        if (
          this.autonomousCars.includes(object) ||
          this.manualCars.includes(object)
        ) {
          // Rotate cars
          object.rotation.y += 0.005;
        } else {
          // Move obstacles vertically
          object.position.y += Math.sin(Date.now() * 0.005) * 0.001;
          object.material.uniforms.time.value += 0.005;
        }
      });
      requestAnimationFrame(animateObjects);
    };
    animateObjects();
  }

  /**
   * Function that manages the fireworks of the scene
   */
  manageFireworks() {
      // Add new fireworks every 5% of the calls
      if (Math.random() < 0.5) {
        this.fireworks.push(new MyFirework(this.app, this, [10, 0, 13]));
        this.fireworks.push(new MyFirework(this.app, this, [10, 0, 19]));
      }

    // For each firework
    for (let i = 0; i < this.fireworks.length; i++) {
      // Is firework finished?
      if (this.fireworks[i].done) {
        // Remove firework
        this.fireworks.splice(i, 1);
        continue;
      }
      // Otherwise update firework
      this.fireworks[i].update();
    }
  }

  update() {
    if (this.app.activeCameraName === "Car") {
      this.app.controls.target.copy(this.clonedManualCar.position);

    }else if (this.app.activeCameraName === "Finish Camera") {
      return;
    }
     else if (this.app.activeCameraName !== "Parking Lot" && this.app.activeCameraName !== "Custom Perspective") {
      this.app.controls.target.set(0, 0, 0);
    }
    this.app.controls.update();

    if (this.myHud.lapsCompleted >= this.myHud.maxLaps || this.myRoute.lapsCompleted >= this.myHud.maxLaps)
    this.manageFireworks();
    if (this.myHud.lapsCompleted >= this.myHud.maxLaps && this.myRoute.lapsCompleted >= this.myHud.maxLaps){
      this.endGame();
    }
    this.updateStartButtonState();
    const currentTime = new Date();
    
    // Check if enough time has passed since the last collision
    if (currentTime - this.lastCollisionTime > 10000 && this.gameStarted) {
      if (this.lastCollisionTime === null) {
        this.lastCollisionTime = currentTime;
        return;
      }
      if (this.clonedAutoCar) {
        this.clonedAutoCarColisionSphere.center.copy(
          this.clonedAutoCar.position
        );
        if (this.myVehicle.checkCollision(this.clonedAutoCarColisionSphere, this.myTrack.collisionSphere)) {
          this.myRoute.lapsCompleted += 1;
          this.lastCollisionTime = currentTime; // Update the last collision time
          if (this.myRoute.lapsCompleted == this.myHud.maxLaps) {
            this.myRoute.finalTime = this.myHud.elapsedTime + this.myHud.powerUpsTime;
          }
        }
      }
    }
    if(this.myRoute.lapsCompleted < this.myHud.maxLaps)
      this.myRoute.update();
    this.myVehicle.updateCarMovement(this.clonedManualCar);
    this.myHud.update();
  }
}

export { MyReader };
