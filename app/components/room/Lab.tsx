"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import Interactive from "./Interactive";
import { C, roomState } from "./config";
import { arenaTexture, corkTexture, fractalTexture } from "./surfaces";
import { setCursor } from "../../lib/cursor";
import { sfx } from "../../lib/sound";

// Objects for the newer projects: protein helix, swarm arena, PSO corkboard,
// software-defined radio and the fractal print.

const damp = (from: number, to: number, rate: number, dt: number) =>
  from + (to - from) * (1 - Math.exp(-rate * dt));

function useTexture(make: () => THREE.Texture) {
  const tex = useMemo(make, [make]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/** Protein secondary structure as a sculpture: helix, strand and coil beads. */
export function HelixSculpture() {
  const spin = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const speed = useRef(0.3);

  const { tube, beads } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const turns = 3.2;
    for (let i = 0; i <= 160; i++) {
      const t = i / 160;
      const a = t * turns * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * 0.15, t * 0.85, Math.sin(a) * 0.15));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.TubeGeometry(curve, 240, 0.032, 16, false);
    const beads = Array.from({ length: 18 }, (_, i) => {
      const p = curve.getPoint(i / 17);
      const kind = i < 7 ? "H" : i < 12 ? "E" : "C";
      return { p, color: kind === "H" ? C.bronze : kind === "E" ? C.sage : C.ink };
    });
    return { tube, beads };
  }, []);
  useEffect(() => () => tube.dispose(), [tube]);

  useFrame((_, dt) => {
    speed.current = damp(speed.current, hovered.current ? 2.4 : 0.3, 4, dt);
    if (spin.current) spin.current.rotation.y += speed.current * dt;
  });

  return (
    <Interactive label="Protein AI" href="/work/protein-structure" position={[-3.85, 1.0, 3.0]} lift={0.05}>
      {(h) => {
        hovered.current = h;
        return (
          <>
            <RoundedBox args={[0.42, 0.08, 0.42]} radius={0.02} position={[0, 0.04, 0]} castShadow>
              <meshPhysicalMaterial color={C.walnut} roughness={0.4} clearcoat={0.5} />
            </RoundedBox>
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
              <meshStandardMaterial color={C.ink} metalness={0.8} roughness={0.3} />
            </mesh>
            <group ref={spin} position={[0, 0.18, 0]}>
              <mesh geometry={tube} castShadow>
                <meshPhysicalMaterial color="#e8dcc6" roughness={0.15} clearcoat={1} clearcoatRoughness={0.1} />
              </mesh>
              {beads.map((b, i) => (
                <mesh key={i} position={b.p} castShadow>
                  <sphereGeometry args={[0.042, 20, 20]} />
                  <meshPhysicalMaterial color={b.color} roughness={0.2} metalness={b.color === C.bronze ? 0.6 : 0.1} clearcoat={1} />
                </mesh>
              ))}
            </group>
          </>
        );
      }}
    </Interactive>
  );
}

const ARENA = { x: -1.9, z: 2.4, half: 0.9 };
const ARENA_OBSTACLES: [number, number, number][] = [
  [-0.35, -0.25, 0.09],
  [0.38, 0.3, 0.11],
  [0.1, -0.55, 0.07],
];
const BOT_COLORS = ["#4fa8b8", "#7fa36b", "#d9a441"];

