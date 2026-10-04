"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import Interactive from "./Interactive";
import { AlarmClock, Books, PhotoFrame } from "./Models";
import { C } from "./config";
import { BOARD_NODES, laptopScreenTexture, whiteboardTexture } from "./textures";
import { certificates } from "../../lib/site";
import { setCursor } from "../../lib/cursor";
import { emit } from "../../lib/events";
import { sfx } from "../../lib/sound";

const damp = (from: number, to: number, rate: number, dt: number) =>
  from + (to - from) * (1 - Math.exp(-rate * dt));

export function Laptop() {
  const texture = useMemo(() => laptopScreenTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  const lid = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const hoveredRef = useRef(false);

  useFrame((_, dt) => {
    if (lid.current) lid.current.rotation.x = damp(lid.current.rotation.x, hoveredRef.current ? -0.42 : -0.22, 8, dt);
    if (screen.current) {
      const target = hoveredRef.current ? 1.25 : 1;
      screen.current.color.setScalar(damp(screen.current.color.r, target, 8, dt));
    }
  });

  return (
    <Interactive label="VaultSphere" href="/work/vaultsphere" position={[0.3, 1.55, -3.3]} rotation={[0, -0.12, 0]}>
      {(hovered) => {
        hoveredRef.current = hovered;
        return (
          <>
            <RoundedBox args={[1.2, 0.05, 0.8]} radius={0.02} smoothness={4} position={[0, 0.025, 0]} castShadow>
              <meshPhysicalMaterial color={C.metal} metalness={0.85} roughness={0.28} clearcoat={0.3} />
            </RoundedBox>
            <mesh position={[0, 0.052, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.0, 0.4]} />
              <meshStandardMaterial color="#2a2d33" metalness={0.3} roughness={0.6} />
            </mesh>
            <group ref={lid} position={[0, 0.05, -0.4]} rotation={[-0.22, 0, 0]}>
              <RoundedBox args={[1.2, 0.78, 0.035]} radius={0.015} smoothness={4} position={[0, 0.39, 0]} castShadow>
                <meshPhysicalMaterial color={C.metal} metalness={0.85} roughness={0.28} clearcoat={0.3} />
              </RoundedBox>
              <mesh position={[0, 0.39, 0.0185]}>
                <planeGeometry args={[1.16, 0.74]} />
                <meshStandardMaterial color="#0d0e11" roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.39, 0.019]}>
                <planeGeometry args={[1.1, 0.68]} />
                <meshBasicMaterial ref={screen} map={texture} toneMapped={false} />
              </mesh>
              <mesh position={[0, 0.39, 0.021]}>
                <planeGeometry args={[1.1, 0.68]} />
                <meshPhysicalMaterial transparent opacity={0.12} roughness={0.05} clearcoat={1} color="#ffffff" />
              </mesh>
            </group>
          </>
        );
      }}
    </Interactive>
  );
}

export function InboxTray() {
  const envelopes = useRef<THREE.Group>(null);
  const hoveredRef = useRef(false);

  useFrame((state, dt) => {
    const g = envelopes.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const fan = hoveredRef.current ? i * 0.07 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.01 : 0;
      child.position.y = damp(child.position.y, 0.05 + i * 0.022 + fan, 10, dt);
      child.rotation.z = damp(child.rotation.z, hoveredRef.current ? (i - 1.5) * 0.06 : 0, 10, dt);
    });
  });

  const jitter = [0.08, -0.06, 0.12, -0.03];

  return (
    <Interactive label="Complaints AI" href="/work/complaint-intelligence" position={[-0.7, 1.55, -3.2]} rotation={[0, 0.2, 0]}>
      {(hovered) => {
        hoveredRef.current = hovered;
        return (
          <>
            <RoundedBox args={[0.78, 0.04, 0.56]} radius={0.01} position={[0, 0.02, 0]} castShadow>
              <meshPhysicalMaterial color={C.ink} metalness={0.6} roughness={0.3} clearcoat={0.5} />
            </RoundedBox>
            <mesh position={[0, 0.07, -0.27]}>
              <boxGeometry args={[0.78, 0.1, 0.02]} />
              <meshStandardMaterial color={C.ink} metalness={0.3} roughness={0.4} />
            </mesh>
            <group ref={envelopes}>
              {jitter.map((r, i) => (
                <group key={i} rotation={[0, r, 0]}>
                  <mesh castShadow>
                    <boxGeometry args={[0.62, 0.012, 0.42]} />
                    <meshStandardMaterial color={i % 2 ? C.paper : "#efe2cb"} roughness={0.9} />
                  </mesh>
                  {i === jitter.length - 1 && (
                    <mesh position={[0, 0.008, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
                      <circleGeometry args={[0.05, 24]} />
                      <meshStandardMaterial color={C.bronze} />
                    </mesh>
                  )}
                </group>
              ))}
            </group>
          </>
        );
      }}
    </Interactive>
  );
}

export function Whiteboard() {
  const texture = useMemo(() => whiteboardTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  const nodes = useRef<THREE.Group>(null);
  const hoveredRef = useRef(false);
  const W = 2.2;
  const H = 1.42;

  // Message passing: a pulse travels outward from the hub when hovered.
  useFrame((state, dt) => {
    const g = nodes.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const phase = i === 0 ? 0 : 1;
      const pulse = hoveredRef.current ? Math.max(0, Math.sin(t * 5 - phase * 1.4)) : 0;
      const s = damp(mesh.scale.x, 1 + pulse * 0.6, 12, dt);
      mesh.scale.setScalar(s);
      mat.emissiveIntensity = damp(mat.emissiveIntensity, pulse * 1.5, 12, dt);
    });
  });

  return (
    <Interactive label="GNN-RL" href="/work/gnn-rl-scheduling" position={[-2.6, 2.85, -4.17]} lift={0}>
      {(hovered) => {
        hoveredRef.current = hovered;
        return (
          <>
            <mesh castShadow>
              <boxGeometry args={[W + 0.1, H + 0.1, 0.05]} />
              <meshStandardMaterial color={C.metal} metalness={0.6} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0, 0.028]}>
              <planeGeometry args={[W, H]} />
              <meshStandardMaterial map={texture} roughness={0.4} />
            </mesh>
            <mesh position={[0, -H / 2 - 0.08, 0.08]} castShadow>
              <boxGeometry args={[W * 0.8, 0.04, 0.12]} />
              <meshStandardMaterial color={C.metal} metalness={0.6} roughness={0.35} />
            </mesh>
            <group ref={nodes}>
              {BOARD_NODES.map(([u, v], i) => (
                <mesh key={i} position={[(u - 0.5) * W, (0.5 - v) * H, 0.05]}>
                  <sphereGeometry args={[i === 0 ? 0.075 : 0.05, 24, 24]} />
                  <meshStandardMaterial
                    color={i === 0 ? C.bronze : C.paper}
                    emissive={C.bronzeLight}
                    emissiveIntensity={0}
                    roughness={0.4}
                  />
                </mesh>
              ))}
            </group>
          </>
        );
      }}
    </Interactive>
  );
}

