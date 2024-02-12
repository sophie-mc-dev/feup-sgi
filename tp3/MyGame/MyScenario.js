import * as THREE from "three";
import { Perlin } from "../Perlin.js"

class MyScenario {
  constructor() {
    this.terrain = new THREE.Group();
    this.heightmap = "./MyGame/myTextures/heightmap.png";
    this.perlin = new Perlin();

    this.init();
  }

  init() {
    this.generateTerrains([
      { position: new THREE.Vector3(-1500, 0, 20) },
      { position: new THREE.Vector3(-1500, 1500, 20) },
      { position: new THREE.Vector3(0, 1500, 20) },
      { position: new THREE.Vector3(1500, 1500, 20) },
      { position: new THREE.Vector3(1500, 0, 20) },
      { position: new THREE.Vector3(-1500, -1500, 20) },
      { position: new THREE.Vector3(0, -1500, 20) },
      { position: new THREE.Vector3(1500, -1500, 20) },
    ]);
  }

  generateTerrains(positions) {
    const geometry = new THREE.PlaneGeometry(2000, 2000, 256, 256);

    const texture = new THREE.TextureLoader().load(
      "./myGame/myTextures/grass.jpg"
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2000, 2000);
    const material = new THREE.MeshLambertMaterial({ map: texture });

    positions.forEach((pos) => {
      const terrain = new THREE.Mesh(geometry, material);

      terrain.position.copy(pos.position);
      this.terrain.add(terrain);

      const peak = 60;
      const smoothing = 300;
      const vertices = terrain.geometry.attributes.position.array;

      for (let i = 0; i < vertices.length; i += 3) {
        vertices[i + 2] = peak * this.perlin.noise(
          vertices[i] / smoothing,
          vertices[i + 1] / smoothing
        );
      }

      terrain.geometry.attributes.position.needsUpdate = true;
      terrain.geometry.computeVertexNormals();
    });

    this.terrain.name = "perlinTerrain"
    this.terrain.rotation.x = -Math.PI / 2;
    this.terrain.position.set(0, -0.1, 0);
    this.terrain.scale.set(0.1, 0.1, 0.1)
    this.terrain.castShadow = this.terrain.receiveShadow = true;
  }
}

export { MyScenario };
