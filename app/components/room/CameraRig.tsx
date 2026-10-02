"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SHOTS, roomState } from "./config";

function readTourStage() {
  const tour = document.getElementById("tour");
  if (!tour) return 0;
  const rect = tour.getBoundingClientRect();
  const span = rect.height - window.innerHeight;
  const p = span > 0 ? THREE.MathUtils.clamp(-rect.top / span, 0, 1) : 0;
  return p * (SHOTS.length - 1);
}

const ease = (x: number) => x * x * (3 - 2 * x);

// Flies the camera between SHOTS as the #tour element scrolls.
export default function CameraRig({ reduced }: { reduced: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const v = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      target: new THREE.Vector3(),
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      lookAt: new THREE.Vector3(...SHOTS[0].target),
      stage: -1,
      px: 0,
      py: 0,
    }),
    []
  );

  const portrait = size.width < size.height;
  const desktop = size.width >= 900;

  // Shift the framing so the subject sits beside the text panels.
  useEffect(() => {
    const { width: w, height: h } = size;
    if (desktop) camera.setViewOffset(w, h, -w * 0.17, 0, w, h);
    else camera.setViewOffset(w, h, 0, h * 0.16, w, h);
    camera.fov = portrait ? 52 : 34;
    camera.updateProjectionMatrix();
    return () => {
      camera.clearViewOffset();
    };
  }, [camera, size, desktop, portrait]);

  useFrame((_, dt) => {
    dt = Math.min(dt, 0.1);
    const target = readTourStage();
    v.stage = v.stage < 0 || reduced ? target : v.stage + (target - v.stage) * (1 - Math.exp(-dt * 3));

    // Small screens stack text and room: intro text is on top (room pushed down),
    // later cards sit at the bottom (room pushed up).
    if (!desktop) {
      const { width: w, height: h } = size;
      const shift = THREE.MathUtils.lerp(-0.25, 0.16, THREE.MathUtils.clamp(v.stage, 0, 1));
      camera.setViewOffset(w, h, 0, h * shift, w, h);
    }
    roomState.stage = v.stage;

    const i = Math.min(Math.floor(v.stage), SHOTS.length - 2);
    const f = ease(THREE.MathUtils.clamp(v.stage - i, 0, 1));
    const A = SHOTS[i];
    const B = SHOTS[i + 1];

    v.pos.lerpVectors(v.a.set(...A.pos), v.b.set(...B.pos), f);
    v.target.lerpVectors(v.a.set(...A.target), v.b.set(...B.target), f);

    // Pull back on portrait screens so the subject fits.
    if (portrait) v.pos.sub(v.target).multiplyScalar(1.35).add(v.target);

    // Gentle parallax from the cursor.
    const p = roomState.pointer;
    v.px += ((p.active && !reduced ? p.x : 0) - v.px) * (1 - Math.exp(-dt * 3));
    v.py += ((p.active && !reduced ? p.y : 0) - v.py) * (1 - Math.exp(-dt * 3));
    v.pos.x += v.px * 0.35;
    v.pos.y += v.py * 0.2;

    camera.position.copy(v.pos);
    v.lookAt.copy(v.target);
    camera.lookAt(v.lookAt);
  });

  return null;
}
