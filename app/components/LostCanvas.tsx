"use client";

import { Canvas } from "@react-three/fiber";
import Robot from "./room/Robot";

export default function LostCanvas() {
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 5, 7], fov: 40 }} gl={{ alpha: true }} onCreated={({ camera }) => camera.lookAt(0, -0.4, 2.4)}>
      <ambientLight intensity={0.08} color="#7f8fc8" />
      <directionalLight position={[-4, 6, -3]} intensity={0.35} color="#8fa0d8" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#2a2c33" roughness={0.9} />
      </mesh>
      {[
        [-2.2, 0.25, -1.2, 0.5],
        [1.8, 0.35, -2.0, 0.7],
        [2.6, 0.2, 1.2, 0.4],
        [-1.6, 0.3, 1.8, 0.6],
      ].map(([x, y, z, s]) => (
        <mesh key={`${x}${z}`} position={[x, y, z]} rotation={[0.3, x, 0.2]} castShadow receiveShadow>
          <dodecahedronGeometry args={[s, 0]} />
          <meshStandardMaterial color="#5b5f68" roughness={0.8} flatShading />
        </mesh>
      ))}
      <Robot mode="lost" />
    </Canvas>
  );
}
