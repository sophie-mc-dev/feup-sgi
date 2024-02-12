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
    // Cameras
    const cameraFolder = this.datgui.addFolder("Camera");
    cameraFolder
      .add(this.app, "activeCameraName", this.contents.cameras.cameras)
      .name("Active Camera")
      .onChange((value) => {
        this.app.setActiveCamera(value.name);
      });
    cameraFolder.open();

    // Toggle Fog
    const fogFolder = this.datgui.addFolder("Fog");
    fogFolder
      .add(this.contents, "toggleFog")
      .name("Toggle Fog")
      .onChange((value) => {
        this.contents.toggleFog(value);
      });
    fogFolder.open();

    // Lights
    const lightsFolder = this.datgui.addFolder("Lights");

    // Iterate through the lights in the scene
    this.contents.app.scene.traverse((child) => {
      if (child instanceof THREE.Light) {
        const lightControls = lightsFolder.addFolder(child.type);

        lightControls
          .add({ visible: child.visible }, "visible")
          .name("Visibility")
          .onChange((value) => {
            child.visible = value;
          });
        lightControls.close();

        if (
          child instanceof THREE.PointLight ||
          child instanceof THREE.SpotLight ||
          child instanceof THREE.DirectionalLight
        ) {
          lightControls.addColor(child, "color").name("Color");

          if (child instanceof THREE.SpotLight) {
            lightControls.add(child, "intensity", 0, 30).name("Intensity");
            lightControls.add(child, "distance", 0, 50).name("Distance");
            lightControls.add(child, "angle", 0, Math.PI / 2).name("Angle");
            lightControls.add(child, "penumbra", 0, 1).name("Penumbra");
            lightControls.add(child, "decay", 0, 4).name("Decay");
            lightControls.add(child.position, "x", -30, 30).name("Position X");
            lightControls.add(child.position, "y", -30, 30).name("Position Y");
            lightControls.add(child.position, "z", -30, 30).name("Position Z");
          }
        }
      }
    });
    lightsFolder.open();

    // Toggle Shadows
    const shadowFolder = this.datgui.addFolder("Shadows");

    const shadowControls = {
      shadowsEnabled: true,
      toggleShadows: () => {
        this.toggleShadows(shadowControls.shadowsEnabled);
      },
    };

    shadowFolder
      .add(shadowControls, "shadowsEnabled")
      .name("Enable Shadows")
      .onChange(() => {
        shadowControls.toggleShadows();
      });
    shadowFolder.open();

    // Toggle Wireframe
    const wireframeFolder = this.datgui.addFolder("Wireframes");

    const wireframeControls = {
      enableWireframes: false,
      toggleWireframes: () => {
        this.toggleWireframes(wireframeControls.enableWireframes);
      },
    };

    wireframeFolder
      .add(wireframeControls, "enableWireframes")
      .name("Enable Wireframes")
      .onChange((value) => {
        this.toggleWireframes(value);
      });
    wireframeFolder.open();
  }

  /**
   * Function to toggle scene's objects wireframe ON/OFF
   * @param {*} enable
   */
  toggleWireframes(enable) {
    // Iterate through all children in the scene
    this.contents.app.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.wireframe = enable;
      }
    });
  }

  /**
   * Function to toggle scene's shadows ON/OFF
   * @param {*} enabled
   */
  toggleShadows(enabled) {
    // Iterate through all objects in the scene and toggle their shadows
    this.contents.app.scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.SpotLight) {
        object.castShadow = enabled;
        object.receiveShadow = enabled;
      }
    });
    // Update renderer if needed
    this.contents.app.renderer.shadowMap.enabled = enabled;
  }
}

export { MyGuiInterface };
