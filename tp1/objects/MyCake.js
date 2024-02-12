import * as THREE from "three";

class MyCake {

  constructor() {
    this.cakeGroup = new THREE.Group();
    this.buildCake();
  }

  buildCake() {
    const bottomCakeGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32, 1, false, 0);
    const middleCakeGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32, 1, false, 0);
    const topCakeGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 32, 1, false, 0, 4.72);

    const innerCakeGeometry = new THREE.PlaneGeometry(0.4, 0.2, 1);
    const innerCakeMaterial = new THREE.MeshBasicMaterial( { 
      map: new THREE.TextureLoader().load("./textures/choco-tex.jpeg"),
      side: THREE.DoubleSide,
    })

    // decorate the cakes with different material
    const middleTexture = new THREE.TextureLoader().load("./textures/cake-tex.jpeg");
    middleTexture.wrapS = THREE.RepeatWrapping;
    middleTexture.wrapT = THREE.RepeatWrapping;
    middleTexture.repeat.set(2 * Math.PI * 0.4 , 0.2);
    
    const bottomCakeMaterial = [
      new THREE.MeshBasicMaterial( { map: middleTexture } ), //meio
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("./textures/cakeTop-tex.jpeg")} ), //cima
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("./textures/cake-tex.jpeg") } ) // baixo
    ];
    const middleCakeMaterial = [
      new THREE.MeshBasicMaterial( { map: middleTexture } ), //meio
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("./textures/cakeTop-tex.jpeg")} ), //cima
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("./textures/cake-tex.jpeg") } ) // baixo
    ];
    const topCakeMaterial = [
      new THREE.MeshBasicMaterial( { map: middleTexture } ), //meio
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("./textures/cakeTop-tex.jpeg")} ), //cima
      new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load("./textures/cake-tex.jpeg") } ) // baixo
    ];

    // create cake meshes
    const bottomCake = new THREE.Mesh(bottomCakeGeometry, bottomCakeMaterial);
    bottomCake.position.set(0, 0, 0)
    bottomCake.castShadow = true;
    bottomCake.receiveShadow = true;
    
    const middleCake = new THREE.Mesh(middleCakeGeometry, middleCakeMaterial);
    middleCake.position.set(0, 0.3, 0)
    middleCake.castShadow = true;
    middleCake.receiveShadow = true;
    
    const topCake = new THREE.Mesh(topCakeGeometry, topCakeMaterial);
    topCake.position.set(0, 0.5, 0)
    topCake.castShadow = true;
    topCake.receiveShadow = true;

    // Inner cake slice 1
    const innerCake1 = new THREE.Mesh(innerCakeGeometry, innerCakeMaterial);
    innerCake1.position.set(0, 0.5, 0);

    // Inner cake slice 2
    const innerCake2 = new THREE.Mesh(innerCakeGeometry, innerCakeMaterial);
    innerCake2.position.set(0, 0.5, 0);
    innerCake2.rotateY(Math.PI / 2);

    this.cakeGroup.add(bottomCake, middleCake, topCake, innerCake1, innerCake2); // add inner cake in the right position
    this.cakeGroup.position.set(0, 3.25, 0);

  }
}

export { MyCake };
