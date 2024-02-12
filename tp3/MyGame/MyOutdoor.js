import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

class OutdoorDisplay {
  constructor(myHud) {
    this.myHud = myHud;
    this.display = new THREE.Group();
    this.display.name = 'Outdoor Display';
    this.fontLoaded = false;

    // Load the font once
    this.fontLoadedPromise = new Promise((resolve, reject) => {
      const fontLoader = new FontLoader();
      fontLoader.load('./fonts/font.json', (font) => {
        if (font) {
          this.font = font;
          resolve();
        } else {
          reject(new Error('Failed to load font.'));
        }
      });
    }).then(() => {
      this.fontLoaded = true;
      this.updateDisplay();
    }).catch((error) => {
      console.error(error);
    });
  }

  createTimeMesh(text, x, y) {
    this.elapsedTimeText = this.createTextMesh(text, x, y);
  }

  createLapsMesh(text, x, y) {
    this.lapsText = this.createTextMesh(text, x, y);
  }

  createSpeedMesh(text, x, y) {
    this.maxSpeedText = this.createTextMesh(text, x, y);
  }

  createGameStatusMesh(text, x, y) {
    this.gameStateText = this.createTextMesh(text, x, y);
  }

  createTextMesh(text, x, y) {
    if (!this.font) {
      throw new Error('Font not loaded yet.');
    }

    const textGeometry = new TextGeometry(text, {
      font: this.font,
      size: 0.2,
      height: 0.05,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(x, y, 0);
    return textMesh;
  }

  updateDisplay() {
    const updatedText = this.myHud.elapsedTimeElement.innerText;
    this.createTimeMesh(updatedText, 0, 0);

    const updatedLapsText = this.myHud.lapsCompletedElement.innerText;
    this.createLapsMesh(updatedLapsText, 0, -0.5);

    const updatedSpeedText = this.myHud.maxSpeedElement.innerText;
    this.createSpeedMesh(updatedSpeedText, 0, -1);

    const updatedGameStateText = this.myHud.gameStatusElement.innerText;
    this.createGameStatusMesh(updatedGameStateText, 0, -1.5);

    // Add or update the elements in the display
    this.display.children = [];
    this.display.add(this.elapsedTimeText);
    this.display.add(this.lapsText);
    this.display.add(this.maxSpeedText);
    // this.display.add(this.powerUpText);
    this.display.add(this.gameStateText);
  }

  setPosition(x, y, z) {
    this.display.position.set(x, y, z);
  }

  addToScene(scene) {
    scene.add(this.display);
  }
}

export { OutdoorDisplay };
