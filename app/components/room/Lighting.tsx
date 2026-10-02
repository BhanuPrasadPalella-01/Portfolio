"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { roomState } from "./config";

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const DAY_SUN = new THREE.Color("#fff1d9");
const NIGHT_MOON = new THREE.Color("#9db2ff");
const DAY_AMBIENT = new THREE.Color("#fff7ec");
const NIGHT_AMBIENT = new THREE.Color("#5b6aa8");
const DAY_SKY = new THREE.Color("#fff6e8");
const NIGHT_SKY = new THREE.Color("#33406b");
const DAY_GROUND = new THREE.Color("#d8c6a8");
const NIGHT_GROUND = new THREE.Color("#1c1610");

// Sun and sky by day; moonlight, desk lamp and screen glow by night.
// `roomState.night` eases toward the page theme and every light follows it.
export default function Lighting({ shadows }: { shadows: boolean }) {
  const sun = useRef<THREE.DirectionalLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const screen = useRef<THREE.PointLight>(null);

  useFrame((_, dt) => {
    roomState.night += (roomState.nightTarget - roomState.night) * (1 - Math.exp(-dt * 2.5));
    const n = roomState.night;
    if (sun.current) {
      sun.current.intensity = mix(2.4, 0.55, n);
      sun.current.color.lerpColors(DAY_SUN, NIGHT_MOON, n);
    }
    if (ambient.current) {
      ambient.current.intensity = mix(0.5, 0.16, n);
      ambient.current.color.lerpColors(DAY_AMBIENT, NIGHT_AMBIENT, n);
    }
    if (hemi.current) {
      hemi.current.intensity = mix(0.75, 0.22, n);
      hemi.current.color.lerpColors(DAY_SKY, NIGHT_SKY, n);
      hemi.current.groundColor.lerpColors(DAY_GROUND, NIGHT_GROUND, n);
    }
    if (screen.current) screen.current.intensity = mix(0.2, 2.2, n);
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.5} />
      <hemisphereLight ref={hemi} args={["#fff6e8", "#d8c6a8", 0.75]} />
      <directionalLight
        ref={sun}
        position={[6, 10, 6]}
        intensity={2.4}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0003}
        shadow-normalBias={0.025}
        shadow-radius={4}
      />
      {/* Cool spill from the laptop screen, strongest at night. */}
      <pointLight ref={screen} position={[0.3, 2.1, -2.9]} color="#9fb8ff" intensity={0.2} distance={3} decay={2} />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2} position={[0, 5, 5]} scale={[10, 4, 1]} color="#fff6e8" />
        <Lightformer intensity={1.2} position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#f1e3cc" />
        <Lightformer intensity={0.8} position={[6, 3, -2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={1.5} position={[2, 6, 2]} scale={2} color="#ffe2b8" />
      </Environment>
    </>
  );
}
