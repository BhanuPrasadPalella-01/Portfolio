"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { C, roomState } from "./config";
import GlassPane from "./GlassPane";
import { ArmChair, DeskLamp, DrawerShelf, LowCabinet, PottedPlant, Succulent, Vase } from "./Models";
import { sfx } from "../../lib/sound";
import { setCursor } from "../../lib/cursor";
import {
  deskTexture,
  fabricTexture,
  floorTexture,
  plasterTexture,
  rugTexture,
  skyTexture,
} from "./surfaces";

// Model orientation: Poly Haven assets face +z; turn them toward the desk / camera.
const CHAIR_TURN = Math.PI + 0.35;
const LAMP_TURN = 0;
/** Height of the low cabinet's top (modern_wooden_cabinet at 1.5×). */
export const CABINET_TOP = 1.02;

// Static architecture and decor: the diorama shell, desk, chair, lamp, plant,
// cabinet, window and clock. Lighting that depends on day/night lives here too
// for the lamp and window.

function useTextures() {
  const t = useMemo(
    () => ({
      floor: floorTexture(),
      desk: deskTexture(),
      plaster: plasterTexture(),
      rug: rugTexture(),
      fabric: fabricTexture(),
      day: skyTexture(false),
      night: skyTexture(true),
    }),
    []
  );
  useEffect(() => () => Object.values(t).forEach((x) => x.dispose()), [t]);
  return t;
}

function Desk({ map }: { map: THREE.Texture }) {
  const legs: [number, number][] = [
    [-1.0, -2.8], [2.2, -2.8], [-1.0, -3.9], [2.2, -3.9],
  ];
  return (
    <group>
      <RoundedBox args={[3.4, 0.09, 1.4]} radius={0.035} smoothness={4} position={[0.6, 1.5, -3.35]} castShadow receiveShadow>
        <meshPhysicalMaterial map={map} roughness={0.42} clearcoat={0.35} clearcoatRoughness={0.4} />
      </RoundedBox>
      {legs.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.73, z]} castShadow>
          <cylinderGeometry args={[0.03, 0.025, 1.46, 16]} />
          <meshStandardMaterial color={C.ink} roughness={0.3} metalness={0.7} />
        </mesh>
      ))}
      {/* Cable tray / modesty rail */}
      <mesh position={[0.6, 1.35, -3.95]}>
        <boxGeometry args={[3.0, 0.04, 0.04]} />
        <meshStandardMaterial color={C.ink} roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

function PrimitiveChair({ fabric }: { fabric: THREE.Texture }) {
  return (
    <group position={[0.5, 0, -1.95]} rotation={[0, 0.35, 0]}>
      <RoundedBox args={[0.82, 0.14, 0.8]} radius={0.06} smoothness={4} position={[0, 0.95, 0]} castShadow>
        <meshStandardMaterial color={C.sand} map={fabric} roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.82, 0.85, 0.12]} radius={0.06} smoothness={4} position={[0, 1.47, 0.4]} rotation={[-0.08, 0, 0]} castShadow>
        <meshStandardMaterial color={C.sand} map={fabric} roughness={0.95} />
      </RoundedBox>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.85, 16]} />
        <meshStandardMaterial color={C.ink} metalness={0.8} roughness={0.25} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.22, 0.07, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.44, 10]} />
              <meshStandardMaterial color={C.ink} metalness={0.8} roughness={0.25} />
            </mesh>
            <mesh position={[0.42, 0.04, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color={C.ink} roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function PrimitiveLamp({ bulbRef }: { bulbRef: React.RefObject<THREE.MeshStandardMaterial | null> }) {
  return (
    <>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.19, 0.04, 40]} />
        <meshStandardMaterial color={C.ink} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.08, 0.38, 0.06]} rotation={[0.25, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, 0.75, 12]} />
        <meshStandardMaterial color={C.ink} metalness={0.7} roughness={0.3} />
      </mesh>
      <group position={[0.2, 0.75, 0.16]} rotation={[0.5, 0, -0.5]}>
        <mesh castShadow>
          <coneGeometry args={[0.2, 0.28, 40, 1, true]} />
          <meshPhysicalMaterial color={C.bronze} metalness={0.85} roughness={0.28} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.07, 20, 20]} />
          <meshStandardMaterial ref={bulbRef} color="#fff3d6" emissive="#ffcf8a" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}

