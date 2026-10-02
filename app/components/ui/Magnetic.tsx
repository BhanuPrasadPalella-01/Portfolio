"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";

// Pulls its child toward the cursor; the [data-magnetic-inner] part travels further.
export default function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3" }) : null;
      const iyTo = inner ? gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3" }) : null;

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        xTo(x * strength);
        yTo(y * strength);
        ixTo?.(x * strength * 0.5);
        iyTo?.(y * strength * 0.5);
      };
      const leave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
        if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
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
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
