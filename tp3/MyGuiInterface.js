import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyReader } from "./MyReader.js";
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
   * @param {MyReader} contents the contents objects
   */
  setContents(contents) {
    this.contents = contents;
  }

  /**
   * Initialize the gui interface
   */
  init() {
    // adds a folder to the gui interface for the camera
    const cameraFolder = this.datgui.addFolder("Camera");
    cameraFolder
      .add(this.app, "activeCameraName", [
        "Perspective",
        "Custom Perspective",
        "Left",
        "Right",
        "Top",
        "Front",
        "Back",
        "Parking Lot",
        "Car",
      ])
      .name("Active Camera");
    cameraFolder
      .add(this.app, "toggleOrbitControls")
      .name("Camera Controls On/Off")
      .onChange(() => {
        this.app.toggleOrbitControls();
      });
    cameraFolder.open();

    // KEYFRAME ANIMATION
    const animationFolder = this.datgui.addFolder("Animation");
    animationFolder
      .add(this.contents.myRoute, "mixerPause", true)
      .name("pause");
    animationFolder
      .add(this.contents.myRoute, "enableAnimationPosition", true)
      .name("pos. track");
    animationFolder.open();

    // Track
    const clearObjects = this.datgui.addFolder("Clear Objects");
    clearObjects
      .add(this.contents, "removeObstacles")
      .name("Remove Obstacles")
      .onChange(() => {
        this.contents.removeObstacles();
      });
    clearObjects.open();

    // Debug KeyFrames
    const routeFolder = this.datgui.addFolder("Debug KeyFrames Visibility");
    routeFolder
      .add(this.contents, "toggleKeyFramesVisibility", true)
      .name("On/Off");
    routeFolder.open();
  }
}

export { MyGuiInterface };
