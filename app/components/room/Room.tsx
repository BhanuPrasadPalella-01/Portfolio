"use client";

import { RoundedBox } from "@react-three/drei";
import { C } from "./config";

// Static architecture and decor: the diorama shell, desk, chair, lamp, plant, shelf.

function Desk() {
  const legs: [number, number][] = [
    [-1.0, -2.8], [2.2, -2.8], [-1.0, -3.9], [2.2, -3.9],
  ];
  return (
    <group>
      <RoundedBox args={[3.4, 0.1, 1.4]} radius={0.03} position={[0.6, 1.5, -3.35]} castShadow receiveShadow>
        <meshStandardMaterial color={C.oak} roughness={0.55} />
      </RoundedBox>
      {legs.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.725, z]} castShadow>
          <boxGeometry args={[0.07, 1.45, 0.07]} />
          <meshStandardMaterial color={C.ink} roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Chair() {
  return (
    <group position={[0.5, 0, -1.95]} rotation={[0, 0.35, 0]}>
      <RoundedBox args={[0.82, 0.12, 0.8]} radius={0.05} position={[0, 0.95, 0]} castShadow>
        <meshStandardMaterial color={C.sand} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.82, 0.85, 0.1]} radius={0.05} position={[0, 1.45, 0.4]} castShadow>
        <meshStandardMaterial color={C.sand} roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.85, 12]} />
        <meshStandardMaterial color={C.ink} metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 5]} />
        <meshStandardMaterial color={C.ink} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Lamp() {
  return (
    <group position={[2.0, 1.55, -3.65]}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.19, 0.04, 32]} />
        <meshStandardMaterial color={C.ink} metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0.08, 0.38, 0.06]} rotation={[0.25, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.75, 12]} />
        <meshStandardMaterial color={C.ink} metalness={0.4} roughness={0.35} />
      </mesh>
      <group position={[0.2, 0.75, 0.16]} rotation={[0.5, 0, -0.5]}>
        <mesh castShadow>
          <coneGeometry args={[0.2, 0.28, 32, 1, true]} />
          <meshStandardMaterial color={C.bronze} metalness={0.6} roughness={0.35} side={2} />
        </mesh>
        <mesh position={[0, -0.06, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#fff3d6" emissive="#ffd59a" emissiveIntensity={3} toneMapped={false} />
        </mesh>
      </group>
      <pointLight position={[0.25, 0.6, 0.3]} color="#ffd59a" intensity={4} distance={4.5} decay={2} />
    </group>
  );
}

function Plant() {
  const leaves: [number, number, number, number][] = [
    [0, 1.25, 0, 0], [0.18, 1.05, 0.08, 0.6], [-0.2, 1.1, -0.05, -0.7],
    [0.05, 1.0, -0.22, 0.4], [-0.08, 0.95, 0.22, -0.4], [0.22, 1.35, -0.1, 0.9],
  ];
  return (
    <group position={[-3.55, 0, -3.55]}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.24, 0.7, 32]} />
        <meshStandardMaterial color={C.terracotta} roughness={0.85} />
      </mesh>
      {leaves.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[r * 0.6, r, r]} scale={[0.16, 0.42, 0.09]} castShadow>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={C.leaf} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Shelf() {
  const books: [number, number, string][] = [
    [-0.6, 0.42, C.bronze], [-0.45, 0.36, C.ink], [-0.3, 0.4, C.sand], [-0.15, 0.32, "#a7ae96"],
  ];
  return (
    <group position={[-3.85, 0, 2.5]}>
      <RoundedBox args={[0.65, 1.0, 1.9]} radius={0.03} position={[0, 0.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={C.sand} roughness={0.8} />
      </RoundedBox>
      {books.map(([z, h, color]) => (
        <mesh key={z} position={[0, 1.0 + h / 2, z]} castShadow>
          <boxGeometry args={[0.45, h, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 1.18, 0.55]} castShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={C.paper} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Window() {
  return (
    <group position={[1.6, 3.5, -4.17]}>
      <mesh>
        <boxGeometry args={[1.9, 1.4, 0.06]} />
        <meshStandardMaterial color="#fbf7ef" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1.74, 1.24]} />
        <meshStandardMaterial color="#fff6e6" emissive="#fff1d8" emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.04, 1.24, 0.02]} />
        <meshStandardMaterial color="#fbf7ef" />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.74, 0.04, 0.02]} />
        <meshStandardMaterial color="#fbf7ef" />
      </mesh>
    </group>
  );
}

export default function Room() {
  return (
    <group>
      {/* Floor slab */}
      <RoundedBox args={[9, 0.4, 9]} radius={0.06} position={[0, -0.2, 0]} receiveShadow>
        <meshStandardMaterial color={C.floor} roughness={0.8} />
      </RoundedBox>
      {/* Walls */}
      <mesh position={[0, 2.6, -4.35]} receiveShadow>
        <boxGeometry args={[9, 5.2, 0.3]} />
        <meshStandardMaterial color={C.wall} roughness={0.95} />
      </mesh>
      <mesh position={[-4.35, 2.6, 0]} receiveShadow>
        <boxGeometry args={[0.3, 5.2, 9]} />
        <meshStandardMaterial color={C.wall} roughness={0.95} />
      </mesh>
      {/* Skirting */}
      <mesh position={[0, 0.09, -4.18]}>
        <boxGeometry args={[9, 0.18, 0.05]} />
        <meshStandardMaterial color={C.sand} />
      </mesh>
      <mesh position={[-4.18, 0.09, 0]}>
        <boxGeometry args={[0.05, 0.18, 9]} />
        <meshStandardMaterial color={C.sand} />
      </mesh>
      {/* Rug */}
      <mesh position={[0.9, 0.012, 0.6]} scale={[1, 1, 0.78]} receiveShadow>
        <cylinderGeometry args={[2.55, 2.55, 0.02, 96]} />
        <meshStandardMaterial color={C.bronzeLight} roughness={1} />
      </mesh>
      <mesh position={[0.9, 0.024, 0.6]} scale={[1, 1, 0.78]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.4, 0.02, 96]} />
        <meshStandardMaterial color="#efe3cf" roughness={1} />
      </mesh>

      <Desk />
      <Chair />
      <Lamp />
      <Plant />
      <Shelf />
      <Window />
    </group>
  );
}
