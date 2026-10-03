"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

// Real CC0 models from Poly Haven (polyhaven.com), compressed to /public/models.
// Real-world metres; the room is built at roughly 2 units per metre.

const FILES = [
  "desk_lamp_arm_01",
  "modern_arm_chair_01",
  "modern_wooden_cabinet",
  "drawer_cabinet",
  "potted_plant_02",
  "potted_plant_04",
  "book_encyclopedia_set_01",
  "alarm_clock_01",
  "ceramic_vase_01",
  "standing_picture_frame_01",
] as const;
type ModelName = (typeof FILES)[number];

const url = (name: ModelName) => `/models/${name}.glb`;

/** Loads a model once, with shadows on every mesh. */
function useModel(name: ModelName) {
  const { scene } = useGLTF(url(name));
  useMemo(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
  }, [scene]);
  return scene;
}

type Placement = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

function Model({ name, position, rotation, scale = 2 }: Placement & { name: ModelName }) {
  const scene = useModel(name);
  return <primitive object={scene} position={position} rotation={rotation} scale={scale} />;
}

export const ArmChair = (p: Placement) => <Model name="modern_arm_chair_01" {...p} />;
export const LowCabinet = (p: Placement) => <Model name="modern_wooden_cabinet" {...p} />;
export const DrawerShelf = (p: Placement) => <Model name="drawer_cabinet" {...p} />;
export const PottedPlant = (p: Placement) => <Model name="potted_plant_02" {...p} />;
export const Succulent = (p: Placement) => <Model name="potted_plant_04" {...p} />;
export const Books = (p: Placement) => <Model name="book_encyclopedia_set_01" {...p} />;
export const AlarmClock = (p: Placement) => <Model name="alarm_clock_01" {...p} />;
export const Vase = (p: Placement) => <Model name="ceramic_vase_01" {...p} />;

/**
 * Arm desk lamp. Hands its bulb material and bulb position back to the caller,
 * which drives the glow and the point light (day/night, double-click switch).
 */
export function DeskLamp({
  bulbRef,
  lightRef,
  ...p
}: Placement & {
  bulbRef: React.RefObject<THREE.MeshStandardMaterial | null>;
  lightRef: React.RefObject<THREE.PointLight | null>;
}) {
  const scene = useModel("desk_lamp_arm_01");
  const root = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    let bulbMesh: THREE.Mesh | undefined;
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && (m.material as THREE.Material).name === "desk_lamp_arm_01_light") bulbMesh = m;
    });
    if (!bulbMesh || !root.current) return;
    const mat = bulbMesh.material as THREE.MeshStandardMaterial;
    mat.emissive = new THREE.Color("#ffcf8a");
    mat.toneMapped = false;
    bulbRef.current = mat;
    // Put the point light just below the bulb.
    root.current.updateWorldMatrix(true, true);
    const center = new THREE.Box3().setFromObject(bulbMesh).getCenter(new THREE.Vector3());
    const parent = root.current.parent;
    if (parent && lightRef.current) {
      parent.worldToLocal(center);
      lightRef.current.position.copy(center).add(new THREE.Vector3(0, -0.12, 0));
    }
  }, [scene, bulbRef, lightRef]);

  return (
    <group ref={root}>
      <primitive object={scene} position={p.position} rotation={p.rotation} scale={p.scale ?? 2} />
    </group>
  );
}

/** Standing frame on the desk with Bhanu's photo as the artwork. */
export function PhotoFrame(p: Placement) {
  const scene = useModel("standing_picture_frame_01");
  const photo = useTexture("/photo/bhanu.png");

  useLayoutEffect(() => {
    // glTF UVs expect un-flipped textures. Crop the tall portrait toward the face.
    photo.flipY = false;
    photo.colorSpace = THREE.SRGBColorSpace;
    photo.repeat.set(1, 0.62);
    photo.offset.set(0, 0.06);
    photo.needsUpdate = true;
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat.name === "standing_picture_frame_01_glass") {
        // The model's transmissive glass renders opaque here; use a faint sheen instead.
        m.material = new THREE.MeshPhysicalMaterial({ transparent: true, opacity: 0.1, roughness: 0.05, clearcoat: 1, depthWrite: false });
      }
      if (mat.name === "standing_picture_frame_01_artwork") {
        mat.map = photo;
        mat.color.set("#ffffff");
        mat.needsUpdate = true;
      }
    });
  }, [scene, photo]);

  return <primitive object={scene} position={p.position} rotation={p.rotation} scale={p.scale ?? 2} />;
}

/** Start fetching every model as soon as the room code loads. */
export function preloadModels() {
  FILES.forEach((f) => useGLTF.preload(url(f)));
}
