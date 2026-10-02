"use client";

import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { setCursor } from "../../lib/cursor";
import { useNavigate } from "../transition/TransitionProvider";

// Hover lift + labelled cursor + click-to-navigate for objects in the room.
export default function Interactive({
  label,
  href,
  onActivate,
  position,
  rotation,
  lift = 0.06,
  children,
}: {
  label: string;
  href?: string;
  onActivate?: () => void;
  position?: [number, number, number];
  rotation?: [number, number, number];
  lift?: number;
  children: (hovered: boolean) => React.ReactNode;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const inner = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = inner.current;
    if (!g) return;
    const k = 1 - Math.exp(-delta * 10);
    const s = hovered ? 1.035 : 1;
    g.scale.x += (s - g.scale.x) * k;
    g.scale.y += (s - g.scale.y) * k;
    g.scale.z += (s - g.scale.z) * k;
    g.position.y += ((hovered ? lift : 0) - g.position.y) * k;
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    setCursor("scene", { variant: "label", label });
  };
  const out = () => {
    setHovered(false);
    setCursor("scene", null);
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onActivate?.();
    if (href) {
      setCursor("scene", null);
      navigate(href);
    }
  };

  return (
    <group position={position} rotation={rotation}>
      <group ref={inner} onPointerOver={over} onPointerOut={out} onClick={click}>
        {children(hovered)}
      </group>
    </group>
  );
}
