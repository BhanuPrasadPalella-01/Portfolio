import * as THREE from "three";

// Procedural canvas textures: everything in the room is drawn in code, so the
// scene ships without image downloads.

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvasTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, rand: () => number) => void,
  { srgb = true, repeat }: { srgb?: boolean; repeat?: [number, number] } = {}
) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  draw(ctx, rng(w * 31 + h));
  const tex = new THREE.CanvasTexture(canvas);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(...repeat);
  }
  return tex;
}

function speckle(ctx: CanvasRenderingContext2D, rand: () => number, w: number, h: number, n: number, colors: string[], size = 2) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = colors[Math.floor(rand() * colors.length)];
    ctx.globalAlpha = 0.05 + rand() * 0.12;
    const s = size * (0.5 + rand());
    ctx.fillRect(rand() * w, rand() * h, s, s);
  }
  ctx.globalAlpha = 1;
}

function grain(ctx: CanvasRenderingContext2D, rand: () => number, x: number, y: number, w: number, h: number, dark: string) {
  ctx.strokeStyle = dark;
  for (let i = 0; i < h / 3; i++) {
    const yy = y + rand() * h;
    const amp = 1 + rand() * 3;
    const freq = 0.004 + rand() * 0.01;
    const phase = rand() * 10;
    ctx.globalAlpha = 0.04 + rand() * 0.1;
    ctx.lineWidth = 0.6 + rand() * 1.4;
    ctx.beginPath();
    for (let xx = x; xx <= x + w; xx += 8) {
      const yo = yy + Math.sin(xx * freq + phase) * amp;
      if (xx === x) ctx.moveTo(xx, yo);
      else ctx.lineTo(xx, yo);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/** Light oak floorboards with staggered joints. */
export function floorTexture() {
  return canvasTexture(1024, 1024, (ctx, rand) => {
    const rows = 9;
    const rh = 1024 / rows;
    const tones = ["#d8c3a2", "#d2ba96", "#ddc8a8", "#cfb590", "#d6bf9d"];
    for (let r = 0; r < rows; r++) {
      let x = -rand() * 400;
      while (x < 1024) {
        const len = 260 + rand() * 360;
        ctx.fillStyle = tones[Math.floor(rand() * tones.length)];
        ctx.fillRect(x, r * rh, len, rh);
        grain(ctx, rand, x, r * rh, len, rh, "#8a6a45");
        ctx.fillStyle = "rgba(70,50,30,0.35)";
        ctx.fillRect(x, r * rh, 2, rh);
        x += len;
      }
      ctx.fillStyle = "rgba(70,50,30,0.3)";
      ctx.fillRect(0, r * rh, 1024, 2);
    }
  });
}

/** Walnut-ish desk top grain. */
export function deskTexture() {
  return canvasTexture(1024, 512, (ctx, rand) => {
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "#c39565");
    g.addColorStop(0.5, "#b98a5a");
    g.addColorStop(1, "#c79b6c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 512);
    grain(ctx, rand, 0, 0, 1024, 512, "#6b4526");
    grain(ctx, rand, 0, 0, 1024, 512, "#8a5c34");
  });
}

/** Faint plaster mottling, multiplied over the wall colour. */
export function plasterTexture() {
  return canvasTexture(
    512,
    512,
    (ctx, rand) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 260; i++) {
        const r = 20 + rand() * 80;
        const x = rand() * 512;
        const y = rand() * 512;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(180,165,140,${0.008 + rand() * 0.016})`);
        g.addColorStop(1, "rgba(180,165,140,0)");
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      speckle(ctx, rand, 512, 512, 2500, ["#cfc3ad", "#ffffff"], 1.2);
    },
    { repeat: [2, 2] }
  );
}

/** Round woven rug (drawn in polar layout for a cylinder cap). */
export function rugTexture() {
  return canvasTexture(1024, 1024, (ctx, rand) => {
    const c = 512;
    ctx.fillStyle = "#efe4d0";
    ctx.fillRect(0, 0, 1024, 1024);
    const rings: [number, string, number][] = [
      [512, "#a7774a", 34],
      [470, "#efe4d0", 10],
      [452, "#c49a6c", 6],
      [300, "#e6d8bf", 3],
      [160, "#c49a6c", 4],
    ];
    rings.forEach(([r, col, w]) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.arc(c, c, r - w / 2, 0, Math.PI * 2);
      ctx.stroke();
    });
    // Woven texture
    for (let i = 0; i < 26000; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * 500;
      ctx.fillStyle = rand() > 0.5 ? "rgba(120,90,60,0.07)" : "rgba(255,255,255,0.12)";
      ctx.fillRect(c + Math.cos(a) * r, c + Math.sin(a) * r, 3, 1.5);
    }
    // Small diamond motifs
    ctx.fillStyle = "rgba(167,119,74,0.55)";
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2;
      const x = c + Math.cos(a) * 380;
      const y = c + Math.sin(a) * 380;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.PI / 4 + a);
      ctx.fillRect(-7, -7, 14, 14);
      ctx.restore();
    }
  });
}

/** Cork pinboard with Adaptive PSO rescue paths drawn on paper. */
export function corkTexture() {
  return canvasTexture(768, 576, (ctx, rand) => {
    ctx.fillStyle = "#b8895c";
    ctx.fillRect(0, 0, 768, 576);
    speckle(ctx, rand, 768, 576, 22000, ["#8c6038", "#d3a879", "#6d4a2b"], 3);
    // Paper sheet
    ctx.save();
    ctx.translate(384, 290);
    ctx.rotate(-0.025);
    ctx.fillStyle = "#fbf8f1";
    ctx.fillRect(-300, -220, 600, 440);
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    for (let i = -300; i <= 300; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, -220);
      ctx.lineTo(i, 220);
      ctx.stroke();
    }
    for (let j = -220; j <= 220; j += 40) {
      ctx.beginPath();
      ctx.moveTo(-300, j);
      ctx.lineTo(300, j);
      ctx.stroke();
    }
    // Obstacles
    ctx.fillStyle = "#cfcfcf";
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;
    [
      [-120, 60, 40],
      [10, -70, 34],
      [120, 40, 42],
      [-30, 150, 30],
    ].forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
    // Robot paths to the victim
    const victim = [230, -150];
    const paths: [string, number[][]][] = [
      ["#2f6fb5", [[-250, 170], [-200, 20], [-150, -90], [40, -165], [230, -150]]],
      ["#d0702b", [[-60, 200], [60, 110], [190, -10], [230, -150]]],
      ["#c9a227", [[250, 190], [260, 60], [235, -60], [230, -150]]],
    ];
    paths.forEach(([col, pts]) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
      ctx.fillStyle = "#1d2a6b";
      ctx.beginPath();
      ctx.arc(pts[0][0], pts[0][1], 9, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#d62828";
    ctx.font = "bold 44px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✱", victim[0], victim[1] + 15);
    ctx.fillStyle = "#1d2026";
    ctx.font = "italic 26px Georgia, serif";
    ctx.textAlign = "left";
    ctx.fillText("Adaptive PSO — rescue paths", -285, -185);
    ctx.restore();
    // Sticky note
    ctx.save();
    ctx.translate(640, 470);
    ctx.rotate(0.08);
    ctx.fillStyle = "#f2d06b";
    ctx.fillRect(-70, -60, 140, 120);
    ctx.fillStyle = "#3b2f12";
    ctx.font = "20px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("w(t), c₁(t)", 0, -10);
    ctx.fillText("c₂(t) ↻", 0, 22);
    ctx.restore();
  });
}

/** Floor mat for the swarm arena: taped border, grid, obstacle dots. */
export function arenaTexture() {
  return canvasTexture(1024, 1024, (ctx, rand) => {
    ctx.fillStyle = "#2b2e35";
    ctx.fillRect(0, 0, 1024, 1024);
    speckle(ctx, rand, 1024, 1024, 12000, ["#3a3e47", "#22252b"], 2);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 2;
    for (let i = 64; i < 1024; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1024);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1024, i);
      ctx.stroke();
    }
    ctx.strokeStyle = "#e3c35a";
    ctx.lineWidth = 22;
    ctx.setLineDash([60, 26]);
    ctx.strokeRect(24, 24, 976, 976);
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "bold 40px monospace";
    ctx.fillText("SWARM · AMS", 70, 110);
  });
}

/** Mandelbrot set in ink and bronze — the FractalLab print. */
export function fractalTexture() {
  const W = 560;
  const H = 400;
  return canvasTexture(W, H, (ctx) => {
    const img = ctx.createImageData(W, H);
    const maxIter = 90;
    const cx = -0.65;
    const cy = 0;
    const scale = 3.1 / W;
    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const x0 = cx + (px - W / 2) * scale;
        const y0 = cy + (py - H / 2) * scale;
        let x = 0;
        let y = 0;
        let i = 0;
        while (x * x + y * y <= 4 && i < maxIter) {
          const xt = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xt;
          i++;
        }
        const o = (py * W + px) * 4;
        if (i === maxIter) {
          img.data[o] = 22;
          img.data[o + 1] = 24;
          img.data[o + 2] = 29;
        } else {
          const t = Math.sqrt(i / maxIter);
          img.data[o] = 244 - t * (244 - 138) + Math.sin(t * 9) * 20;
          img.data[o + 1] = 240 - t * (240 - 92);
          img.data[o + 2] = 232 - t * (232 - 44);
        }
        img.data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
}

/** Window view: day sky or a starry night. */
export function skyTexture(night: boolean) {
  return canvasTexture(512, 384, (ctx, rand) => {
    const g = ctx.createLinearGradient(0, 0, 0, 384);
    if (night) {
      g.addColorStop(0, "#0b1430");
      g.addColorStop(1, "#283a63");
    } else {
      g.addColorStop(0, "#bcd7ea");
      g.addColorStop(1, "#f6ead4");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 384);
    if (night) {
      for (let i = 0; i < 140; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + rand() * 0.7})`;
        const s = rand() * 1.8 + 0.4;
        ctx.fillRect(rand() * 512, rand() * 300, s, s);
      }
      ctx.fillStyle = "#f3ecd6";
      ctx.beginPath();
      ctx.arc(390, 90, 30, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      [
        [120, 110, 60],
        [180, 100, 44],
        [380, 160, 70],
      ].forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    // Distant skyline
    ctx.fillStyle = night ? "#121a33" : "#9fb0bd";
    let x = 0;
    while (x < 512) {
      const w = 30 + rand() * 50;
      const h = 40 + rand() * 90;
      ctx.fillRect(x, 384 - h, w, h);
      if (night) {
        ctx.fillStyle = "rgba(255,210,140,0.8)";
        for (let k = 0; k < 6; k++) ctx.fillRect(x + 6 + rand() * (w - 12), 384 - h + 10 + rand() * (h - 20), 3, 4);
        ctx.fillStyle = "#121a33";
      }
      x += w + 4;
    }
  });
}

/** Subtle woven fabric for upholstery. */
export function fabricTexture() {
  return canvasTexture(
    256,
    256,
    (ctx) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y += 4) {
        for (let x = 0; x < 256; x += 4) {
          ctx.fillStyle = (x + y) % 8 === 0 ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.02)";
          ctx.fillRect(x, y, 3, 3);
        }
      }
    },
    { repeat: [3, 3] }
  );
}

/** Soft elliptical shadow painted under the floating room. */
export function dropShadowTexture() {
  return canvasTexture(
    512,
    512,
    (ctx) => {
      const g = ctx.createRadialGradient(256, 256, 60, 256, 256, 256);
      g.addColorStop(0, "rgba(40,28,16,0.55)");
      g.addColorStop(0.55, "rgba(40,28,16,0.25)");
      g.addColorStop(1, "rgba(40,28,16,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 512);
    },
    { srgb: true }
  );
}
