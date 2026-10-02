"use client";

import { THEME_KEY as KEY } from "./theme-script";
import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

function read(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "light");
}

type ViewTransitionDoc = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

/** Switches theme; when supported, the new theme grows as a circle from (x, y). */
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  const apply = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  };
  const doc = document as ViewTransitionDoc;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce || !origin) {
    apply();
    return;
  }
  const r = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y)
  );
  const root = document.documentElement.style;
  root.setProperty("--vt-x", `${origin.x}px`);
  root.setProperty("--vt-y", `${origin.y}px`);
  root.setProperty("--vt-r", `${r}px`);
  doc.startViewTransition(apply);
}
