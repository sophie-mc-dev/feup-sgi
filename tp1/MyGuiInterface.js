import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyContents } from "./MyContents.js";
import * as THREE from "three";

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {
  /**
   *
   * @param {MyApp} app The application object
   */
  constructor(app) {
    this.app = app;
    this.datgui = new GUI();
    this.contents = null;
  }

  /**
   * Set the contents object
   * @param {MyContents} contents the contents objects
   */
  setContents(contents) {
    this.contents = contents;
  }

  /**
   * Initialize the gui interface
   */
  init() {
    // adds a folder to the gui interface for the floor plane
    const floorFolder = this.datgui.addFolder("Floor");
    floorFolder.addColor(this.contents.room.floorMaterial, "color").name("Diffuse Color");
    floorFolder.addColor(this.contents.room.floorMaterial, "specular").name("Specular Color");
    floorFolder.add(this.contents.room.floorMaterial, "shininess", 0, 30).name("Shininess");
    floorFolder.open();

    // adds a folder to the gui interface for the camera
    const cameraFolder = this.datgui.addFolder("Camera");
    cameraFolder.add(this.app, "activeCameraName", ["Perspective", "Custom Perspective", "Left", "Right", "Top", "Front", "Back",]).name("Active Camera");
    cameraFolder.add(this.app.activeCamera.position, "x", 0, 10).name("X Coordinate");
    cameraFolder.open();

    // adds a folder to the gui interface for the spotlight
    const spotlightFolder = this.datgui.addFolder("Spot Light");
    spotlightFolder.addColor(this.contents.spotLight, "color").name("Color");
    spotlightFolder.add(this.contents.spotLight, "intensity", 0, 30).name("Intensity");
    spotlightFolder.add(this.contents.spotLight, "distance", 0, 20).name("Distance");
    spotlightFolder.add(this.contents.spotLight, "angle", 0, Math.PI / 2).name("Spot Angle");
    spotlightFolder.add(this.contents.spotLight, "penumbra", 0, 1).name("Penumbra Ratio");
    spotlightFolder.add(this.contents.spotLight, "decay", 0, 4).name("Decay");
    spotlightFolder.add(this.contents.spotLight.position, "x", -10, 10).name("Position X");
    spotlightFolder.add(this.contents.spotLight.position, "y", -10, 10).name("Position Y");
    spotlightFolder.add(this.contents.spotLight.target.position, "x", -10, 10).name("Target X");
    spotlightFolder.add(this.contents.spotLight.target.position, "y", -10, 10).name("Target Y");
    spotlightFolder.add(this.contents.spotLight, "visible").name("Enabled");
    spotlightFolder.open();

    // adds a folder to the gui interface for the floor plane texture
    const textureFolder = this.datgui.addFolder("Texture");
    textureFolder.add(this.contents.room.floorTexture.repeat, "x", 0, 10).name("Repeat U");
    textureFolder.add(this.contents.room.floorTexture.repeat, "y", 0, 10).name("Repeat V");
    textureFolder.add(this.contents.room.floorTexture.offset, "x", 0, 1).name("Offset U");
    textureFolder.add(this.contents.room.floorTexture.offset, "y", 0, 1).name("Offset V");
    textureFolder.add(this.contents.room.floorTexture, "rotation", 0, Math.PI * 2).name("Rotation");
    textureFolder.open();

  }
}

export { MyGuiInterface };