function Lamp() {
  const light = useRef<THREE.PointLight>(null);
  const bulb = useRef<THREE.MeshStandardMaterial | null>(null);
  useFrame((_, dt) => {
    roomState.lamp += ((roomState.lampOn ? 1 : 0) - roomState.lamp) * (1 - Math.exp(-dt * 12));
    const n = roomState.night;
    const on = roomState.lamp;
    if (light.current) light.current.intensity = (1.2 + n * 9) * on;
    if (bulb.current) bulb.current.emissiveIntensity = (1.5 + n * 4) * on + 0.05;
  });
  return (
    <group
      position={[2.0, 1.55, -3.55]}
      onDoubleClick={(e) => {
        e.stopPropagation();
        roomState.lampOn = !roomState.lampOn;
        sfx.click();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setCursor("scene", { variant: "label", label: "Double-click" });
      }}
      onPointerOut={() => setCursor("scene", null)}
    >
      <Suspense fallback={<PrimitiveLamp bulbRef={bulb} />}>
        <DeskLamp bulbRef={bulb} lightRef={light} rotation={[0, LAMP_TURN, 0]} />
      </Suspense>
      <pointLight ref={light} position={[0.3, 0.55, 0.35]} color="#ffc98a" intensity={2} distance={6} decay={1.6} />
    </group>
  );
}

