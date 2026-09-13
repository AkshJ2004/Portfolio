import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { createGlasses } from "./glasses";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            (window as any).__character = character;
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;

                const name = (child.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");

                // Ensure each mesh has its own unique cloned material
                if (child.material) {
                  child.material = child.material.clone();
                }

                // 1. Skin: Warm tan/olive complexion matching the user photo
                if (
                  name.includes("plane007") ||
                  name.includes("face") ||
                  name.includes("neck") ||
                  name.includes("ear") ||
                  name.includes("hand") ||
                  name.includes("mesh002") ||
                  name.includes("plane005") ||
                  name.includes("plane003")
                ) {
                  child.material.color = new THREE.Color("#c89874");
                  child.material.roughness = 0.6;
                  child.material.metalness = 0.02;
                  child.material.needsUpdate = true;
                }

                // 2. Hair: Jet black matching the user photo
                if (name.includes("hair") || name.includes("pcube3004")) {
                  child.material.color = new THREE.Color("#111113");
                  child.material.roughness = 0.45;
                  child.material.metalness = 0.08;
                  child.material.needsUpdate = true;
                }

                // 3. Eyebrows: Deep matte black
                if (
                  name.includes("eyebrow") ||
                  name.includes("brow") ||
                  name.includes("plane004") ||
                  (child.material?.name && child.material.name.toLowerCase().includes("014")) ||
                  (child.material?.name && child.material.name.toLowerCase().includes("eyebrow"))
                ) {
                  if (child.geometry?.attributes?.color) {
                    child.geometry.deleteAttribute("color");
                  }
                  if (child.material.map) {
                    child.material.map = null;
                  }
                  if (child.material.emissive) {
                    child.material.emissive = new THREE.Color("#000000");
                    child.material.emissiveIntensity = 0;
                  }
                  child.material.color = new THREE.Color("#111113");
                  child.material.roughness = 0.5;
                  child.material.metalness = 0.05;
                  child.material.vertexColors = false;
                  child.material.needsUpdate = true;
                }

                // 4. Eyes: Crisp natural white sclera + warm espresso brown iris (exclude eyebrows!)
                if (
                  (name.includes("eye") && !name.includes("brow") && !name.includes("plane004")) ||
                  name.includes("sphere002")
                ) {
                  child.material.color = new THREE.Color("#ffffff");
                  child.material.roughness = 0.08;
                  child.material.metalness = 0.0;
                  child.material.needsUpdate = true;

                  if (child.material.map && child.material.map.image) {
                    const img = child.material.map.image;
                    try {
                      const canvas = document.createElement("canvas");
                      canvas.width = img.width || 1024;
                      canvas.height = img.height || 1024;
                      const ctx = canvas.getContext("2d");
                      if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const d = imgData.data;
                        for (let i = 0; i < d.length; i += 4) {
                          const r = d[i];
                          const g = d[i + 1];
                          const b = d[i + 2];
                          // Detect purple iris pixels and replace with natural warm espresso brown
                          if (b > g * 1.25 && r > g * 1.1 && r + g + b > 50 && r + g + b < 640) {
                            const val = Math.max(r, b) / 255;
                            d[i] = Math.min(255, Math.round(95 * val + 25));
                            d[i + 1] = Math.min(255, Math.round(55 * val + 12));
                            d[i + 2] = Math.min(255, Math.round(22 * val + 5));
                          }
                        }
                        ctx.putImageData(imgData, 0, 0);
                        const newTex = new THREE.CanvasTexture(canvas);
                        newTex.flipY = child.material.map.flipY;
                        newTex.needsUpdate = true;
                        child.material.map = newTex;
                        child.material.needsUpdate = true;
                      }
                    } catch (e) {
                      console.warn("Eye canvas processing error:", e);
                    }
                  }
                }

                // 5. Shirt: Dark charcoal / black crew-neck sweatshirt matching user photo
                if (name.includes("shirt") || name.includes("bodyshirt")) {
                  child.material.color = new THREE.Color("#1a1b1f");
                  child.material.roughness = 0.85;
                  child.material.metalness = 0.02;
                  child.material.needsUpdate = true;
                }

                // 6. Pants: Dark streetwear pants
                if (name.includes("pant") || (name.includes("cube004") && !name.includes("pcube"))) {
                  child.material.color = new THREE.Color("#141518");
                  child.material.roughness = 0.8;
                  child.material.needsUpdate = true;
                }

                // 7. Shoes: Dark sneakers with clean sole
                if (name.includes("shoe") || name.includes("cylinder005")) {
                  child.material.color = new THREE.Color("#18191d");
                  child.material.roughness = 0.6;
                  child.material.needsUpdate = true;
                }
                if (name.includes("sole") || name.includes("cylinder008")) {
                  child.material.color = new THREE.Color("#e5ece6");
                  child.material.roughness = 0.5;
                  child.material.needsUpdate = true;
                }
              }
            });

            await renderer.compileAsync(character, camera, scene);
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();

            // Attach black spectacles to head bone so they animate naturally with character head movement
            const headBone =
              character.getObjectByName("spine006") ||
              character.getObjectByName("spine.006");
            if (headBone) {
              const glasses = createGlasses();
              glasses.position.set(0, 1.28, 1.08);
              glasses.rotation.x = -0.04;
              headBone.add(glasses);
            }

            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
