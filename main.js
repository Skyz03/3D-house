import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);
const initialRotation = new THREE.Euler(0, 0, 0, "XYZ");
const scene = new THREE.Scene();
scene.rotation.copy(initialRotation);
const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(5, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 150;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 2.5, 0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.castShadow = true;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const loader = new GLTFLoader().setPath("public/millennium_falcon/");
loader.load(
  "scene.gltf",
  (gltf) => {
    const mesh = gltf.scene;

    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    mesh.scale.set(50, 50, 50);
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

    document.getElementById("progress-container").style.display = "none";
  },
  (xhr) => {
    document.getElementById("progress").innerHTML = `LOADING ${
      Math.max(xhr.loaded / xhr.total, 1) * 100
    }/100`;
  }
);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
