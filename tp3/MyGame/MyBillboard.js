import * as THREE from "three";

class MyBillboard {
  constructor() {
    this.billboard = new THREE.Mesh();
    this.textureLoader = new THREE.TextureLoader();

    this.createBillboard();
  }

  createBillboard() {
    const rgbTexture = this.textureLoader.load("./MyGame/myTextures/RGB-2.png");
    const lgrayTexture = this.textureLoader.load("./MyGame/myTextures/LGray-2.png");

    const geometry = new THREE.PlaneGeometry(20, 10, 100, 100);

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        rgbTexture: { value: rgbTexture },
        lgrayTexture: { value: lgrayTexture },
      },
      vertexShader: `
              varying vec2 vUv;
              uniform sampler2D lgrayTexture;
              void main() {
                vUv = uv;
                float depth = texture2D(lgrayTexture, uv).r * 1.0;
                vec3 pos = position;
                pos.z = -depth;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `,
      fragmentShader: `
              varying vec2 vUv;
              uniform sampler2D rgbTexture;
              void main() {
                vec4 color = texture2D(rgbTexture, vUv);
                gl_FragColor = color;
              }
            `,
    });

    this.billboard = new THREE.Mesh(geometry, material);
    this.billboard.name = 'billboard';
    this.billboard.castShadow = this.billboard.receiveShadow = true;
    this.billboard.rotateY(Math.PI);
    this.billboard.position.set(-15, 10, 37);
  }
}

export { MyBillboard };
