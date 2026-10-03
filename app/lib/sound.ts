"use client";

import { useSyncExternalStore } from "react";

// Every sound is synthesised with Web Audio — no audio files to download.
// Off by default; the choice is remembered per visitor.

const KEY = "bp-sound";
let enabled = false;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambience: { stop: () => void } | null = null;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  try {
    enabled = localStorage.getItem(KEY) === "on";
  } catch {}
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, out: master! };
}

function tone(freq: number, dur: number, { type = "sine", gain = 0.12, to, delay = 0 }: { type?: OscillatorType; gain?: number; to?: number; delay?: number } = {}) {
  if (!enabled) return;
  const { ctx, out } = audio();
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function noise(dur: number, { gain = 0.08, from = 400, to = 4000 } = {}) {
  if (!enabled) return;
  const { ctx, out } = audio();
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.2;
  const t = ctx.currentTime;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + dur * 0.4);
  g.gain.linearRampToValueAtTime(0, t + dur);
  src.connect(filter).connect(g).connect(out);
  src.start(t);
}

function startAmbience() {
  if (ambience || !enabled) return;
  const { ctx, out } = audio();
  // Quiet room tone: low-passed brown noise plus a faint warm drone.
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 500;
  const g = ctx.createGain();
  g.gain.value = 0;
  g.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2);
  const drone = ctx.createOscillator();
  drone.frequency.value = 55;
  const dg = ctx.createGain();
  dg.gain.value = 0.012;
  src.connect(lp).connect(g).connect(out);
  drone.connect(dg).connect(out);
  src.start();
  drone.start();
  ambience = {
    stop: () => {
      const t = ctx.currentTime;
      g.gain.linearRampToValueAtTime(0, t + 0.4);
      dg.gain.linearRampToValueAtTime(0, t + 0.4);
      src.stop(t + 0.5);
      drone.stop(t + 0.5);
    },
  };
}

export const sfx = {
  tick: () => tone(1800, 0.04, { type: "triangle", gain: 0.035 }),
  click: () => tone(900, 0.06, { type: "square", gain: 0.03, to: 600 }),
  whoosh: () => noise(0.7, { gain: 0.12, from: 300, to: 3500 }),
  open: () => {
    tone(520, 0.12, { type: "triangle", gain: 0.06 });
    tone(780, 0.16, { type: "triangle", gain: 0.06, delay: 0.06 });
  },
  beep: () => {
    tone(880, 0.09, { type: "square", gain: 0.04 });
    tone(1320, 0.12, { type: "square", gain: 0.04, delay: 0.1 });
  },
  boop: () => tone(330, 0.25, { type: "sine", gain: 0.1, to: 180 }),
  party: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, { type: "triangle", gain: 0.07, delay: i * 0.09 })),
  type: () => tone(2200 + Math.random() * 600, 0.02, { type: "square", gain: 0.015 }),
  shatter: () => {
    noise(0.5, { gain: 0.22, from: 6000, to: 2500 });
    tone(140, 0.25, { type: "sine", gain: 0.12, to: 60 });
    for (let i = 0; i < 9; i++) {
      tone(2500 + Math.random() * 3500, 0.12 + Math.random() * 0.2, { type: "triangle", gain: 0.03, delay: 0.05 + Math.random() * 0.6 });
    }
  },
};

export function isSoundOn() {
  return enabled;
}

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  if (on) {
    startAmbience();
    sfx.open();
  } else if (ambience) {
    ambience.stop();
    ambience = null;
  }
  listeners.forEach((l) => l());
}

/** Starts the room tone after the first user gesture if sound was left on last visit. */
export function resumeSoundOnGesture() {
  if (!enabled) return;
  const go = () => {
    startAmbience();
    window.removeEventListener("pointerdown", go);
    window.removeEventListener("keydown", go);
  };
  window.addEventListener("pointerdown", go);
  window.addEventListener("keydown", go);
}

export function useSound() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => enabled,
    () => false
  );
}
