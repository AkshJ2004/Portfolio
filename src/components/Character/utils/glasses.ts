import * as THREE from "three";

export function createGlasses(): THREE.Group {
  const glasses = new THREE.Group();
  glasses.name = "black_spectacles";

  // Sleek black acetate frame material
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0c0c0e"),
    roughness: 0.35,
    metalness: 0.15,
  });

  // Subtle realistic reflective lens material
  const lensMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#e8f4f8"),
    transparent: true,
    opacity: 0.25,
    roughness: 0.05,
    transmission: 0.9,
    reflectivity: 0.7,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const eyeDistance = 0.44; // Half-distance between left and right eye centers
  const rimRadius = 0.27;   // Size of lens
  const rimThickness = 0.034;

  // Left & Right Rims (stylish rounded rectangle / torus)
  [-eyeDistance, eyeDistance].forEach((x) => {
    // Outer Rim
    const rimGeom = new THREE.TorusGeometry(rimRadius, rimThickness, 16, 36);
    const rimMesh = new THREE.Mesh(rimGeom, frameMaterial);
    rimMesh.position.set(x, 0, 0);
    rimMesh.scale.set(1.15, 0.95, 1);
    glasses.add(rimMesh);

    // Lens
    const lensGeom = new THREE.CylinderGeometry(rimRadius * 1.05, rimRadius * 1.05, 0.006, 32);
    const lensMesh = new THREE.Mesh(lensGeom, lensMaterial);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.scale.set(1.15, 1, 0.95);
    lensMesh.position.set(x, 0, 0);
    glasses.add(lensMesh);
  });

  // Nose Bridge connecting the two rims
  const bridgeGeom = new THREE.CylinderGeometry(0.024, 0.024, eyeDistance * 0.9, 16);
  const bridgeMesh = new THREE.Mesh(bridgeGeom, frameMaterial);
  bridgeMesh.rotation.z = Math.PI / 2;
  bridgeMesh.position.set(0, 0.06, 0.02);
  glasses.add(bridgeMesh);

  // Left and Right Temples (arms extending back towards the ears)
  const templeGeom = new THREE.CylinderGeometry(0.02, 0.016, 1.2, 16);
  [-1, 1].forEach((side) => {
    const temple = new THREE.Mesh(templeGeom, frameMaterial);
    temple.rotation.x = Math.PI / 2;
    temple.position.set(side * (eyeDistance + rimRadius * 1.08), 0.03, -0.6);
    glasses.add(temple);
  });

  return glasses;
}
