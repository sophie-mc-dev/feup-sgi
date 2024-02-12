import * as THREE from "three";

import { MyRectangle } from "./primitives/MyRectangle.js";
import { MyCylinder } from "./primitives/MyCylinder.js";
import { MyNurbs } from "./primitives/MyNurbs.js";
import { MyBox } from "./primitives/MyBox.js";
import { My3DModel } from "./primitives/My3DModel.js";
import { MySphere } from "./primitives/MySphere.js";
import { MyTriangle } from "./primitives/MyTriangle.js";
import { MyPolygon } from "./primitives/MyPolygon.js";

class MyRecursiveBuilder {
  constructor(data) {
    this.data = data;
    this.lights = data.lights;
  }

  static build(data, node, parentGroup) {
    // console.log(data);
    new MyRecursiveBuilder(data).recursiveChildrenToGroup(node, parentGroup);
  }

  /**
   * Recursive function that builds the scene graph based on various parameters retrieved
   * from iterating through the XML file nodes
   * @param {*} node
   * @param {*} parentGroup
   * @param {*} materialData
   * @param {*} texture
   * @param {*} castShadow
   * @param {*} receiveShadow
   */
  recursiveChildrenToGroup(
    node,
    parentGroup,
    materialData,
    texture,
    castShadow,
    receiveShadow
  ) {
    this.applyTransformation(node, parentGroup);

    if (!materialData) {
      materialData = this.getMaterialData(node);
      if (!texture) texture = this.getTexture(materialData);
    } else if (this.getMaterialData(node)) {
      materialData = this.getMaterialData(materialData, node);
      if (this.getTexture(materialData))
        texture = this.getTexture(materialData);
    }

    for (var id in node.children) {
      if (node.children[id].type === "node") {
        let nodeGroup = new THREE.Group();
        nodeGroup.name = node.children[id].id;
        castShadow
          ? (nodeGroup.castShadow = castShadow)
          : (nodeGroup.castShadow = node.children[id].castShadows);
        receiveShadow
          ? (nodeGroup.receiveShadow = receiveShadow)
          : (nodeGroup.receiveShadow = node.children[id].receiveShadows);
        parentGroup.add(nodeGroup);
        this.recursiveChildrenToGroup(
          node.children[id],
          nodeGroup,
          materialData,
          texture,
          nodeGroup.castShadow,
          nodeGroup.receiveShadow
        );
      } else if (node.children[id].type === "primitive") {
        this.addPrimitive(
          node.children[id],
          parentGroup,
          materialData,
          texture,
          castShadow,
          receiveShadow
        );
      } else if (
        node.children[id].type === "pointlight" ||
        node.children[id].type === "spotlight" ||
        node.children[id].type === "directionallight"
      ) {
        this.addLight(node.children[id], parentGroup);
      }
    }
  }

  /**
   * Function that creates the lights defined in the XML file and adds them to the parent group.
   * @param {*} light
   * @param {*} parentGroup
   */
  addLight(light, parentGroup) {
    const {
      type,
      color,
      intensity,
      distance,
      decay,
      castshadow,
      position,
      target,
      penumbra,
      angle,
    } = light;

    let finalLight;

    if (type === "pointlight") {
      finalLight = new THREE.PointLight(color, intensity, distance, decay);
    } else if (type === "spotlight") {
      finalLight = new THREE.SpotLight(
        color,
        intensity,
        distance,
        angle * (Math.PI / 180),
        penumbra,
        decay
      );
    } else if (type === "directionallight") {
      finalLight = new THREE.DirectionalLight(color, intensity);
    }

    if (finalLight) {
      const [px, py, pz] = position.map(parseFloat);
      finalLight.position.set(px, py, pz);
      finalLight.castShadow = castshadow;

      if (type === "spotlight" && target) {
        const [tx, ty, tz] = target.map(parseFloat);
        finalLight.target.position.set(tx, ty, tz);
        parentGroup.add(finalLight.target);
      }
      // add lights to scene lights array
      this.lights.push(finalLight);
      parentGroup.add(finalLight);
    }
  }

  /**
   * Function responsible for creating each primitive mesh with the corresponding material
   * and add it to its parent group
   * @param {*} node
   * @param {*} parentGroup
   * @param {*} materialData
   * @param {*} texture
   * @param {*} castShadow
   * @param {*} receiveShadow
   */
  addPrimitive(
    node,
    parentGroup,
    materialData,
    texture,
    castShadow,
    receiveShadow
  ) {
    const representation = node.representations[0];
    let primitive;

    switch (representation.type) {
      case "rectangle":
        primitive = MyRectangle.buildRectangle(representation);
        break;

      case "cylinder":
        primitive = MyCylinder.buildCylinder(representation);
        break;

      case "box":
        primitive = MyBox.buildBox(representation);
        break;

      case "nurbs":
        primitive = MyNurbs.buildNurbs(representation);
        break;

      case "triangle":
        primitive = MyTriangle.buildTriangle(representation);
        break;

      case "sphere":
        primitive = MySphere.buildSphere(representation);
        break;
      case "model3d":
        primitive = new My3DModel(
          representation.scene,
          representation.filepath
        );
        break;
      case "polygon":
        primitive = MyPolygon.buildPolygon(representation);
        break;
    }
    if (primitive) {
      if (materialData)
        primitive.material = this.applyMaterial(materialData, texture);
      castShadow
        ? (primitive.castShadow = castShadow)
        : (primitive.castShadow = false);
      receiveShadow
        ? (primitive.receiveShadow = receiveShadow)
        : (primitive.receiveShadow = false);
      parentGroup.add(primitive);
    }
  }

