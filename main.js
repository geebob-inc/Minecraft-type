import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/PointerLockControls.js";
import { World } from "./world.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener("click", () => controls.lock());
scene.add(controls.getObject());

camera.position.y = 2;

scene.add(new THREE.HemisphereLight(0xffffff, 0x444444));

/* =======================
   WORLD
======================= */
const world = new World(scene);
world.generateInitial();

/* =======================
   INPUT
======================= */
const keys = {};
addEventListener("keydown", e => keys[e.code] = true);
addEventListener("keyup", e => keys[e.code] = false);

/* =======================
   MOVEMENT
======================= */
function updatePlayer() {
  const speed = 0.12;

  if (keys["KeyW"]) controls.moveForward(speed);
  if (keys["KeyS"]) controls.moveForward(-speed);
  if (keys["KeyA"]) controls.moveRight(-speed);
  if (keys["KeyD"]) controls.moveRight(speed);
}

/* =======================
   RAYCAST (BLOCK EDITS)
======================= */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  world.breakBlock(raycaster);
});

addEventListener("contextmenu", e => {
  e.preventDefault();
  raycaster.setFromCamera(mouse, camera);
  world.placeBlock(raycaster);
});

/* =======================
   LOOP
======================= */
function animate() {
  requestAnimationFrame(animate);

  updatePlayer();

  world.update(camera.position);

  renderer.render(scene, camera);
}
animate();
