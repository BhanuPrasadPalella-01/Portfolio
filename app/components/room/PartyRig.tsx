"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isParty, on } from "../../lib/events";

// Party mode (Konami code or ⌘K): a mirror ball drops in and coloured lights orbit the room.
export default function PartyRig() {
  const ball = useRef<THREE.Group>(null);
  const lights = useRef<THREE.Group>(null);
  const active = useRef(isParty());
  const amount = useRef(0);

  useEffect(() => on("party", (v) => (active.current = v)), []);

  useFrame((state, dt) => {
    amount.current += ((active.current ? 1 : 0) - amount.current) * (1 - Math.exp(-dt * 3));
    const a = amount.current;
    const t = state.clock.elapsedTime;
    if (ball.current) {
      ball.current.visible = a > 0.01;
      ball.current.position.y = 6.5 - a * 2.4;
      ball.current.rotation.y = t * 0.8;
    }
    lights.current?.children.forEach((l, i) => {
      const light = l as THREE.PointLight;
      const ang = t * 1.4 + (i / 4) * Math.PI * 2;
      light.position.set(0.9 + Math.cos(ang) * 2.4, 2.2 + Math.sin(t * 2 + i) * 0.6, 0.4 + Math.sin(ang) * 2.4);
      light.color.setHSL(((t * 0.15 + i / 4) % 1), 0.9, 0.55);
      light.intensity = a * 6;
    });
  });

  return (
    <>
      <group ref={ball} position={[0.9, 6.5, 0.4]} visible={false}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 1.2, 6]} />
          <meshStandardMaterial color="#777" />
        </mesh>
        <mesh castShadow>
          <icosahedronGeometry args={[0.32, 3]} />
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.08} flatShading />
        </mesh>
      </group>
      <group ref={lights}>
        {[0, 1, 2, 3].map((i) => (
          <pointLight key={i} intensity={0} distance={6} decay={1.5} />
        ))}
      </group>
    </>
  );
}
