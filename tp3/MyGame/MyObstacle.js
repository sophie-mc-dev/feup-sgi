import * as THREE from "three";

class MyObstacle {
  constructor() {
    this.obstaclesLayer = [];

    this.obstacles = [];
    this.boundingSpheres = [];

    this.shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: `
      uniform float time;
        void main() {
            float displacement = 0.1 * sin(2.0 * 3.14159265 * (position.y + time));
            vec3 newPosition = position + normal * displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 obstacleColor;
        varying vec3 vNormal;
    
        void main() {
          gl_FragColor = vec4(obstacleColor, 1.0); 
        }
      `,
      uniforms: {
        time: { value: 0.0 },
        obstacleColor: { value: new THREE.Color() },
      },
    });

    this.init();
    this.cooldown = false;
  }

  init() {
    this.createObstacles();
  }

  createCylinder(color, name) {
    const radius = 1;
    const height = 3;
    const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
    const material = this.shaderMaterial.clone();
    
    const obstacle = new THREE.Mesh(geometry, this.shaderMaterial);

    obstacle.material.uniforms.obstacleColor.value.set(color);
    obstacle.name = name;
    obstacle.scale.set(0.1, 0.1, 0.1);

    this.addObstacle(obstacle);
  }

  createObstacles() {
    this.createCylinder(0xff0000, "red");
    this.createCylinder(0xffff00, "yellow");
  }

  addNewObstacle(mesh, position) {
    const clonedMesh = mesh.clone();
    clonedMesh.material.wireframe = false;
    clonedMesh.position.copy(position);
    this.obstaclesLayer.push(clonedMesh);
    this.boundingSpheres.push(new THREE.Sphere(position, 0.1)); // Adjust the radius as needed

    return clonedMesh;
  }

  getModelByID(id) {
    return this.obstacles.find((obstacle) => obstacle.id === id);
  }

  addObstacle(obstacleModel) {
    this.obstacles.push(obstacleModel);
  }

  getObstacles() {
    return this.obstacles;
  }

  slowDown(seconds, speed, myHud) {
    if (this.cooldown) {
      console.log("Slowdown is on cooldown.");
      return;
    }
    myHud.startSpeedDown(seconds);
    const originalSpeed = speed;
    speed *= 0.7;

    console.log(`Collision with a red obstacle!`);
    console.log(`Speed reduced to ${speed}`);

    this.cooldown = true;

    setTimeout(() => {
      speed = originalSpeed;
      console.log(`Speed restored to ${speed}`);
      this.cooldown = false;
    }, seconds * 1000);
  }

  increaseElapsedTime(myHud, timePenalty) {
    if (this.cooldown) {
      console.log("Increase elapsed time is on cooldown.");
      return;
    }

    myHud.increaseElapsedTime(timePenalty);
    console.log(`Collision with a yellow obstacle!`);
    console.log(`Elapsed time increased by ${timePenalty}s`);

    this.cooldown = true;

    setTimeout(() => {
      console.log("Cooldown ended.");
      this.cooldown = false;
    }, 5000);
  }
}

export { MyObstacle };
