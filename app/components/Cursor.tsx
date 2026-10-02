"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { setCursor, subscribeCursor, type CursorState } from "../lib/cursor";

// Blend-mode dot that inverts what it passes over, grows on links, and turns
// into a labelled disc over [data-cursor="Label"] elements and 3D objects.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<CursorState>({ variant: "default", label: null });
  const dot = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(fine.matches);
    update();
    fine.addEventListener("change", update);
    return () => fine.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor");

    // Dot is pinned to the pointer with no easing; the ring trails just slightly.
    const dotEl = dot.current!;
    const lx = gsap.quickTo(disc.current, "x", { duration: 0.18, ease: "power2.out" });
    const ly = gsap.quickTo(disc.current, "y", { duration: 0.18, ease: "power2.out" });

    const onMove = (e: PointerEvent) => {
      dotEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      lx(e.clientX);
      ly(e.clientY);
    };

    const onOver = (e: Event) => {
      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setCursor("dom", { variant: "label", label: labelled.dataset.cursor ?? null });
        return;
      }
      if (target?.closest("a, button, [role='button'], input, textarea")) {
        setCursor("dom", { variant: "hover", label: null });
        return;
      }
      setCursor("dom", null);
    };

    const onLeaveWindow = () => gsap.to([dot.current, disc.current], { opacity: 0, duration: 0.2 });
    const onEnterWindow = () => gsap.to([dot.current, disc.current], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    document.documentElement.addEventListener("pointerenter", onEnterWindow);
    const unsubscribe = subscribeCursor(setState);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      document.documentElement.removeEventListener("pointerenter", onEnterWindow);
      unsubscribe();
    };
  }, [enabled]);

  if (!enabled) return null;

  const isLabel = state.variant === "label";
  const isHover = state.variant === "hover";

  return (
    <>
      <div
        ref={disc}
        aria-hidden="true"
        // Blend mode must sit on the fixed element: it's the stacking context.
        className={`pointer-events-none fixed top-0 left-0 z-[200] will-change-transform ${isHover ? "mix-blend-difference" : ""}`}
        style={{ transform: "translate(-100px, -100px)" }}
      >
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLabel
              ? "h-24 w-24 bg-ink"
              : isHover
                ? "h-16 w-16 border border-transparent bg-white"
                : "h-9 w-9 border border-ink/40"
          }`}
        >
          <span
            className={`font-mono text-[10px] tracking-[0.18em] text-background uppercase transition-opacity duration-300 ${
              isLabel ? "opacity-100" : "opacity-0"
            }`}
          >
            {state.label}
          </span>
        </div>
      </div>
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[201] will-change-transform"
        style={{ transform: "translate(-100px, -100px)" }}
      >
        <div
          className={`h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink transition-opacity duration-300 ${
            isLabel || isHover ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
    </>
  );
}
