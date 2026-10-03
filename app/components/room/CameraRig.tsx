"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SHOTS, roomState } from "./config";
import { onReady } from "../../lib/ready";
import { IMPACT } from "./GlassPane";

function readTourStage() {
  const tour = document.getElementById("tour");
  if (!tour) return 0;
  const rect = tour.getBoundingClientRect();
  const span = rect.height - window.innerHeight;
  const p = span > 0 ? THREE.MathUtils.clamp(-rect.top / span, 0, 1) : 0;
  return p * (SHOTS.length - 1);
}

const ease = (x: number) => x * x * (3 - 2 * x);

// Opening fly-through: outside behind the back wall → through the upper-left window pane
// (the glass shatters at IMPACT) → into the room → blend into the first tour shot.
const INTRO_MS = 5200;
const FLY: { t: number; pos: [number, number, number]; target: [number, number, number] }[] = [
  { t: 0, pos: [1.155, 6.4, -13], target: [1.0, 2.0, -1.2] },
  { t: IMPACT + 0.006, pos: [1.155, 3.9, -4.62], target: [0.8, 1.5, 0.6] },
  { t: 0.58, pos: [1.0, 3.25, -2.3], target: [0.4, 0.9, 2.0] },
];
const smooth = (x: number) => x * x * (3 - 2 * x);

const DEV_SHOT =
  process.env.NODE_ENV !== "production" && typeof window !== "undefined"
    ? Number(new URLSearchParams(window.location.search).get("shot") ?? -1)
    : -1;

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
      // Opening fly-through: 0 → 1 once the preloader is gone (stays 1 when skipped).
      intro: 0,
      introArmed: false,
      introElapsed: 0,
      flyPos: new THREE.Vector3(),
      flyTarget: new THREE.Vector3(),
    }),
    []
  );

  useEffect(() => {
    // Play once per browser session; returning to Home later lands directly.
    let seen = false;
    try {
      seen = sessionStorage.getItem("bp-intro") === "1";
    } catch {}
    if (reduced || seen || window.scrollY > 10 || DEV_SHOT >= 0) {
      v.intro = 1;
      roomState.intro = 1;
      return;
    }
    roomState.intro = 0;
    return onReady(() => {
      v.introArmed = true;
      try {
        sessionStorage.setItem("bp-intro", "1");
      } catch {}
    });
  }, [reduced, v]);

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
    // Dev-only: ?shot=N pins the camera to tour stop N (for checking framing).
    const pinned = DEV_SHOT >= 0 ? DEV_SHOT : null;
    const target = pinned ?? readTourStage();
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

    // Opening fly-through overrides the tour pose until it hands over at the end.
    if (v.intro < 1) {
      // Advance per rendered frame (capped), so a slow first few frames slow the
      // shot down instead of skipping straight past the glass.
      if (v.introArmed) v.introElapsed += Math.min(dt, 1 / 30) * 1000;
      v.intro = Math.min(1, v.introElapsed / INTRO_MS);
      roomState.intro = v.intro;
      const t = v.intro;
      const last = FLY[FLY.length - 1];
      if (t < last.t) {
        const k = FLY.findIndex((key, j) => j < FLY.length - 1 && t >= key.t && t < FLY[j + 1].t);
        const A = FLY[k];
        const B = FLY[k + 1];
        const u = (t - A.t) / (B.t - A.t);
        // Accelerate into the glass, then decelerate into the room.
        const e = k === 0 ? Math.pow(u, 2.2) : 1 - Math.pow(1 - u, 2);
        v.flyPos.lerpVectors(v.a.set(...A.pos), v.b.set(...B.pos), e);
        v.flyTarget.lerpVectors(v.a.set(...A.target), v.b.set(...B.target), e);
        v.pos.copy(v.flyPos);
        v.target.copy(v.flyTarget);
      } else {
        const u = smooth((t - last.t) / (1 - last.t));
        v.pos.lerpVectors(v.a.set(...last.pos), v.pos, u);
        v.target.lerpVectors(v.b.set(...last.target), v.target, u);
      }
      // A short jolt as the camera hits the glass.
      const jolt = t >= IMPACT && t < IMPACT + 0.05 ? (1 - (t - IMPACT) / 0.05) * 0.06 : 0;
      if (jolt) v.pos.add(v.a.set((Math.random() - 0.5) * jolt, (Math.random() - 0.5) * jolt, 0));
      // Keep the window centred during the fly-through; restore the side framing as it lands.
      if (desktop) {
        const { width: w, height: h } = size;
        const off = smooth(THREE.MathUtils.clamp((t - last.t) / (1 - last.t), 0, 1));
        camera.setViewOffset(w, h, -w * 0.17 * off, 0, w, h);
      }
    }

    camera.position.copy(v.pos);
    v.lookAt.copy(v.target);
    camera.lookAt(v.lookAt);
  });

  return null;
}
