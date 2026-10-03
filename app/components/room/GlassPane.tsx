"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { roomState } from "./config";
import { emit } from "../../lib/events";
import { sfx } from "../../lib/sound";

/** Intro progress (0–1) at which the camera hits the glass. CameraRig uses the same value. */
export const IMPACT = 0.28;

const W = 1.78;
const H = 1.28;
// Where the camera punches through: centre of the upper-left pane (window-local).
const HIT = new THREE.Vector2(-0.445, 0.32);

type Shard = {
  geometry: THREE.BufferGeometry;
  origin: THREE.Vector3;
  velocity: THREE.Vector3;
  spin: THREE.Vector3;
};

// Jittered grid of triangles covering the pane; each flies away from the impact point.
function buildShards(): Shard[] {
  const cols = 9;
  const rows = 7;
  let seed = 11;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const pts: THREE.Vector2[][] = [];
  for (let r = 0; r <= rows; r++) {
    pts[r] = [];
    for (let c = 0; c <= cols; c++) {
      const edge = r === 0 || c === 0 || r === rows || c === cols;
      const jx = edge ? 0 : (rand() - 0.5) * 0.7;
      const jy = edge ? 0 : (rand() - 0.5) * 0.7;
      pts[r][c] = new THREE.Vector2(((c + jx) / cols - 0.5) * W, ((r + jy) / rows - 0.5) * H);
    }
  }
  const shards: Shard[] = [];
  const tri = (a: THREE.Vector2, b: THREE.Vector2, c: THREE.Vector2) => {
    const centre = new THREE.Vector2().add(a).add(b).add(c).divideScalar(3);
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([a, b, c].flatMap((p) => [p.x - centre.x, p.y - centre.y, 0]), 3)
    );
    g.computeVertexNormals();
    const away = centre.clone().sub(HIT);
    const dist = Math.max(away.length(), 0.05);
    away.normalize().multiplyScalar(0.6 + 1.4 / (1 + dist * 3));
    shards.push({
      geometry: g,
      origin: new THREE.Vector3(centre.x, centre.y, 0),
      // +z is into the room: shards blow inward, faster near the impact point.
      velocity: new THREE.Vector3(away.x, away.y + 0.6, 2.2 + 3.5 / (1 + dist * 2) + rand()),
      spin: new THREE.Vector3((rand() - 0.5) * 14, (rand() - 0.5) * 14, (rand() - 0.5) * 10),
    });
  };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tri(pts[r][c], pts[r][c + 1], pts[r + 1][c + 1]);
      tri(pts[r][c], pts[r + 1][c + 1], pts[r + 1][c]);
    }
  }
  return shards;
}

const glass = () =>
  new THREE.MeshPhysicalMaterial({
    color: "#e6eff4",
    transparent: true,
    opacity: 0.16,
    roughness: 0.04,
    metalness: 0.2,
    clearcoat: 1,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

// The window glass. When the opening fly-through reaches IMPACT it shatters into the room,
// then quietly reappears once the camera has moved on.
export default function GlassPane({ position }: { position: [number, number, number] }) {
  const shards = useMemo(buildShards, []);
  const paneMat = useMemo(glass, []);
  // Shards glint: a little emissive so they read even in the night scene.
  const shardMat = useMemo(() => {
    const m = glass();
    m.emissive = new THREE.Color("#cfe2f2");
    m.emissiveIntensity = 0.55;
    return m;
  }, []);
  const pane = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  // `t` advances per rendered frame (capped) so shards stay in step with the camera on slow devices.
  const state = useRef({ prev: roomState.intro, broken: false, t: 0 });

  useEffect(
    () => () => {
      shards.forEach((s) => s.geometry.dispose());
      paneMat.dispose();
      shardMat.dispose();
    },
    [shards, paneMat, shardMat]
  );

  useFrame((_, delta) => {
    const st = state.current;
    if (!st.broken && st.prev < IMPACT && roomState.intro >= IMPACT) {
      st.broken = true;
      st.t = 0;
      emit("glass-break", undefined);
      sfx.shatter();
    }
    st.prev = roomState.intro;
    if (!st.broken || !group.current || !pane.current) return;

    st.t += Math.min(delta, 1 / 30);
    const t = st.t;
    const flying = t < 3;
    group.current.visible = flying;
    if (flying) {
      group.current.children.forEach((child, i) => {
        const s = shards[i];
        child.position.set(
          s.origin.x + s.velocity.x * t,
          s.origin.y + s.velocity.y * t - 4.5 * t * t,
          s.origin.z + s.velocity.z * t
        );
        child.rotation.set(s.spin.x * t, s.spin.y * t, s.spin.z * t);
      });
      shardMat.opacity = 0.75 * Math.max(0, 1 - Math.max(0, t - 0.6) / 2);
    }
    // Glass "repairs" itself after the camera has left the window.
    pane.current.visible = t > 6;
    paneMat.opacity = 0.16 * THREE.MathUtils.clamp((t - 6) / 1.5, 0, 1);
  });

  return (
    <group position={position}>
      <mesh ref={pane} material={paneMat}>
        <planeGeometry args={[W, H]} />
      </mesh>
      <group ref={group} visible={false}>
        {shards.map((s, i) => (
          <mesh key={i} geometry={s.geometry} material={shardMat} position={s.origin} />
        ))}
      </group>
    </group>
  );
}