function PrimitivePlant() {
  const leaves = useMemo(() => {
    const out: { pos: [number, number, number]; rot: [number, number, number]; s: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + (i % 3) * 0.3;
      const tilt = 0.5 + (i % 4) * 0.15;
      out.push({
        pos: [Math.cos(a) * 0.08, 0.95 + (i % 5) * 0.09, Math.sin(a) * 0.08],
        rot: [Math.sin(a) * tilt, -a, Math.cos(a) * tilt],
        s: 0.8 + (i % 3) * 0.2,
      });
    }
    return out;
  }, []);
  return (
    <group position={[-3.55, 0, -3.55]}>
      <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.33, 0.25, 0.72, 40]} />
        <meshPhysicalMaterial color={C.terracotta} roughness={0.75} clearcoat={0.1} />
      </mesh>
      <mesh position={[0, 0.71, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 32]} />
        <meshStandardMaterial color="#4a3826" roughness={1} />
      </mesh>
      {leaves.map((l, i) => (
        <group key={i} position={l.pos} rotation={l.rot}>
          <mesh position={[0, 0.28 * l.s, 0]} scale={[0.13 * l.s, 0.36 * l.s, 0.025]} castShadow>
            <sphereGeometry args={[1, 20, 14]} />
            <meshStandardMaterial color={i % 2 ? C.leaf : "#7d8e67"} roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PrimitiveCabinet() {
  return (
    <group position={[-3.85, 0, 2.5]}>
      <RoundedBox args={[0.65, 1.0, 1.9]} radius={0.03} smoothness={4} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={C.sand} roughness={0.55} clearcoat={0.2} />
      </RoundedBox>
      {[-0.48, 0.48].map((z) => (
        <mesh key={z} position={[0.33, 0.5, z]}>
          <boxGeometry args={[0.01, 0.86, 0.88]} />
          <meshStandardMaterial color="#cdb998" roughness={0.6} />
        </mesh>
      ))}
      {[-0.1, 0.1].map((z) => (
        <mesh key={z} position={[0.35, 0.62, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 10]} />
          <meshStandardMaterial color={C.bronze} metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function Window({ day, night }: { day: THREE.Texture; night: THREE.Texture }) {
  const dayMat = useRef<THREE.MeshBasicMaterial>(null);
  const nightMat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const n = roomState.night;
    if (dayMat.current) dayMat.current.opacity = 1 - n;
    if (nightMat.current) nightMat.current.opacity = n;
  });
  return (
    <group position={[1.6, 3.5, -4.17]}>
      {/* Hollow frame lining the opening */}
      {[
        [-0.9325, 0, 0.085, 1.45],
        [0.9325, 0, 0.085, 1.45],
        [0, 0.6825, 1.78, 0.085],
        [0, -0.6825, 1.78, 0.085],
      ].map(([x, y, w, h]) => (
        <mesh key={`${x}${y}`} position={[x, y, -0.13]} castShadow>
          <boxGeometry args={[w, h, 0.34]} />
          <meshStandardMaterial color="#fbf7ef" roughness={0.5} />
        </mesh>
      ))}
      <GlassPane position={[0, 0, -0.12]} />
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.78, 1.28]} />
        <meshBasicMaterial ref={dayMat} map={day} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.046]}>
        <planeGeometry args={[1.78, 1.28]} />
        <meshBasicMaterial ref={nightMat} map={night} transparent opacity={0} toneMapped={false} />
      </mesh>
      {[
        [0, 0, 0.04, 1.28],
        [0, 0, 1.78, 0.04],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.06]}>
          <boxGeometry args={[w, h, 0.03]} />
          <meshStandardMaterial color="#fbf7ef" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, -0.76, 0.1]} castShadow>
        <boxGeometry args={[2.1, 0.06, 0.24]} />
        <meshStandardMaterial color="#fbf7ef" roughness={0.5} />
      </mesh>
      {/* Curtains */}
      {[-1.2, 1.2].map((x) => (
        <group key={x} position={[x, -0.15, 0.16]}>
          {[0, 1, 2, 3].map((k) => (
            <mesh key={k} position={[(k - 1.5) * 0.09, 0, Math.sin(k * 1.7) * 0.03]} castShadow>
              <boxGeometry args={[0.1, 2.0, 0.03]} />
              <meshStandardMaterial color="#e9dcc3" roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.9, 0.17]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 3.0, 10]} />
        <meshStandardMaterial color={C.bronze} metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Clock() {
  const hour = useRef<THREE.Group>(null);
  const minute = useRef<THREE.Group>(null);
  const second = useRef<THREE.Group>(null);
  useFrame(() => {
    // Coimbatore time (IST, UTC+5:30).
    const now = new Date(Date.now() + 5.5 * 3600 * 1000);
    const s = now.getUTCSeconds() + now.getUTCMilliseconds() / 1000;
    const m = now.getUTCMinutes() + s / 60;
    const h = (now.getUTCHours() % 12) + m / 60;
    if (second.current) second.current.rotation.z = -(s / 60) * Math.PI * 2;
    if (minute.current) minute.current.rotation.z = -(m / 60) * Math.PI * 2;
    if (hour.current) hour.current.rotation.z = -(h / 12) * Math.PI * 2;
  });
  return (
    <group position={[-0.55, 3.75, -4.15]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.06, 48]} />
        <meshPhysicalMaterial color={C.ink} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.032]}>
        <circleGeometry args={[0.3, 48]} />
        <meshStandardMaterial color="#fbf8f1" roughness={0.6} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[Math.sin((i / 12) * Math.PI * 2) * 0.25, Math.cos((i / 12) * Math.PI * 2) * 0.25, 0.035]}>
          <circleGeometry args={[i % 3 === 0 ? 0.018 : 0.009, 12]} />
          <meshBasicMaterial color={C.ink} />
        </mesh>
      ))}
      <group ref={hour} position={[0, 0, 0.04]}>
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[0.022, 0.15, 0.006]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
      </group>
      <group ref={minute} position={[0, 0, 0.045]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.014, 0.21, 0.006]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
      </group>
      <group ref={second} position={[0, 0, 0.05]}>
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.006, 0.23, 0.004]} />
          <meshStandardMaterial color={C.bronze} />
        </mesh>
      </group>
    </group>
  );
}

