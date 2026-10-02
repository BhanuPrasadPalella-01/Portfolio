"use client";

import { useRef } from "react";
import { gsap } from "../../lib/gsap";

// Text that scrambles and resolves when its parent link/button is hovered.
export default function Scramble({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  const run = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      duration: 0.7,
      scrambleText: { text, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ#/_<>*", speed: 0.6, revealDelay: 0.1 },
      overwrite: true,
    });
  };

  return (
    <span ref={ref} onPointerEnter={run} className={`inline-block whitespace-nowrap ${className}`}>
      {text}
    </span>
  );
}
