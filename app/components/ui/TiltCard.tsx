"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";

// 3D tilt toward the cursor with a moving glare highlight.
export default function TiltCard({
  children,
  className = "",
  max = 10,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
      gsap.set(el, { transformPerspective: 900 });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry((px - 0.5) * max * 2);
        rx(-(py - 0.5) * max * 2);
        gsap.to(glare.current, {
          opacity: 1,
          background: `radial-gradient(420px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.55), transparent 55%)`,
          duration: 0.3,
        });
      };
      const leave = () => {
        rx(0);
        ry(0);
        gsap.to(glare.current, { opacity: 0, duration: 0.5 });
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`relative [transform-style:preserve-3d] ${className}`}>
      {children}
      <div
        ref={glare}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-soft-light"
      />
    </div>
  );
}
