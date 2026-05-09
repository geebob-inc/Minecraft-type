import { Chunk } from "./chunks.js";

export class World {
  constructor(scene) {
    this.scene = scene;

    this.chunks = new Map(); // chunk storage
    this.chunkSize = 16;
    this.renderDistance = 2;
  }

  /* =======================
     INITIAL WORLD
  ======================= */
  generateInitial() {
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        this.loadChunk(x, z);
      }
    }
  }

  /* =======================
     CHUNK LOADING (STREAMING READY)
  ======================= */
  loadChunk(x, z) {
    const key = `${x},${z}`;

    if (this.chunks.has(key)) return;

    const chunk = new Chunk(x, z);
    chunk.build();

    this.scene.add(chunk.mesh);
    this.chunks.set(key, chunk);
  }

  unloadChunk(x, z) {
    const key = `${x},${z}`;
    const chunk = this.chunks.get(key);

    if (!chunk) return;

    this.scene.remove(chunk.mesh);
    this.chunks.delete(key);
  }

  /* =======================
     UPDATE (INFINITE WORLD HOOK)
  ======================= */
  update(playerPos) {
    const px = Math.floor(playerPos.x / this.chunkSize);
    const pz = Math.floor(playerPos.z / this.chunkSize);

    for (let x = px - this.renderDistance; x <= px + this.renderDistance; x++) {
      for (let z = pz - this.renderDistance; z <= pz + this.renderDistance; z++) {
        this.loadChunk(x, z);
      }
    }
  }

  /* =======================
     BLOCK EDITING
  ======================= */
  breakBlock(raycaster) {
    for (let chunk of this.chunks.values()) {
      const hits = raycaster.intersectObjects(chunk.blocks);
      if (hits.length) {
        const b = hits[0].object;
        chunk.removeBlock(b);
        break;
      }
    }
  }

  placeBlock(raycaster) {
    for (let chunk of this.chunks.values()) {
      const hits = raycaster.intersectObjects(chunk.blocks);
      if (hits.length) {
        const hit = hits[0];
        chunk.addBlock(hit.object.position.clone().add(hit.face.normal));
        break;
      }
    }
  }
}
