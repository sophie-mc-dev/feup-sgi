import * as THREE from "three";

import { MyAxis } from "./MyAxis.js";
import { MyRoom } from "./objects/MyRoom.js";
import { MyTable } from "./objects/MyTable.js";
import { MyPlate } from "./objects/MyPlate.js";
import { MyCake } from "./objects/MyCake.js";
import { MyCandle } from "./objects/MyCandle.js";
import { MyLights } from "./MyLights.js";
import { MyBox } from "./objects/MyBox.js";
import { MyFrame } from "./objects/MyFrame.js";
import { MyWindow } from "./objects/MyWindow.js";
import { MyBeetle } from "./objects/MyBeetle.js";
import { MyNewspaper } from "./objects/MyNewspaper.js";
import { MyDoor } from "./objects/MyDoor.js";
import { MySpring } from "./objects/MySpring.js";
import { MyVase } from "./objects/MyVase.js";
import { MyChair } from "./objects/MyChair.js";
import { MyFlower } from "./objects/MyFlower.js";

/**
 *  This class contains the contents of out application
 */
class MyContents {
  constructor(app) {
    this.app = app;
    this.axis = null;
  }

  /**
   * initializes the contents
   */
  init() {
    // create once
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    // Add lights to the scene
    this.lights = new MyLights(this.app.scene);

    // Add objects to the scene
    this.boxMesh = new MyBox(this.app.scene);
    this.app.scene.add(this.boxMesh.boxMesh);

    this.room = new MyRoom();
    this.room.buildFloor(20, 20);
    this.room.buildWalls(20, 20);
    this.app.scene.add(this.room.roomGroup);

    this.plate = new MyPlate();
    this.app.scene.add(this.plate.plateMesh);

    this.cake = new MyCake();
    this.app.scene.add(this.cake.cakeGroup);

    // Add candles
    this.candle1 = new MyCandle();
    this.app.scene.add(this.candle1.candleGroup);
    this.candle2 = new MyCandle();
    this.candle2.candleGroup.position.set(-0.08, 3.75, -0.24)
    this.app.scene.add(this.candle2.candleGroup);
    this.candle3 = new MyCandle();
    this.candle3.candleGroup.position.set(0.20, 3.75, -0.15)
    this.app.scene.add(this.candle3.candleGroup);
    this.candle4 = new MyCandle();
    this.candle4.candleGroup.position.set(0.20, 3.75, 0.15)
    this.app.scene.add(this.candle4.candleGroup);
    this.candle5 = new MyCandle();
    this.candle5.candleGroup.position.set(-0.08, 3.75, 0.24)
    this.app.scene.add(this.candle5.candleGroup);

    this.table = new MyTable();
    this.app.scene.add(this.table.tableGroup);
    this.table.tableGroup.receiveShadow = true;
    this.table.tableGroup.castShadow = true;

    // Add frames
    this.frameS = new MyFrame();
    this.frameS.addPicture("./textures/sofia.jpg");
    this.app.scene.add(this.frameS.frameGroup);

    this.frameN = new MyFrame();
    this.frameN.addPicture("./textures/nuno.jpg");
    this.frameN.frameGroup.position.set(2, 3, -9.9);
    this.app.scene.add(this.frameN.frameGroup);

    // Add windows
    this.window1 = new MyWindow();
    this.window1.addView("./textures/feup_b_1.jpeg");
    this.window1.setPosition(-9.9, 0, 3.5);

    this.window2 = new MyWindow();
    this.window2.addView("./textures/feup_b_2.jpeg");
    this.window2.setPosition(-9.9, 0, 0);

    this.window3 = new MyWindow();
    this.window3.addView("./textures/feup_b_3.jpeg");
    this.window3.setPosition(-9.9, 0, -3.5);

    this.app.scene.add(this.window1.windowGroup);
    this.app.scene.add(this.window2.windowGroup);
    this.app.scene.add(this.window3.windowGroup);

    // Add lights
    this.ambientLight = new MyLights().addAmbientLight();
    this.app.scene.add(this.ambientLight);

    this.spotLight = new MyLights().addSpotLight();
    this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight, 0.5);
    this.app.scene.add(this.spotLight);
    // this.app.scene.add(this.spotLightHelper);
    this.app.scene.add(this.spotLight.target);
    this.spotLight.castShadow = true;

    // Add frame lights
    this.frameLightS = new MyLights().addFrameLight();
    this.frameLightS.target.position.set(-2, 5, -9.9);
    this.app.scene.add(this.frameLightS);
    this.app.scene.add(this.frameLightS.target);
    this.frameLightS.castShadow = true;
    
    this.frameLightN = new MyLights().addFrameLight();
    this.frameLightN.position.set(2,14,-9);
    this.frameLightN.target.position.set(2, 5, -9.9);
    this.app.scene.add(this.frameLightN);
    this.app.scene.add(this.frameLightN.target);
    this.frameLightN.castShadow = true;
    
    // Add beetle frame
    this.beetle = new MyBeetle();
    this.app.scene.add(this.beetle.beetleGroup);

    // Add newspaper
    this.newspaper = new MyNewspaper();
    this.app.scene.add(this.newspaper.newspaperMesh);
    
    // Add door
    this.door = new MyDoor();
    this.app.scene.add(this.door.doorMesh);

    // Add spring
    this.spring = new MySpring();
    this.app.scene.add(this.spring.springMesh); 

    // Add vase
    this.vase = new MyVase();
    this.app.scene.add(this.vase.vaseGroup);

    // Add wall flower
    this.flower = new MyFlower();
    this.app.scene.add(this.flower.flowerGroup);

    // Add vase flower
    this.flower2 = new MyFlower();
    this.flower2.flowerGroup.scale.set(0.2, 0.2, 0.2);
    this.flower2.flowerGroup.position.set(-5.5, 2.35, -7.5)
    this.flower2.flowerGroup.rotateY(Math.PI/3 * 2);
    this.app.scene.add(this.flower2.flowerGroup);

    // Add chair
    this.chair = new MyChair();
    this.app.scene.add(this.chair.chairGroup);
    this.chair.chairGroup.rotateX(-Math.PI/4);  
    this.chair.chairGroup.position.set(1.5, 2, -3);  
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   *
   */
  update() {
    this.boxMesh.updateBoxIfRequired();
  }


}

export { MyContents };
