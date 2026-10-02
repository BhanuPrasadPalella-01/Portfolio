// Palette shared by every material in the room (mirrors globals.css).
export const C = {
  ink: "#1d2026",
  paper: "#f4f0e8",
  wall: "#efe8dc",
  floor: "#e2d3bb",
  oak: "#c79c6d",
  sand: "#d9c7a7",
  bronze: "#8a5c2c",
  bronzeLight: "#b5844f",
  metal: "#c9ccd1",
  leaf: "#7f8c6a",
  terracotta: "#c69c76",
};

export type Shot = {
  pos: [number, number, number];
  target: [number, number, number];
};

// One camera shot per home-page tour section, in scroll order.
export const SHOTS: Shot[] = [
  { pos: [9.5, 7.2, 9.5], target: [-0.4, 1.3, -0.8] }, // intro
  { pos: [3.0, 2.9, -1.0], target: [0.3, 1.75, -3.3] }, // laptop → VaultSphere
  { pos: [5.2, 2.1, 5.0], target: [1.8, 0.55, 1.6] }, // robot → RescueBot
  { pos: [-0.4, 3.0, 0.4], target: [-2.6, 2.85, -4.1] }, // whiteboard → GNN-RL
  { pos: [0.9, 2.9, -1.0], target: [-0.7, 1.6, -3.25] }, // inbox → Complaints
  { pos: [1.4, 2.9, 0.2], target: [-4.1, 2.75, -0.15] }, // certificate wall → About
  { pos: [12, 9, 12], target: [-0.4, 1.3, -0.8] }, // outro
];

// Where the robot parks during each shot.
export const ROBOT_SPOTS: [number, number][] = [
  [2.1, 1.4],
  [1.9, 0.6],
  [1.8, 1.6],
  [-1.2, -1.6],
  [1.4, -1.5],
  [-2.4, -0.6],
  [2.1, 1.4],
];

// Mutable scene state read inside useFrame (never triggers React renders).
export const roomState = {
  stage: 0,
  pointer: { x: 0, y: 0, active: false },
  /** DOM speech bubble the robot positions over its head (lives outside the canvas). */
  bubble: null as HTMLDivElement | null,
};
