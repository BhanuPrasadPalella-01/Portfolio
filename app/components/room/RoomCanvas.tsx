"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import type { BloomEffect } from "postprocessing";
import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import Room from "./Room";
import Robot from "./Robot";
import { CertWall, DeskProps, InboxTray, Laptop, Whiteboard } from "./Objects";
import { Corkboard, FractalPrint, HelixSculpture, SdrRadio, SwarmArena } from "./Lab";
import { roomState } from "./config";
import { dropShadowTexture } from "./surfaces";
import { setCursor } from "../../lib/cursor";
import { useTheme } from "../../lib/theme";

function Effects({ mobile }: { mobile: boolean }) {
  const bloom = useRef<BloomEffect>(null);
  // Night makes the lamp, screens and LEDs bloom more.
  useFrame(() => {
    if (bloom.current) bloom.current.intensity = 0.25 + roomState.night * 0.9;
  });
  if (mobile) {
    return (
      <EffectComposer multisampling={0}>
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    );
  }
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <N8AO halfRes aoRadius={0.55} intensity={2.4} distanceFalloff={0.6} color="#2b1f14" />
      <Bloom ref={bloom} mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.3} />
      <ToneMapping mode={ToneMappingMode.AGX} />
      <Vignette offset={0.32} darkness={0.32} />
      <SMAA />
    </EffectComposer>
  );
}

function DropShadow() {
  const tex = useMemo(() => dropShadowTexture(), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, -0.42, 0.3]} renderOrder={-1}>
      <planeGeometry args={[15, 15]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

export default function RoomCanvas({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const theme = useTheme();
  useEffect(() => () => setCursor("scene", null), []);

  useEffect(() => {
    roomState.nightTarget = theme === "dark" ? 1 : 0;
    if (reduced) roomState.night = roomState.nightTarget;
  }, [theme, reduced]);

  // Start in the right lighting instead of fading on load.
  useEffect(() => {
    roomState.night = roomState.nightTarget;
  }, []);

  return (
    <Canvas
      shadows={mobile ? false : "soft"}
      flat
      dpr={mobile ? [1, 1.5] : [1, 1.75]}
      camera={{ position: [9.5, 7.2, 9.5], fov: 34, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false }}
    >
      <CameraRig reduced={reduced} />
      <Lighting shadows={!mobile} />

      <Room />
      <DeskProps />
      <Laptop />
      <InboxTray />
      <Whiteboard />
      <HelixSculpture />
      <SwarmArena />
      <Corkboard />
      <SdrRadio />
      <FractalPrint />
      <Suspense fallback={null}>
        <CertWall />
      </Suspense>
      <Robot />

      <DropShadow />
      <Effects mobile={mobile} />
    </Canvas>
  );
}
