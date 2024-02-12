import * as THREE from "three";

class MyCandle {
  constructor() {
    this.candleGroup = new THREE.Group();
    this.buildCandle();
  }

  buildCandle() {
    // Create candle
    const candleGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.2, 32);
    const candleMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./textures/candle-tex.jpeg") });
    const candle = new THREE.Mesh(candleGeometry, candleMaterial);
    
    candle.castShadow = true;
    candle.receiveShadow = true;
    candle.position.set(0, 0, -0.05);

    // Create flame
    const flameGeometry = new THREE.ConeGeometry(0.015, 0.06, 32, 1);
    const flameMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load("./textures/flame-tex.jpeg") });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    
    flame.castShadow = true;
    flame.receiveShadow = true;
    flame.position.set(0, 0.12, -0.05);

    this.candleGroup.add(candle, flame);
    this.candleGroup.position.set(-0.25, 3.75, 0);
  }
}

export { MyCandle };
