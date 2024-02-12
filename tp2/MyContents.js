import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { MyFileReader } from "./parser/MyFileReader.js";
import MyRecursiveBuilder from "./MyRecursiveBuilder.js";
import MyCameras from "./MyCameras.js";

class MyContents {
  /**
    constructs the object
    @param {MyApp} app The application object
  */
  constructor(app) {
    this.app = app;
    this.axis = null;
    this.cameras = new MyCameras();
    this.skybox = null;
    this.fog = this.app.scene.fog;
    this.fogEnabled = true; // Initial fog status

    this.background = this.app.scene.background;
    this.skybox = null;

    this.reader = new MyFileReader(app, this, this.onSceneLoaded);

    this.reader.open("scenes/myScene/constructionSite.xml");
    // this.reader.open("scenes/anotherScene/demo.xml");
  }

  /**
   * initializes the contents
   */
  init() {
    if (this.axis === null) {
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }
  }

  /**
   * Called when the scene xml file load is complete
   * @param {MySceneData} data the entire scene data object
   */
  onSceneLoaded(data) {
    // Add content to scene
    this.applyBackground(data);
    this.applyAmbientLight(data);
    this.applyFog(data);
    this.applySkybox(data);
    this.addVideoAd();
    this.cameras.addCameras(data);

    // Build scene:
    MyRecursiveBuilder.build(data, data.nodes.scene, this.app.scene);
    this.applyLods(data);
  }

  /**
   * Applies Background to the scene based on the data of the XML file
   * @param {*} data 
   */
  applyBackground(data) {
    const backgroundColor = new THREE.Color(data.options.backgroundColor);
    this.background = backgroundColor;
  }

  /**
   * Applies Ambient Light to the scene based on the data of the XML file
   * @param {*} data 
   */
  applyAmbientLight(data) {
    const ambient = new THREE.AmbientLight(data.options.ambient);
    this.app.scene.add(ambient);
  }

  /**
   * Applies fog to the scene based on the data of the XML file
   * @param {*} data 
   */
  applyFog(data) {
    const { color, near, far } = data.fog;
    if (color !== undefined && near !== undefined && far !== undefined) {
      this.fog = new THREE.Fog(color, near, far);
    }
  }

  /**
   * Function used to turn the scene's fog ON/OFF
   */
  toggleFog() {
    this.fogEnabled = !this.fogEnabled;
    if (this.fogEnabled) {
      this.app.scene.fog = new THREE.Fog(
        this.fog.color,
        this.fog.near,
        this.fog.far
      );
    } else {
      this.app.scene.fog = null;
    }
  }

  /**
   * Function that adds a skybox to the scene
   * @param {*} data 
   */
  applySkybox(data) {
    const {size,center,emissive,intensity,front,back,up,down,left,right} = data.skyboxes.default;

    const textures = { front, back, up, down, right, left };
    const textureLoader = new THREE.TextureLoader();

    const materials = Object.keys(textures).map((side) => {
      const texture = textureLoader.load(textures[side]);
      return new THREE.MeshBasicMaterial({
        // emissive: new THREE.Color(emissive),
        // emissiveIntensity: intensity,
        map: texture,
        side: THREE.BackSide,
      });
    });

    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    this.skybox = new THREE.Mesh(geometry, materials);

    this.skybox.position.set(center[0], center[1], center[2]);

    this.app.scene.add(this.skybox);
  }

  /**
   * Function that adds a video texture to a specific object of the scene
   */
  addVideoAd() {
    var geometry = new THREE.PlaneGeometry(10, 5);

    const video = document.getElementById("ad");

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    const screen = new THREE.Mesh(geometry, material);
    screen.position.set(-19, 23, 13);
    screen.rotateY(Math.PI / 2);
    this.app.scene.add(screen);
  }

  /**
   * Function that iteratew through the LODs data and adds them to the scene
   * @param {*} data
   */
  applyLods(data) {
    const { lods } = data;
    // console.log(lods);

    for (var id in lods) {
      const lod = new THREE.LOD();
      for (var child in lods[id].children) {
        // console.log(lods[id].children[child]);
        const group = new THREE.Group();
        for (var i in lods[id].children[child].node.children) {
          const childNode = lods[id].children[child].node.children[i].id;
          const node = this.findNodeById(this.app.scene, childNode);
          node.visible = true;
          group.add(node.clone());
          node.visible = false;
          lod.addLevel(group, lods[id].children[child].mindist);
        }
      }
      lod.position.set(-8, 0, -3);
      this.app.scene.add(lod);
    }
  }

  findNodeById(node, id) {
    if (node.name === id) {
      return node;
    }

    for (var i in node.children) {
      const child = node.children[i];
      const foundNode = this.findNodeById(child, id);
      if (foundNode) {
        return foundNode;
      }
    }

    return null;
  }

  update() {}
}

export { MyContents };