/** Three mini robots exploring a taped arena, like the SwarmBot sim. */
export function SwarmArena() {
  const mat = useTexture(arenaTexture);
  const bots = useRef<(THREE.Group | null)[]>([]);
  const lines = useRef<THREE.LineSegments>(null);
  const hovered = useRef(false);
  const t = useRef(0);
  // Dragging: which bot is held, where it is, and how much it overrides its path.
  const drag = useRef<{ index: number; x: number; z: number } | null>(null);
  const held = useRef([0, 0, 0]);
  const heldPos = useRef<[number, number][]>([[0, 0], [0, 0], [0, 0]]);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.1), []);
  const hit = useMemo(() => new THREE.Vector3(), []);

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(18), 3));
    return g;
  }, []);
  useEffect(() => () => lineGeo.dispose(), [lineGeo]);

  useFrame((_, dt) => {
    t.current += dt * (hovered.current ? 2.6 : 1);
    const pos: THREE.Vector3[] = [];
    bots.current.forEach((g, i) => {
      if (!g) return;
      const k = t.current * 0.35 + i * 2.1;
      const x = Math.sin(k * 1.3 + i) * 0.62;
      const z = Math.sin(k * 0.9 + i * 1.7) * 0.62;
      const nx = Math.sin((k + 0.02) * 1.3 + i) * 0.62;
      const nz = Math.sin((k + 0.02) * 0.9 + i * 1.7) * 0.62;
      // Blend between the autonomous path and wherever the visitor dropped it.
      const isHeld = drag.current?.index === i;
      if (isHeld) heldPos.current[i] = [drag.current!.x, drag.current!.z];
      held.current[i] = damp(held.current[i], isHeld ? 1 : 0, isHeld ? 20 : 1.2, dt);
      const w = held.current[i];
      const [hx, hz] = heldPos.current[i];
      g.position.set(x + (hx - x) * w, isHeld ? 0.08 : 0, z + (hz - z) * w);
      if (!isHeld) g.rotation.y = Math.atan2(nx - x, nz - z);
      pos.push(g.position);
    });
    const ls = lines.current;
    if (ls && pos.length === 3) {
      const arr = lineGeo.attributes.position.array as Float32Array;
      const pairs = [[0, 1], [1, 2], [2, 0]];
      pairs.forEach(([a, b], j) => {
        arr.set([pos[a].x, 0.09, pos[a].z, pos[b].x, 0.09, pos[b].z], j * 6);
      });
      lineGeo.attributes.position.needsUpdate = true;
      const m = ls.material as THREE.LineBasicMaterial;
      m.opacity = damp(m.opacity, hovered.current ? 0.9 : 0.25, 6, dt);
    }
  });

  return (
    <Interactive label="SwarmBot" href="/work/swarmbot" position={[ARENA.x, 0.045, ARENA.z]} lift={0}>
      {(h) => {
        hovered.current = h;
        return (
          <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[ARENA.half * 2, ARENA.half * 2]} />
              <meshStandardMaterial map={mat} roughness={0.85} />
            </mesh>
            {ARENA_OBSTACLES.map(([x, z, r]) => (
              <mesh key={`${x}${z}`} position={[x, 0.06, z]} castShadow>
                <cylinderGeometry args={[r, r, 0.12, 24]} />
                <meshStandardMaterial color="#8b8f98" roughness={0.6} />
              </mesh>
            ))}
            <lineSegments ref={lines} geometry={lineGeo}>
              <lineBasicMaterial color="#e3c35a" transparent opacity={0.25} />
            </lineSegments>
            {BOT_COLORS.map((col, i) => (
              <group
                key={col}
                ref={(el) => void (bots.current[i] = el)}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  (e.target as Element).setPointerCapture?.(e.pointerId);
                  drag.current = { index: i, x: bots.current[i]!.position.x, z: bots.current[i]!.position.z };
                  sfx.click();
                }}
                onPointerMove={(e) => {
                  if (drag.current?.index !== i) return;
                  e.stopPropagation();
                  if (e.ray.intersectPlane(plane, hit)) {
                    const local = e.eventObject.parent!.worldToLocal(hit.clone());
                    drag.current.x = THREE.MathUtils.clamp(local.x, -0.8, 0.8);
                    drag.current.z = THREE.MathUtils.clamp(local.z, -0.8, 0.8);
                  }
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  drag.current = null;
                }}
                onClick={(e) => e.stopPropagation()}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setCursor("scene", { variant: "label", label: "Drag me" });
                }}
              >
                <RoundedBox args={[0.14, 0.07, 0.18]} radius={0.025} position={[0, 0.06, 0]} castShadow>
                  <meshPhysicalMaterial color={col} roughness={0.3} clearcoat={0.8} />
                </RoundedBox>
                {[-0.08, 0.08].map((x) => (
                  <mesh key={x} position={[x, 0.035, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.035, 0.035, 0.03, 16]} />
                    <meshStandardMaterial color={C.ink} roughness={0.8} />
                  </mesh>
                ))}
                <mesh position={[0, 0.07, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
                  <coneGeometry args={[0.07, 0.3, 16, 1, true]} />
                  <meshBasicMaterial color={col} transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
                </mesh>
              </group>
            ))}
          </>
        );
      }}
    </Interactive>
  );
}

/** Corkboard with the PSO rescue paths pinned up. */
export function Corkboard() {
  const cork = useTexture(corkTexture);
  const pins = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  useFrame((state, dt) => {
    pins.current?.children.forEach((p, i) => {
      const hop = hovered.current ? Math.max(0, Math.sin(state.clock.elapsedTime * 8 - i)) * 0.04 : 0;
      p.position.z = damp(p.position.z, 0.06 + hop, 14, dt);
    });
  });
  return (
    <Interactive label="Adaptive PSO" href="/work/adaptive-pso" position={[3.5, 2.9, -4.17]} lift={0}>
      {(h) => {
        hovered.current = h;
        return (
          <>
            <RoundedBox args={[1.36, 1.04, 0.06]} radius={0.02} castShadow>
              <meshPhysicalMaterial color={C.walnut} roughness={0.45} clearcoat={0.4} />
            </RoundedBox>
            <mesh position={[0, 0, 0.032]}>
              <planeGeometry args={[1.26, 0.94]} />
              <meshStandardMaterial map={cork} roughness={0.95} />
            </mesh>
            <group ref={pins}>
              {[
                [-0.48, 0.34, "#d62828"],
                [0.48, 0.34, "#2f6fb5"],
                [-0.48, -0.34, "#2f6fb5"],
                [0.44, -0.38, "#d62828"],
              ].map(([x, y, col]) => (
                <mesh key={`${x}${y}`} position={[x as number, y as number, 0.06]} castShadow>
                  <sphereGeometry args={[0.028, 16, 16]} />
                  <meshPhysicalMaterial color={col as string} roughness={0.2} clearcoat={1} />
                </mesh>
              ))}
            </group>
          </>
        );
      }}
    </Interactive>
  );
}

