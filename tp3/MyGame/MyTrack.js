import * as THREE from "three";

/**
 * Contains the track route; the respective track axis is defined by a Catmull-Rom curve (interrupted line in figure 1)
 * of which the first and last points are automatically joined by a straight line segment; the first point on the curve
 * must be interpreted as the starting/goal point; the width of the track is constant throughout the route.
 */
class MyTrack {
  constructor() {
    //Curve related attributes
    this.segments = 100;
    this.width = 2;
    this.textureRepeat = 1;
    this.showWireframe = true;
    this.showMesh = true;
    this.showLine = true;
    this.closedCurve = false;
    this.cooldown = false;
    this.firstLap = true; 

    this.path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(5, 0, 8), // FINISH LINE
      new THREE.Vector3(-15, 0, 5),
      new THREE.Vector3(-15, 0, 0),
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(0, 0, -5),
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(5, 0, -10),
      new THREE.Vector3(5, 0, -5),
      new THREE.Vector3(3, 0, 0),
      new THREE.Vector3(10, 0, 0),
      new THREE.Vector3(10, 0, -5),
      new THREE.Vector3(15, 0, -10),
      new THREE.Vector3(5, 0, -15),
      new THREE.Vector3(5, 0, -20),
      new THREE.Vector3(10, 0, -20),
      new THREE.Vector3(15, 0, -20),
      new THREE.Vector3(20, 0, -15),
      new THREE.Vector3(20, 0, -10),
      new THREE.Vector3(16, 0, -5),
      new THREE.Vector3(16, 0, 0),
      new THREE.Vector3(20, 0, 5),
      new THREE.Vector3(15, 0, 10),
      new THREE.Vector3(5, 0, 8),
    ]);

    this.track = new THREE.Group();
    this.track.name = 'track';

    this.init();
  }

  init() {
    this.buildTrackPlatform();
    this.buildFinishLine();
    this.createCurveObjects();
    this.createCollisionSphere();
  }

  scalePoints(scaleFactor) {
    this.path.points.forEach((point) => {
      point.multiplyScalar(scaleFactor);
    });
  }

  createCurveObjects() {
    let geometry = new THREE.TubeGeometry(
      this.path,
      this.segments,
      this.width,
      3,
      this.closedCurve
    );
    let texture = new THREE.TextureLoader().load(
      "./myGame/myTextures/curb.jpg"
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(60, 3.4);
    texture.offset.set(0, 0.315);
    let material = new THREE.MeshBasicMaterial({
      map: texture,
    });

    this.mesh = new THREE.Mesh(geometry, material);

    this.wireframe = new THREE.Mesh(geometry, material);
    let points = this.path.getPoints(this.segments);
    let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

    // Create the final object to add to the scene
    this.line = new THREE.Line(bGeometry, material);
    this.curve = new THREE.Group();

    this.mesh.visible = this.showMesh;
    this.wireframe.visible = this.showWireframe;
    this.line.visible = this.showLine;

    this.curve.add(this.mesh);
    this.curve.add(this.wireframe);
    this.curve.add(this.line);

    // this.curve.rotateZ(Math.PI);
    this.curve.scale.set(1, 0.05, 1);

    this.track.add(this.curve);
    this.track.scale.set(2,2,2);
    this.scalePoints(2)
    this.width *= 2;
  }

  buildFinishLine() {
    // TEXTURE
    const texture = new THREE.TextureLoader().load(
      "./myGame/myTextures/finishingLine.jpg"
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(0.5, 3);

    // MESH
    const geometry = new THREE.PlaneGeometry(0.5, 2.3);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const finishLine = new THREE.Mesh(geometry, material);

    // SET ATTRIBUTES
    finishLine.position.set(5, 0.1, 8);
    finishLine.rotateX(Math.PI / 2);
    finishLine.rotateZ(0.15);
    finishLine.name = "finishLine";

    // ADD TO TRACK
    this.track.add(finishLine);
  }

  buildTrackPlatform() {
    // TEXTURE
    const texture = new THREE.TextureLoader().load(
      "./myGame/myTextures/grass.jpg"
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2000, 2000);

    // MESH
    const geometry = new THREE.BoxGeometry(250, 250, 1);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);

    // SET ATTRIBUTES
    plane.rotateX(Math.PI / 2);
    plane.position.y = -0.5;
    plane.castShadow = plane.receiveShadow = true;

    // ADD TO TRACK
    this.track.add(plane);
    this.track.castShadow = this.track.receiveShadow = true;
  }

  createCollisionSphere() {
    this.collisionSphere = new THREE.Sphere(this.track.children[1].position.clone().multiplyScalar(2), 2);
  }

  completeLap(myHud) {
    if (this.cooldown) {
      return;
    }
    if (this.firstLap) {
      this.firstLap = false;
    }
    else {
      myHud.lapsCompleted++;
      console.log("Lap completed!");
    }
    this.cooldown = true;

    setTimeout(() => {
      this.cooldown = false;
    }, 10000);
  
  }

}

export { MyTrack };
