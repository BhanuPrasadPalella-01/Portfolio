import * as THREE from "three";
import { C } from "./config";

function displayFont() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-fraunces").trim();
  return v || "Georgia, serif";
}

function monoFont() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains-mono").trim();
  return v || "monospace";
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function makeTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const paint = () => {
    ctx.clearRect(0, 0, width, height);
    draw(ctx);
    texture.needsUpdate = true;
  };
  paint();
  // Repaint once web fonts are ready so text uses the site typefaces.
  document.fonts?.ready.then(paint);
  return texture;
}

// VaultSphere dashboard on the laptop screen.
export function laptopScreenTexture() {
  return makeTexture(1024, 640, (ctx) => {
    ctx.fillStyle = "#16181d";
    ctx.fillRect(0, 0, 1024, 640);
    ctx.fillStyle = "#1f2229";
    roundRect(ctx, 24, 24, 200, 592, 16);
    ctx.fillStyle = C.paper;
    ctx.font = `600 34px ${displayFont()}`;
    ctx.fillText("VaultSphere", 48, 78);
    ["Projects", "Files", "Certificates", "Teams", "Analytics"].forEach((label, i) => {
      ctx.fillStyle = i === 0 ? C.bronze : "transparent";
      roundRect(ctx, 40, 116 + i * 52, 168, 40, 10);
      ctx.fillStyle = i === 0 ? C.paper : "#8c909a";
      ctx.font = `20px ${monoFont()}`;
      ctx.fillText(label, 58, 143 + i * 52);
    });
    ctx.fillStyle = C.paper;
    ctx.font = `44px ${displayFont()}`;
    ctx.fillText("Good evening, Bhanu", 256, 86);
    ctx.fillStyle = "#8c909a";
    ctx.font = `20px ${monoFont()}`;
    ctx.fillText("12 projects · 3 teams · AI insights ready", 258, 122);
    [0, 1, 2].forEach((i) => {
      const x = 256 + i * 248;
      ctx.fillStyle = "#1f2229";
      roundRect(ctx, x, 156, 232, 150, 14);
      ctx.fillStyle = i === 0 ? C.bronze : "#2c3038";
      roundRect(ctx, x + 20, 176, 48, 48, 10);
      ctx.fillStyle = C.paper;
      ctx.font = `36px ${displayFont()}`;
      ctx.fillText(["128", "24", "8"][i], x + 20, 270);
      ctx.fillStyle = "#8c909a";
      ctx.font = `16px ${monoFont()}`;
      ctx.fillText(["files analysed", "certificates", "collaborators"][i], x + 20, 292);
    });
    ctx.fillStyle = "#1f2229";
    roundRect(ctx, 256, 326, 728, 290, 14);
    ctx.strokeStyle = C.bronzeLight;
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    const pts = [380, 360, 400, 330, 350, 300, 320, 280, 300, 260, 290];
    pts.forEach((y, i) => {
      const x = 290 + i * 66;
      if (i === 0) ctx.moveTo(x, y + 180);
      else ctx.lineTo(x, y + 180);
    });
    ctx.stroke();
  });
}

// Graph + notes on the whiteboard. Node positions are shared with the 3D nodes.
export const BOARD_NODES: [number, number][] = [
  [0.42, 0.52],
  [0.62, 0.3],
  [0.24, 0.28],
  [0.66, 0.72],
  [0.2, 0.74],
  [0.43, 0.16],
  [0.45, 0.88],
];
export const BOARD_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 5], [5, 2], [2, 4], [4, 6], [6, 3], [3, 1],
];

export function whiteboardTexture() {
  const W = 1024;
  const H = 660;
  return makeTexture(W, H, (ctx) => {
    ctx.fillStyle = "#fbfaf6";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#2b3140";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    BOARD_EDGES.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(BOARD_NODES[a][0] * W, BOARD_NODES[a][1] * H);
      ctx.lineTo(BOARD_NODES[b][0] * W, BOARD_NODES[b][1] * H);
      ctx.stroke();
    });
    ctx.fillStyle = "#2b3140";
    ctx.font = `italic 46px ${displayFont()}`;
    ctx.fillText("GNN + RL scheduler", 560, 90);
    ctx.font = `26px ${monoFont()}`;
    ctx.fillStyle = C.bronze;
    ctx.fillText("AoCI  ↑ 8.4%", 740, 470);
    ctx.fillText("error ↓ 44%", 740, 512);
    ctx.fillStyle = "#2b3140";
    ctx.fillText("r = −Σ AoIᵢ − λ·starve", 690, 590);
    ctx.strokeStyle = C.bronze;
    ctx.lineWidth = 3;
    ctx.strokeRect(720, 436, 230, 96);
  });
}