export function CertWall() {
  const textures = useTexture(certificates.map((c) => c.preview), (loaded) => {
    (Array.isArray(loaded) ? loaded : [loaded]).forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    });
  });

  return (
    <group position={[-4.17, 2.75, 0]} rotation={[0, Math.PI / 2, 0]}>
      {certificates.map((cert, i) => (
        <Interactive key={cert.title} label={cert.issuer} href="/about" position={[1.6 - i * 1.38, 0, 0]} lift={0.04}>
          {(hovered) => (
            <group rotation={[0, 0, hovered ? -0.03 : 0]}>
              <mesh castShadow>
                <boxGeometry args={[1.32, 0.96, 0.05]} />
                <meshPhysicalMaterial color={hovered ? C.bronze : C.ink} roughness={0.35} metalness={hovered ? 0.6 : 0.1} clearcoat={0.6} />
              </mesh>
              <mesh position={[0, 0, 0.027]}>
                <planeGeometry args={[1.22, 0.86]} />
                <meshStandardMaterial color="#fbfaf6" />
              </mesh>
              <mesh position={[0, 0, 0.03]}>
                <planeGeometry args={[1.08, 0.76]} />
                <meshPhysicalMaterial map={textures[i]} roughness={0.3} clearcoat={1} clearcoatRoughness={0.05} />
              </mesh>
            </group>
          )}
        </Interactive>
      ))}
    </group>
  );
}

/** Click the mug: it tips over, rolls, and stands itself back up. */
function Mug() {
  const g = useRef<THREE.Group>(null);
  const knocked = useRef(-10);
  const request = useRef(false);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (request.current) {
      request.current = false;
      if (t - knocked.current > 3.2) knocked.current = t;
    }
    const k = t - knocked.current;
    const m = g.current;
    if (!m) return;
    if (k < 0.35) {
      // Tip over around the bottom edge.
      const p = THREE.MathUtils.smootherstep(k / 0.35, 0, 1);
      m.rotation.z = -p * (Math.PI / 2);
      m.position.set(0.085 * p, 0.085 * p * 0.2, 0);
    } else if (k < 1.6) {
      // Roll toward the desk edge and settle with damped oscillation.
      const p = (k - 0.35) / 1.25;
      m.rotation.z = -Math.PI / 2;
      m.rotation.x = Math.sin(p * Math.PI * 3) * 0.25 * (1 - p);
      m.position.set(0.085 + Math.sin(p * Math.PI * 0.5) * 0.12, 0.002, Math.sin(p * Math.PI * 2) * 0.03 * (1 - p));
    } else if (k < 2.6) {
      m.rotation.x = 0;
    } else if (k < 3.2) {
      const p = THREE.MathUtils.smootherstep((k - 2.6) / 0.6, 0, 1);
      m.rotation.z = -(1 - p) * (Math.PI / 2);
      m.position.set((0.205) * (1 - p), Math.sin(p * Math.PI) * 0.15, 0);
    } else {
      m.rotation.set(0, 0, 0);
      m.position.set(0, 0, 0);
    }
  });
  return (
    <group
      position={[1.35, 1.55, -2.95]}
      onClick={(e) => {
        e.stopPropagation();
        request.current = true;
        sfx.boop();
        emit("robot-say", "Oops! Cleanup on desk 3.");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setCursor("scene", { variant: "label", label: "Knock" });
      }}
      onPointerOut={() => setCursor("scene", null)}
    >
      <group ref={g}>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.085, 0.08, 0.2, 40]} />
          <meshPhysicalMaterial color={C.ink} roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} />
        </mesh>
        <mesh position={[0.1, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.05, 0.015, 12, 24, Math.PI]} />
          <meshStandardMaterial color={C.ink} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

export function DeskProps() {
  return (
    <group>
      <Mug />
      {/* Mouse */}
      <mesh position={[1.05, 1.57, -2.8]} scale={[0.07, 0.035, 0.11]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <meshPhysicalMaterial color="#e8e4dc" roughness={0.3} clearcoat={0.6} />
      </mesh>
      <Suspense fallback={null}>
        <Books position={[-1.05, 1.55, -3.85]} scale={1.5} />
        <AlarmClock position={[1.78, 1.55, -2.92]} rotation={[0, -0.45, 0]} />
        <PhotoFrame position={[1.25, 1.55, -3.75]} rotation={[0, -Math.PI / 2 + 0.35, 0]} />
      </Suspense>
    </group>
  );
}
