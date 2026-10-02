"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { C, ROBOT_SPOTS, roomState } from "./config";
import { setCursor } from "../../lib/cursor";
import { onReady } from "../../lib/ready";
import { on, isParty } from "../../lib/events";
import { sfx } from "../../lib/sound";

const LINES = [
  "Human detected. Hi! 👋",
  "Scanning… you look friendly.",
  "6 states, 0 bugs. Probably.",
  "Obstacle class: SMALL. That's you.",
  "Try clicking the laptop →",
  "Swarm arena says hi. Bots unite.",
  "Radar says: hire Bhanu.",
];

const damp = (from: number, to: number, rate: number, dt: number) =>
  from + (to - from) * (1 - Math.exp(-rate * dt));

function dampAngle(from: number, to: number, rate: number, dt: number) {
  let diff = to - from;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return from + diff * (1 - Math.exp(-rate * dt));
}

const LOST_LINES = ["Hmm… this page isn't on my map.", "Scanning for a way home…", "404: route not found. Rerouting!"];

// RescueBot: drives between spots as you scroll, tracks the cursor with its head,
// blinks, and does a radar scan + quip when clicked. Also waves, dances in party
// mode, and in "lost" mode (404 page) wanders with a flashlight.
export default function Robot({ mode = "room" }: { mode?: "room" | "lost" }) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const antenna = useRef<THREE.MeshStandardMaterial>(null);
  const ring = useRef<THREE.Mesh>(null);

  const hoveredRef = useRef(false);
  const pokedAt = useRef(-10);
  const pokeRequested = useRef(false);
  const lineIndex = useRef(0);
  const lineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waveRequested = useRef(false);
  const wavedAt = useRef(-10);
  const party = useRef(false);
  const wander = useRef<[number, number]>([0, 0]);
  const flashTarget = useRef<THREE.Object3D>(null);
  const flash = useRef<THREE.SpotLight>(null);

  const scratch = useMemo(
    () => ({
      ray: new THREE.Raycaster(),
      plane: new THREE.Plane(),
      hit: new THREE.Vector3(),
      ndc: new THREE.Vector2(),
      camDir: new THREE.Vector3(),
      headWorld: new THREE.Vector3(),
      bubblePos: new THREE.Vector3(),
      eyeIdle: new THREE.Color("#fff4dc"),
      eyeHot: new THREE.Color(C.bronzeLight),
    }),
    []
  );

  const eyeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fff4dc",
        emissive: "#fff4dc",
        emissiveIntensity: 2,
        toneMapped: false,
      }),
    []
  );
  useEffect(() => () => eyeMaterial.dispose(), [eyeMaterial]);

  const say = (text: string, ms = 2600) => {
    const el = roomState.bubble;
    if (!el) return;
    const label = el.querySelector("[data-text]");
    if (label) label.textContent = text;
    el.dataset.show = "true";
    if (lineTimer.current) clearTimeout(lineTimer.current);
    lineTimer.current = setTimeout(() => {
      el.dataset.show = "false";
    }, ms);
  };

  // Greet once the preloader is done.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const off = onReady(() => {
      t = setTimeout(
        () => say(mode === "lost" ? "Lost? Me too. Let's find home." : "Hi, I'm RescueBot. Poke me!", 3800),
        900
      );
    });
    party.current = isParty();
    const offSay = on("robot-say", (text) => say(text, 4200));
    const offWave = on("robot-wave", () => (waveRequested.current = true));
    const offParty = on("party", (v) => (party.current = v));
    return () => {
      off();
      offSay();
      offWave();
      offParty();
      clearTimeout(t);
      if (lineTimer.current) clearTimeout(lineTimer.current);
      if (roomState.bubble) roomState.bubble.dataset.show = "false";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (flash.current && flashTarget.current) flash.current.target = flashTarget.current;
  }, []);

  useFrame((state, dt) => {
    const r = root.current;
    if (!r || !body.current || !head.current) return;
    dt = Math.min(dt, 0.05);
    const t = state.clock.elapsedTime;
    if (pokeRequested.current) {
      pokeRequested.current = false;
      pokedAt.current = t;
    }
    if (waveRequested.current) {
      waveRequested.current = false;
      wavedAt.current = t;
    }

    // Drive toward this stage's parking spot.
    let spot = ROBOT_SPOTS[Math.min(ROBOT_SPOTS.length - 1, Math.max(0, Math.round(roomState.stage)))];
    if (mode === "lost") {
      const w = wander.current;
      if (Math.hypot(w[0] - r.position.x, w[1] - r.position.z) < 0.05) {
        const a = Math.random() * Math.PI * 2;
        const rad = 0.6 + Math.random() * 2;
        wander.current = [Math.cos(a) * rad, Math.sin(a) * rad];
        if (Math.random() < 0.35) say(LOST_LINES[Math.floor(Math.random() * LOST_LINES.length)]);
      }
      spot = wander.current;
    }
    const dx = spot[0] - r.position.x;
    const dz = spot[1] - r.position.z;
    const dist = Math.hypot(dx, dz);
    const speed = Math.min(dist, (mode === "lost" ? 0.9 : 2.2) * dt);
    const moving = dist > 0.02;
    if (moving) {
      r.position.x += (dx / dist) * speed;
      r.position.z += (dz / dist) * speed;
      r.rotation.y = dampAngle(r.rotation.y, Math.atan2(dx, dz), 6, dt);
      if (wheels.current) wheels.current.children.forEach((w) => (w.rotation.x += speed / 0.17));
    } else {
      const cam = state.camera.position;
      r.rotation.y = dampAngle(r.rotation.y, Math.atan2(cam.x - r.position.x, cam.z - r.position.z), 3, dt);
    }

    // Poke: spin + hop + radar ring.
    const since = t - pokedAt.current;
    const spin = since < 0.9 ? THREE.MathUtils.smootherstep(since / 0.9, 0, 1) * Math.PI * 2 : 0;
    const dance = party.current ? Math.sin(t * 6) * 0.6 : 0;
    body.current.rotation.y = spin + dance;
    const waveT = t - wavedAt.current;
    const waving = waveT < 1.6;
    body.current.rotation.z = waving ? Math.sin(waveT * 14) * 0.12 * (1 - waveT / 1.6) : 0;
    let hop = since < 0.6 ? Math.sin((since / 0.6) * Math.PI) * 0.25 : 0;
    if (party.current) hop = Math.abs(Math.sin(t * 6)) * 0.12;
    if (waving && waveT < 0.5) hop = Math.sin((waveT / 0.5) * Math.PI) * 0.15;
    const bob = Math.sin(t * (moving ? 14 : 2)) * (moving ? 0.008 : 0.015);
    body.current.position.y = damp(body.current.position.y, (hoveredRef.current ? 0.05 : 0) + bob + hop, 14, dt);

    if (ring.current) {
      const p = Math.min(since / 1.4, 1);
      ring.current.visible = since < 1.4;
      ring.current.scale.setScalar(0.3 + p * 3.2);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.8;
    }

    // Head tracks the cursor (or the camera when there's no mouse).
    head.current.getWorldPosition(scratch.headWorld);
    let yaw = 0;
    let pitch = 0;
    if (roomState.pointer.active) {
      scratch.ndc.set(roomState.pointer.x, roomState.pointer.y);
      scratch.ray.setFromCamera(scratch.ndc, state.camera);
      state.camera.getWorldDirection(scratch.camDir);
      scratch.plane.setFromNormalAndCoplanarPoint(scratch.camDir.negate(), scratch.headWorld);
      if (scratch.ray.ray.intersectPlane(scratch.plane, scratch.hit)) {
        body.current.worldToLocal(scratch.hit);
        const local = scratch.hit.sub(head.current.position);
        yaw = THREE.MathUtils.clamp(Math.atan2(local.x, local.z), -1.1, 1.1);
        pitch = THREE.MathUtils.clamp(-Math.atan2(local.y, Math.hypot(local.x, local.z)), -0.45, 0.35);
      }
    }
    head.current.rotation.y = dampAngle(head.current.rotation.y, yaw, 8, dt);
    head.current.rotation.x = damp(head.current.rotation.x, pitch, 8, dt);

    // Blink every few seconds; squint happily on hover.
    if (eyes.current) {
      const blink = t % 3.6 < 0.12 ? 0.1 : 1;
      const sy = hoveredRef.current ? 0.45 : blink;
      eyes.current.children.forEach((e) => (e.scale.y = damp(e.scale.y, sy, 25, dt)));
    }
    if (party.current) eyeMaterial.emissive.setHSL((t * 0.4) % 1, 0.9, 0.6);
    else eyeMaterial.emissive.lerp(hoveredRef.current ? scratch.eyeHot : scratch.eyeIdle, 1 - Math.exp(-10 * dt));
    // Pin the speech bubble above the head in screen space.
    const bubble = roomState.bubble;
    if (bubble) {
      scratch.bubblePos.copy(scratch.headWorld);
      scratch.bubblePos.y += 0.45;
      scratch.bubblePos.project(state.camera);
      const x = (scratch.bubblePos.x * 0.5 + 0.5) * state.size.width;
      const y = (-scratch.bubblePos.y * 0.5 + 0.5) * state.size.height;
      bubble.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    if (antenna.current) antenna.current.emissiveIntensity = 1 + Math.max(0, Math.sin(t * 4)) * 2.5;
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hoveredRef.current = true;
    setCursor("scene", { variant: "label", label: "Poke me" });
  };
  const out = () => {
    hoveredRef.current = false;
    setCursor("scene", null);
  };
  const poke = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    pokeRequested.current = true;
    sfx.beep();
    const lines = mode === "lost" ? LOST_LINES : LINES;
    say(lines[lineIndex.current++ % lines.length]);
  };

  return (
    <group ref={root} position={[ROBOT_SPOTS[0][0], 0, ROBOT_SPOTS[0][1]]}>
      {/* Radar ring on the floor */}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} visible={false}>
        <ringGeometry args={[0.48, 0.52, 64]} />
        <meshBasicMaterial color={C.bronze} transparent opacity={0} />
      </mesh>

      <group ref={body} onPointerOver={over} onPointerOut={out} onClick={poke}>
        {/* Chassis */}
        <RoundedBox args={[0.84, 0.3, 1.0]} radius={0.08} position={[0, 0.32, 0]} castShadow>
          <meshPhysicalMaterial color={C.paper} roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.15} />
        </RoundedBox>
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.86, 0.05, 0.9]} />
          <meshStandardMaterial color={C.bronze} metalness={0.5} roughness={0.35} />
        </mesh>
        {/* PIR dome + ToF sensors on the nose */}
        <mesh position={[0, 0.4, 0.5]} castShadow>
          <sphereGeometry args={[0.07, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} transparent opacity={0.85} />
        </mesh>
        {[-0.25, 0.25].map((x) => (
          <mesh key={x} position={[x, 0.3, 0.505]}>
            <boxGeometry args={[0.1, 0.06, 0.02]} />
            <meshStandardMaterial color={C.ink} />
          </mesh>
        ))}

        {/* Wheels */}
        <group ref={wheels}>
          {[
            [-0.47, 0.32], [0.47, 0.32], [-0.47, -0.32], [0.47, -0.32],
          ].map(([x, z]) => (
            <group key={`${x}${z}`} position={[x, 0.17, z]}>
              <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.17, 0.17, 0.12, 24]} />
                <meshStandardMaterial color={C.ink} roughness={0.8} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]} position={[x > 0 ? 0.062 : -0.062, 0, 0]}>
                <cylinderGeometry args={[0.07, 0.07, 0.01, 6]} />
                <meshStandardMaterial color={C.bronze} metalness={0.6} roughness={0.3} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Neck */}
        <mesh position={[0, 0.56, -0.05]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.2, 16]} />
          <meshStandardMaterial color={C.ink} metalness={0.4} roughness={0.4} />
        </mesh>

        {/* Head */}
        <group ref={head} position={[0, 0.78, -0.05]}>
          <RoundedBox args={[0.6, 0.36, 0.42]} radius={0.09} castShadow>
            <meshPhysicalMaterial color={C.paper} roughness={0.3} clearcoat={0.8} clearcoatRoughness={0.15} />
          </RoundedBox>
          <RoundedBox args={[0.48, 0.22, 0.04]} radius={0.05} position={[0, 0, 0.2]}>
            <meshStandardMaterial color={C.ink} roughness={0.2} metalness={0.3} />
          </RoundedBox>
          <group ref={eyes} position={[0, 0, 0.225]}>
            {[-0.11, 0.11].map((x) => (
              <mesh key={x} position={[x, 0, 0]} material={eyeMaterial}>
                <capsuleGeometry args={[0.032, 0.05, 8, 16]} />
              </mesh>
            ))}
          </group>
          {/* Ears */}
          {[-0.32, 0.32].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.07, 0.07, 0.05, 24]} />
              <meshStandardMaterial color={C.bronze} metalness={0.5} roughness={0.35} />
            </mesh>
          ))}
          {/* Antenna */}
          <mesh position={[0.14, 0.27, -0.05]}>
            <cylinderGeometry args={[0.008, 0.008, 0.2, 8]} />
            <meshStandardMaterial color={C.ink} />
          </mesh>
          <mesh position={[0.14, 0.38, -0.05]}>
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshStandardMaterial ref={antenna} color="#ff8a5c" emissive="#ff6a3c" emissiveIntensity={1} toneMapped={false} />
          </mesh>
          {mode === "lost" && (
            <>
              <object3D ref={flashTarget} position={[0, -0.5, 2.5]} />
              <spotLight ref={flash} position={[0, 0, 0.25]} angle={0.45} penumbra={0.6} intensity={18} distance={7} decay={1.4} color="#ffe6b0" castShadow />
            </>
          )}
        </group>

      </group>
    </group>
  );
}
