// speed boost
// fuel

/**
 * Develop at least two different types of power-ups, with each type offering a different benefit.
 * Suggestions (others may be defined) of possible benefits to be implemented:
 * Allow a maximum speed equal to 200% of the normal maximum speed during N seconds (configurable);
 * the remaining time must be displayed on the interface. After this time, the maximum speed returns to the normal value.
 * Reduction, in the total time, of a portion to be defined (configuration).
 *
 * NOTES:
 * It is mandatory, in addition to a benefit, that the player chooses a new obstacle from among those available in the obstacles
 * park and places it at the desired point on the track (for this purpose, the game is paused).
 * The 3D geometric shape representing the power-up is free.
 * Autonomous cars are not influenced by power-ups.
 */
import * as THREE from "three";

class MyPowerUp {
  constructor() {
    this.powerUpsLayer = new THREE.Group();
    this.powerUpsLayer.name = "powerUpsLayer"

    this.powerUps = [];
    this.boundingSpheres = [];

    this.greenPositions = [
      new THREE.Vector3(32, 0.3, 0),
      new THREE.Vector3(-10, 0.3, 15),
    ];
    this.bluePositions = [
      new THREE.Vector3(15, 0.3, -40),
      new THREE.Vector3(-15, 0.3, 1),
      new THREE.Vector3(10, 0.3, 1),
    ];

    this.cooldown = false;

    this.init();
  }

  init() {
    this.createPowerUps();
  }

  createSphere(color, name) {
    const radius = 2;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: color });

    const powerUp = new THREE.Mesh(geometry, material);
    powerUp.name = name;
    powerUp.scale.set(0.1, 0.1, 0.1);

    this.addPowerUp(powerUp);
  }

  createPowerUps() {
    this.createSphere(0x00ff00, "green");
    this.createSphere(0x0000ff, "blue");
  }

  // speed up
  positionGreenPowerUps(powerUpMesh) {
    this.greenPositions.forEach((pos) => {
      const clonedMesh = powerUpMesh.clone();
      clonedMesh.position.copy(pos);
      this.powerUpsLayer.add(clonedMesh);
      this.boundingSpheres.push(new THREE.Sphere(pos, 0.1));
    });
  }

  // decrease time
  positionBluePowerUps(powerUpMesh) {
    this.bluePositions.forEach((pos) => {
      const clonedMesh = powerUpMesh.clone();
      clonedMesh.position.copy(pos);
      this.powerUpsLayer.add(clonedMesh);
      this.boundingSpheres.push(new THREE.Sphere(pos, 0.1));
    });
  }

  addPowerUp(powerUpModel) {
    this.powerUps.push(powerUpModel);
  }

  getPowerUps() {
    return this.powerUps;
  }

  speedUp(duration, car, myHud) {

    if (this.cooldown) {
      console.log("Speedup is on cooldown.");
      return;
    }

    myHud.startSpeedUp(duration);

    const boostFactor = 2;
    const defaultAcceleration = car.maxAcceleration;

    car.maxAcceleration *= boostFactor; 
    console.log(car.maxAcceleration);

    console.log(`Collision with a green power up!`);
    console.log(`Acceleration doubled from ${defaultAcceleration} to ${car.maxAcceleration} for ${duration}s`);

    this.cooldown = true;

    setTimeout(() => {
      car.maxAcceleration = defaultAcceleration;
      console.log(`Acceleration restored to ${car.maxAcceleration}`);
      console.log("Cooldown ended.");
      this.cooldown = false;
    }, duration * 1000);
  }

  decreaseElapsedTime(myHud, timePenalty) {
  
    if (this.cooldown) {
      console.log("Decrease elapsed time is on cooldown.");
      return;
    }

    myHud.increaseElapsedTime(timePenalty)
    console.log(`Collision with a blue obstacle!`);
    console.log(`Elapsed time decreased by ${timePenalty}s`);

    this.cooldown = true;

    setTimeout(() => {
      console.log("Cooldown ended.");
      this.cooldown = false;
    }, 5000);
  }
}

export { MyPowerUp };
