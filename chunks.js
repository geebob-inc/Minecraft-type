import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshStandardMaterial({ color: 0x55aa55 });

function noise(x, z) {
  return Math.sin(x * 12.9898 + z * 78.233) * 43758.5453 % 1;
}

export class Chunk {
  constructor(cx, cz) {
    this.cx = cx;
    this.cz = cz;

    this.blocks = [];
    this.mesh = new THREE.Group();
  }

  build() {
    const size = 16;

    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {

        const worldX = this.cx * size + x;
        const worldZ = this.cz * size + z;

        const height = Math.floor(Math.abs(noise(worldX, worldZ)) * 8) + 4;

        for (let y = 0; y < height; y++) {
          const block = new THREE.Mesh(geo, mat);

          block.position.set(worldX, y, worldZ);

          this.mesh.add(block);
          this.blocks.push(block);
        }
      }
    }
  }

  removeBlock(block) {
    this.mesh.remove(block);
    this.blocks = this.blocks.filter(b => b !== block);
  }

  addBlock(pos) {
    const block = new THREE.Mesh(geo, mat);
    block.position.copy(pos);

    this.mesh.add(block);
    this.blocks.push(block);
  }
}
