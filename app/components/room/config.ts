// Palette shared by every material in the room (mirrors globals.css).
export const C = {
  ink: "#1d2026",
  paper: "#f4f0e8",
  wall: "#ece4d6",
  floor: "#d8c3a2",
  oak: "#b98a5a",
  walnut: "#7a5236",
  sand: "#d9c7a7",
  bronze: "#8a5c2c",
  bronzeLight: "#b5844f",
  metal: "#c9ccd1",
  leaf: "#6f7f5c",
  terracotta: "#c08a63",
  sage: "#8fa08a",
};

export type Shot = {
  pos: [number, number, number];
  target: [number, number, number];
};

// One camera shot per home-page tour section, in scroll order:
// intro, the nine projects (same order as lib/projects), certificates, outro.
export const SHOTS: Shot[] = [
  { pos: [9.5, 7.2, 9.5], target: [-0.4, 1.3, -0.6] }, // intro
  { pos: [3.0, 2.9, -1.0], target: [0.3, 1.75, -3.3] }, // laptop → VaultSphere
  { pos: [-0.9, 2.4, 5.4], target: [-3.85, 1.55, 3.0] }, // helix → Protein
  { pos: [5.2, 2.1, 5.0], target: [1.8, 0.55, 1.6] }, // robot → RescueBot
  { pos: [0.8, 3.9, 5.8], target: [-1.9, 0.2, 2.4] }, // arena → SwarmBot
  { pos: [1.7, 2.9, -1.4], target: [3.5, 2.9, -4.15] }, // corkboard → Adaptive PSO
  { pos: [-1.2, 2.2, 3.3], target: [-3.85, 1.25, 1.85] }, // radio → Mission-aware SDR
  { pos: [-0.4, 3.0, 0.4], target: [-2.6, 2.85, -4.1] }, // whiteboard → GNN-RL
  { pos: [0.9, 2.9, -1.0], target: [-0.7, 1.6, -3.25] }, // inbox → Complaints
  { pos: [0.6, 3.1, 2.7], target: [-4.1, 3.1, 2.7] }, // fractal print → FractalLab
  { pos: [1.9, 2.9, -0.2], target: [-4.1, 2.75, -0.22] }, // certificate wall → About
  { pos: [12, 9, 12], target: [-0.4, 1.3, -0.6] }, // outro
];

// Where the robot parks during each shot ([x, z]).
export const ROBOT_SPOTS: [number, number][] = [
  [2.1, 1.4],
  [1.9, 0.6],
  [-0.4, 3.7],
  [1.8, 1.6],
  [-0.3, 2.6],
  [2.6, -1.4],
  [-1.5, 0.4],
  [-1.2, -1.6],
  [1.4, -1.4],
  [-2.2, 0.8],
  [-2.4, -0.8],
  [2.1, 1.4],
];

// Mutable scene state read inside useFrame (never triggers React renders).
export const roomState = {
  stage: 0,
  pointer: { x: 0, y: 0, active: false },
  /** 0 = day, 1 = night. `night` eases toward `nightTarget`. */
  night: 0,
  nightTarget: 0,
  /** Desk lamp switch (double-click the lamp). `lamp` eases toward it. */
  lampOn: true,
  lamp: 1,
  /** Opening fly-through progress, 0 → 1 (1 when skipped). GlassPane shatters at IMPACT. */
  intro: 0,
  /** DOM speech bubble the robot positions over its head (lives outside the canvas). */
  bubble: null as HTMLDivElement | null,
};
