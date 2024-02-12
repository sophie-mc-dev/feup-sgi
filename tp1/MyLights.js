import * as THREE from "three";

class MyLights {
  constructor() {
    this.addPointLightLight();
    this.addDirectionalLight();
    this.addSpotLight();
    this.addAmbientLight();
    this.addFrameLight();
  }

  /**
   * Function that creates a point light
   * @returns point light object
   */
  addPointLightLight() {
    this.pointLight = new THREE.PointLight(0xffffff, 500, 0);
    this.pointLight.position.set(0, 20, 0);

    return this.addPointLightLight;
  }

  /**
   * Function that creates a directional light
   * @returns directional light object
   */
  addDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight("#ffffff", 1);
    this.directionalLight.position.set(5, 10, 2);

    this.directionalLight.target.position.set(0, 2, 0);

    return this.addDirectionalLight;
  }

  /**
   * Function that creates a spot light
   * @returns spot light object
   */
  addSpotLight() {
    this.spotLight = new THREE.SpotLight("#ffffff", 10, 12, 1, 0, 0);
    this.spotLight.position.set(0, 10, 0);

    this.spotLight.target.position.set(0, 0, 0);
    
    this.spotLight.castShadow = true;

    return this.spotLight;
  }

  /**
   * Function that creates an ambient light
   * @returns ambient light object
   */
  addAmbientLight() {
    return (this.ambientLight = new THREE.AmbientLight(0x555555, 4));
  }

  /**
   * Function that creates a different spot light
   * @returns spot light for a wall frame
   */
  addFrameLight(){
    this.frameLight = new THREE.SpotLight("#ffffff", 15, 30, 0.2, 0.5, 0);
    this.frameLight.position.set(-2,14,-9);
    
    this.frameLight.target.position.set(-2, 5, -9.9);

    return this.frameLight;
  }
}

export { MyLights };