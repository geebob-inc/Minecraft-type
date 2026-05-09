import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const geo = new THREE.BoxGeometry(0.8, 1.5, 0.8);
const mat = new THREE.MeshStandardMaterial({ color: 0xff4444 });

export class Mob {
  constructor(scene, x, y, z) {
    this.scene = scene;

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, y, z);

    this.dir = new THREE.Vector3(Math.random()-0.5,0,Math.random()-0.5);

    scene.add(this.mesh);
  }

  update(player) {
    const dist = this.mesh.position.distanceTo(player.position);

    if (dist < 10) {
      this.mesh.position.x += (player.position.x - this.mesh.position.x) * 0.02;
      this.mesh.position.z += (player.position.z - this.mesh.position.z) * 0.02;
    } else {
      this.wander();
    }

    if (dist < 1.5) {
      player.health -= 0.5;
    }
  }

  wander() {
    if (Math.random() < 0.02) {
      this.dir.set(Math.random()-0.5, 0, Math.random()-0.5);
    }

    this.mesh.position.addScaledVector(this.dir, 0.02);
  }
}