/** HackRF-style software-defined radio broadcasting signal rings. */
export function SdrRadio() {
  const rings = useRef<THREE.Group>(null);
  const leds = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const hovered = useRef(false);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const active = hovered.current ? 1 : 0.35 + roomState.night * 0.4;
    rings.current?.children.forEach((r, i) => {
      const p = ((t * (hovered.current ? 0.9 : 0.45) + i / 3) % 1);
      r.scale.setScalar(0.2 + p * 1.4);
      (((r as THREE.Mesh).material) as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.5 * active;
    });
    leds.current.forEach((m, i) => {
      if (m) m.emissiveIntensity = Math.sin(t * (6 + i * 3)) > 0.2 ? 3 : 0.3;
    });
  });
  return (
    <Interactive label="Mission SDR" href="/work/mission-aware-sdr" position={[-3.85, 1.0, 1.85]} lift={0.05}>
      {(h) => {
        hovered.current = h;
        return (
          <>
            <RoundedBox args={[0.34, 0.08, 0.5]} radius={0.02} position={[0, 0.04, 0]} castShadow>
              <meshPhysicalMaterial color="#25282f" roughness={0.35} metalness={0.4} clearcoat={0.6} />
            </RoundedBox>
            <mesh position={[0.171, 0.04, 0]}>
              <boxGeometry args={[0.005, 0.03, 0.42]} />
              <meshStandardMaterial color={C.bronze} metalness={0.9} roughness={0.2} />
            </mesh>
            {["#ff6a3c", "#62d26f", "#f2c14e"].map((col, i) => (
              <mesh key={col} position={[0.172, 0.06, -0.12 + i * 0.06]}>
                <sphereGeometry args={[0.009, 10, 10]} />
                <meshStandardMaterial
                  ref={(el) => void (leds.current[i] = el)}
                  color={col}
                  emissive={col}
                  emissiveIntensity={1}
                  toneMapped={false}
                />
              </mesh>
            ))}
            {[-0.16, 0.16].map((z, i) => (
              <group key={z} position={[-0.08, 0.08, z]} rotation={[i ? -0.25 : 0.25, 0, 0.1]}>
                <mesh position={[0, 0.25, 0]} castShadow>
                  <cylinderGeometry args={[0.011, 0.016, 0.5, 10]} />
                  <meshStandardMaterial color={C.ink} roughness={0.4} />
                </mesh>
                <mesh position={[0, 0.51, 0]}>
                  <sphereGeometry args={[0.018, 12, 12]} />
                  <meshStandardMaterial color={C.ink} roughness={0.4} />
                </mesh>
              </group>
            ))}
            <group ref={rings} position={[-0.08, 0.55, 0]}>
              {[0, 1, 2].map((i) => (
                <mesh key={i} rotation={[0, 0, 0]}>
                  <torusGeometry args={[0.3, 0.006, 8, 48]} />
                  <meshBasicMaterial color={C.bronzeLight} transparent opacity={0} depthWrite={false} />
                </mesh>
              ))}
            </group>
          </>
        );
      }}
    </Interactive>
  );
}

/** Framed Mandelbrot print that zooms in on hover. */
export function FractalPrint() {
  const tex = useTexture(fractalTexture);
  const hovered = useRef(false);
  useFrame((_, dt) => {
    const zoom = damp(tex.repeat.x, hovered.current ? 0.45 : 1, 2.5, dt);
    tex.repeat.set(zoom, zoom);
    // Zoom toward the seahorse valley, left of the main cardioid.
    tex.offset.set((1 - zoom) * 0.42, (1 - zoom) * 0.5);
  });
  return (
    <group position={[-4.17, 3.1, 2.7]} rotation={[0, Math.PI / 2, 0]}>
      <Interactive label="FractalLab" href="/work/fractallab-flockhunt" lift={0}>
        {(h) => {
          hovered.current = h;
          return (
            <>
              <RoundedBox args={[1.42, 1.06, 0.05]} radius={0.015} castShadow>
                <meshPhysicalMaterial color={C.ink} roughness={0.35} clearcoat={0.6} />
              </RoundedBox>
              <mesh position={[0, 0, 0.027]}>
                <planeGeometry args={[1.32, 0.96]} />
                <meshStandardMaterial color="#fbf8f1" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.03]}>
                <planeGeometry args={[1.12, 0.8]} />
                <meshPhysicalMaterial map={tex} roughness={0.25} clearcoat={0.8} />
              </mesh>
            </>
          );
        }}
      </Interactive>
    </group>
  );
}
