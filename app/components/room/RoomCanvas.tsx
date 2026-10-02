"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import CameraRig from "./CameraRig";
import Room from "./Room";
import Robot from "./Robot";
import { CertWall, DeskProps, InboxTray, Laptop, Whiteboard } from "./Objects";
import { setCursor } from "../../lib/cursor";

export default function RoomCanvas({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  useEffect(() => () => setCursor("scene", null), []);

  return (
    <Canvas
      shadows={!mobile}
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [9.5, 7.2, 9.5], fov: 34, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <CameraRig reduced={reduced} />

      <ambientLight intensity={0.55} color="#fff7ec" />
      <hemisphereLight args={["#fff8ee", "#d8c6a8", 0.75]} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.9}
        color="#fff4e2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2} position={[0, 5, 5]} scale={[10, 4, 1]} color="#fff6e8" />
        <Lightformer intensity={1.2} position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#f1e3cc" />
        <Lightformer intensity={0.8} position={[6, 3, -2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} color="#ffffff" />
      </Environment>

      <Room />
      <DeskProps />
      <Laptop />
      <InboxTray />
      <Whiteboard />
      <Suspense fallback={null}>
        <CertWall />
      </Suspense>
      <Robot />

      <ContactShadows position={[0, -0.41, 0]} scale={14} blur={2.6} opacity={0.35} far={2} resolution={512} color="#5a4a36" />
    </Canvas>
  );
}
