
import * as THREE from "../node_modules/three/build/three.module.js?v=joystick-20261107e";

export function makeCharacter(name, mainColor, skin = 0xb97855) {
  const g = new THREE.Group();
  g.name = name;

  const mat = (color, roughness = 0.8) =>
    new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0
    });

  const skinMat = mat(skin);
  const clothes = mat(mainColor);
  const hairMat = mat(0x241720);
  const dark = mat(0x29232c);
  const white = mat(0xfff8ed);
  const iris = mat(0x58392e);
  const black = mat(0x171319);
  const highlight = new THREE.MeshBasicMaterial({ color: 0xffffff });

  function ball(parent, x, y, z, sx, sy, sz, material) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 24),
      material
    );
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    parent.add(mesh);
    return mesh;
  }

  function capsule(parent, x, y, z, r, length, material) {
    const mesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(r, length, 8, 16),
      material
    );
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  // SHOES
  for (const x of [-0.12, 0.12]) {
    ball(g, x, 0.075, 0.065, 0.105, 0.07, 0.17, dark);
  }

  // LEGS
  const legs = [];

  for (const x of [-0.12, 0.12]) {
    const leg = new THREE.Group();
    leg.position.set(x, 0.48, 0);
    g.add(leg);

    capsule(leg, 0, -0.13, 0, 0.075, 0.20, dark);
    ball(leg, 0, -0.28, 0, 0.073, 0.07, 0.07, dark);

    legs.push(leg);
  }

  // BODY
  const waist = new THREE.Mesh(
    new THREE.CylinderGeometry(0.19, 0.21, 0.19, 24),
    clothes
  );
  waist.position.y = 0.66;
  g.add(waist);

  const torso = capsule(g, 0, 0.96, 0, 0.22, 0.36, clothes);
  torso.scale.set(1.08, 1, 0.82);

  // NECK
  capsule(g, 0, 1.27, 0, 0.075, 0.10, skinMat);

  // HEAD
  const head = new THREE.Group();
  head.position.y = 1.34;
  g.add(head);

  ball(head, 0, 0.20, 0, 0.315, 0.36, 0.285, skinMat);

  // EARS
  for (const x of [-0.31, 0.31]) {
    ball(head, x, 0.18, 0, 0.065, 0.09, 0.055, skinMat);
  }

  // CHEEKS
  const blush = mat(0xd98578);
  ball(head, -0.19, 0.105, 0.215, 0.055, 0.035, 0.012, blush);
  ball(head, 0.19, 0.105, 0.215, 0.055, 0.035, 0.012, blush);

  // NOSE
  ball(head, 0, 0.12, 0.276, 0.043, 0.06, 0.047, skinMat);

  // LARGE EXPRESSIVE EYES
  for (const x of [-0.115, 0.115]) {
    ball(head, x, 0.245, 0.251, 0.067, 0.083, 0.035, white);
    ball(head, x, 0.24, 0.281, 0.036, 0.047, 0.018, iris);
    ball(head, x, 0.24, 0.296, 0.021, 0.031, 0.01, black);

    // Eye sparkle
    ball(head, x - 0.009, 0.258, 0.307, 0.009, 0.012, 0.006, highlight);
  }

  // EYEBROWS
  for (const x of [-0.115, 0.115]) {
    const brow = capsule(
      head,
      x,
      0.34,
      0.26,
      0.014,
      0.065,
      hairMat
    );
    brow.rotation.z = x < 0 ? -0.12 : 0.12;
  }

  // SMILE
  const smileCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.075, 0.045, 0.274),
    new THREE.Vector3(-0.035, 0.025, 0.294),
    new THREE.Vector3(0, 0.02, 0.298),
    new THREE.Vector3(0.035, 0.025, 0.294),
    new THREE.Vector3(0.075, 0.045, 0.274)
  ]);

  const smile = new THREE.Mesh(
    new THREE.TubeGeometry(smileCurve, 16, 0.007, 8, false),
    dark
  );
  head.add(smile);

  // HAIR CAP
  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.325, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.57
    ),
    hairMat
  );
  hairCap.position.set(0, 0.24, 0);
  hairCap.scale.set(1, 1.05, 1);
  head.add(hairCap);

  // FRONT HAIR LOCKS
  for (const x of [-0.20, -0.07, 0.08, 0.20]) {
    ball(
      head,
      x,
      0.38 - Math.abs(x) * 0.15,
      0.19,
      0.075,
      0.095,
      0.09,
      hairMat
    );
  }

  // SIDE HAIR
  for (const x of [-0.285, 0.285]) {
    capsule(head, x, 0.08, 0.015, 0.065, 0.22, hairMat);
  }

  // KANIKA'S LONGER HAIR
  if (name === "KANIKA") {
    for (const x of [-0.27, 0.27]) {
      capsule(head, x, -0.10, -0.015, 0.075, 0.32, hairMat);
    }
  }

  // ARMS
  const arms = [];

  for (const side of [-1, 1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.245, 1.12, 0);
    g.add(shoulder);

    capsule(
      shoulder, side * 0.025, -0.13, 0,
      0.075, 0.17, clothes
    );

    const elbow = new THREE.Group();
    elbow.position.y = -0.28;
    shoulder.add(elbow);

    capsule(elbow, 0, -0.12, 0, 0.057, 0.16, skinMat);

    ball(elbow, 0, -0.24, 0, 0.06, 0.075, 0.06, skinMat);

    arms.push({ shoulder, elbow });
  }

  // SCARF
  const scarfMat = mat(
    name === "KANIKA" ? 0xf1c76c : 0xd5b58b
  );

  const scarf = new THREE.Mesh(
    new THREE.BoxGeometry(0.11, 0.37, 0.055),
    scarfMat
  );
  scarf.position.set(0.17, 1.07, 0.20);
  scarf.rotation.z = -0.12;
  g.add(scarf);

  // CHARACTER ANIMATION DATA
  g.userData = {
    legs,
    arms,
    head,
    torso,
    phase: Math.random() * Math.PI * 2,
    previousPosition: g.position.clone()
  };

  return g;
}

export function animateCharacter(c, t, moving) {
  const d = c.userData;
  const p = d.phase;

  const actuallyMoving =
    moving &&
    c.position.distanceToSquared(d.previousPosition) > 0.000001;

  d.movingNow = actuallyMoving;
  d.previousPosition.copy(c.position);

  if (actuallyMoving) {
    const walk = t * 8 + p;

    d.legs.forEach((leg, i) => {
      leg.rotation.x =
        Math.sin(walk + i * Math.PI) * 0.48;
    });

    d.arms.forEach((arm, i) => {
      arm.shoulder.rotation.x =
        Math.sin(walk + i * Math.PI + Math.PI) * 0.38;

      arm.elbow.rotation.x = -0.12;
    });

    d.torso.position.y =
      0.96 + Math.abs(Math.sin(walk * 2)) * 0.025;

  } else {
    d.legs.forEach(leg => {
      leg.rotation.x = 0;
    });

    d.arms.forEach(arm => {
      arm.shoulder.rotation.x =
        Math.sin(t * 1.3 + p) * 0.025;

      arm.elbow.rotation.x = 0;
    });

    d.torso.position.y =
      0.96 + Math.sin(t * 1.8 + p) * 0.008;
  }

  // Gentle head movement
  d.head.rotation.y = Math.sin(t * 0.8 + p) * 0.035;
  d.head.rotation.z = Math.sin(t * 1.1 + p) * 0.018;
}