export default function Room() {
  const t = useTextures();
  return (
    <group>
      {/* Floor slab: oak boards on top, darker sides */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[9, 0.4, 9]} />
        <meshStandardMaterial attach="material-0" color="#b49a78" roughness={0.8} />
        <meshStandardMaterial attach="material-1" color="#b49a78" roughness={0.8} />
        <meshPhysicalMaterial attach="material-2" map={t.floor} roughness={0.55} clearcoat={0.25} clearcoatRoughness={0.5} />
        <meshStandardMaterial attach="material-3" color="#b49a78" roughness={0.8} />
        <meshStandardMaterial attach="material-4" color="#c2a986" roughness={0.8} />
        <meshStandardMaterial attach="material-5" color="#b49a78" roughness={0.8} />
      </mesh>
      {/* Walls */}
      {/* Back wall, built around a real window opening (the intro flies through it). */}
      {[
        [-1.9375, 2.6, 5.125, 5.2],
        [3.5375, 2.6, 1.925, 5.2],
        [1.6, 1.3875, 1.95, 2.775],
        [1.6, 4.7125, 1.95, 0.975],
      ].map(([x, y, w, h]) => (
        <mesh key={`${x}${y}`} position={[x, y, -4.35]} receiveShadow castShadow>
          <boxGeometry args={[w, h, 0.3]} />
          <meshStandardMaterial color={C.wall} map={t.plaster} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[-4.35, 2.6, 0]} receiveShadow>
        <boxGeometry args={[0.3, 5.2, 9]} />
        <meshStandardMaterial color={C.wall} map={t.plaster} roughness={0.95} />
      </mesh>
      {/* Skirting */}
      <mesh position={[0, 0.09, -4.18]}>
        <boxGeometry args={[9, 0.18, 0.05]} />
        <meshStandardMaterial color="#e2d6c2" roughness={0.6} />
      </mesh>
      <mesh position={[-4.18, 0.09, 0]}>
        <boxGeometry args={[0.05, 0.18, 9]} />
        <meshStandardMaterial color="#e2d6c2" roughness={0.6} />
      </mesh>
      {/* Rug */}
      <mesh position={[0.9, 0.02, 0.6]} scale={[1, 1, 0.78]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.025, 128]} />
        <meshStandardMaterial attach="material-0" color="#a7774a" roughness={1} />
        <meshStandardMaterial attach="material-1" map={t.rug} roughness={1} />
        <meshStandardMaterial attach="material-2" map={t.rug} roughness={1} />
      </mesh>

      <Desk map={t.desk} />
      <Suspense fallback={<PrimitiveChair fabric={t.fabric} />}>
        <ArmChair position={[0.5, 0, -1.95]} rotation={[0, CHAIR_TURN, 0]} />
      </Suspense>
      <Lamp />
      <Suspense fallback={<PrimitivePlant />}>
        <PottedPlant position={[-3.35, 0, -3.35]} rotation={[0, 0.6, 0]} />
      </Suspense>
      <Suspense fallback={<PrimitiveCabinet />}>
        <LowCabinet position={[-3.81, 0, 2.5]} rotation={[0, Math.PI / 2, 0]} scale={1.5} />
        <Vase position={[-3.8, CABINET_TOP, 0.95]} />
        <Succulent position={[-3.8, CABINET_TOP, 3.95]} />
      </Suspense>
      <Suspense fallback={null}>
        <DrawerShelf position={[3.5, 0, -3.9]} scale={1.2} />
      </Suspense>
      <Window day={t.day} night={t.night} />
      <Clock />
    </group>
  );
}