  /**
   * Function responsible for returning a material with the corresponding parameters defined in the XML file
   * @param {*} materialData
   * @param {*} texture
   * @returns
   */
  applyMaterial(materialData, texture) {
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(materialData.color),
      specular: new THREE.Color(materialData.specular),
      emissive: new THREE.Color(materialData.emissive),
      shininess: materialData.shininess,
      wireframe: materialData.wireframe,
      map: texture,
      bumpScale: materialData.bumpscale,
    });

    // bump
    const bumpId = materialData.bumpref;
    const bumpData = this.data.textures[bumpId];
    if (bumpData) {
      material.bumpMap = new THREE.TextureLoader().load(bumpData.filepath);
    }

    // specular
    const specularId = materialData.specularref;
    const specularData = this.data.textures[specularId];
    if (specularData) {
      material.specularMap = new THREE.TextureLoader().load(
        specularData.filepath
      );
    }

    // doubleside
    if (materialData.twosided === true) {
      material.side = THREE.DoubleSide;
    }

    // shading
    if (materialData.shading === "smooth") {
      material.shading = THREE.SmoothShading;
    } else if (materialData.shading === "flat") {
      material.shading = THREE.FlatShading;
    } else if (materialData.shading === "none") {
      material.shading = THREE.NoShading;
    }
    return material;
  }

  /**
   * Function responsible for applying the corresponding transformation defined in XML file for each object
   * @param {*} node
   * @param {*} nodeGroup
   */
  applyTransformation(node, nodeGroup) {
    if (node.transformations && node.transformations.length > 0) {
      let [tx, ty, tz] = [0, 0, 0];
      let [rx, ry, rz] = [0, 0, 0];
      let [sx, sy, sz] = [0, 0, 0];

      for (let i = 0; i < node.transformations.length; i++) {
        const transformation = node.transformations[i];

        // TRANSLATION
        if (transformation.type === "T") {
          const [x, y, z] = transformation.translate;
          tx += x;
          ty += y;
          tz += z;

          // ROTATION
        } else if (transformation.type === "R") {
          const [x, y, z] = transformation.rotation.map(
            (degrees) => degrees * (Math.PI / 180)
          );
          rx += x;
          ry += y;
          rz += z;

          // SCALE
        } else if (transformation.type === "S") {
          const [x, y, z] = transformation.scale;
          sx += x;
          sy += y;
          sz += z;
        }
      }
      if (sx === 0 && sy === 0 && sz === 0) {
        sx = sy = sz = 1;
      }
      nodeGroup.position.set(tx, ty, tz);
      nodeGroup.rotation.set(rx, ry, rz);
      nodeGroup.scale.set(sx, sy, sz);
    }
  }

  /**
   * Function that returns the scene's material data. All the materials defined in the XML file
   * @param {*} node
   * @returns
   */
  getMaterialData(node) {
    if (node.materialIds) {
      for (const materialId of node.materialIds) {
        const materialData = this.data.materials[materialId];
        if (materialData) {
          return materialData;
        }
      }
    }
    return null;
  }

  /**
   * Function that returns the scene's texture data. All the textures defined in the XML file
   * @param {*} materialData
   * @returns
   */
  getTexture(materialData) {
    if (materialData && materialData.textureref) {
      const textureId = materialData.textureref;

      if (this.data.textures[textureId]) {
        const textureData = this.data.textures[textureId];

        if (textureData) {
          const textureLoader = new THREE.TextureLoader();
          const fileLoader = new THREE.FileLoader();
          fileLoader.setResponseType("arraybuffer");

          const texture = textureLoader.load(
            textureData.filepath,
            undefined,
            (loadedTexture) => {
              loadedTexture.wrapS = loadedTexture.wrapT = THREE.RepeatWrapping;
              loadedTexture.repeat.set(
                materialData.texlength_s,
                materialData.texlength_t
              );
            }
          );

          // Check if mipmaps exist and load them
          if (textureData[`mipmap0`]) {
            const mipmaps = [];
            let i = 0;
            while (textureData[`mipmap${i}`]) {
              const mipmapPath = textureData[`mipmap${i}`];
              const mipmapTexture = textureLoader.load(mipmapPath);
              this.loadMipmap(mipmapTexture, i, mipmapPath);
              i++;
            }
          }

          // Set texture options
          texture.magFilter = THREE.LinearFilter;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.anisotropy = textureData.anisotropy || 1;

          return texture;
        }
      }
    }
    return null;
  }

  /**
   * load an image and create a mipmap to be added to a texture at the defined level.
   * In between, add the image some text and control squares. These items become part of the picture
   *
   * @param {*} parentTexture the texture to which the mipmap is added
   * @param {*} level the level of the mipmap
   * @param {*} path the path for the mipmap image
   */
  loadMipmap(parentTexture, level, path) {
    // load texture. On loaded call the function to create the mipmap for the specified level
    new THREE.TextureLoader().load(
      path,
      function (
        mipmapTexture // onLoad callback
      ) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.scale(1, 1);

        // const fontSize = 48
        const img = mipmapTexture.image;
        canvas.width = img.width;
        canvas.height = img.height;

        // first draw the image
        ctx.drawImage(img, 0, 0);

        // set the mipmap image in the parent texture in the appropriate level
        parentTexture.mipmaps[level] = canvas;
      },
      undefined, // onProgress callback currently not supported
      function (err) {
        console.error(
          "Unable to load the image " +
            path +
            " as mipmap level " +
            level +
            ".",
          err
        );
      }
    );
  }
}

export default MyRecursiveBuilder;
