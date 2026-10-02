"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "../lib/gsap";

// Circular text badge that spins, and spins faster while you scroll.
export default function SpinningBadge({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const spin = gsap.to(ref.current, { rotation: 360, duration: 18, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      const st = ScrollTrigger.create({
        onUpdate(self) {
          const boost = Math.min(Math.abs(self.getVelocity()) / 200, 8);
          gsap.to(spin, { timeScale: 1 + boost, duration: 0.2, overwrite: true });
          gsap.to(spin, { timeScale: 1, duration: 1.5, delay: 0.2 });
        },
      });
      return () => st.kill();
    },
    { scope: ref }
  );

  const text = "AI & DATA SCIENCE ✦ AMRITA ✦ COIMBATORE ✦ ";

  return (
    <div className={`rounded-full bg-accent text-background shadow-xl ${className}`}>
      <svg ref={ref} viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <text fontSize="15.5" letterSpacing="3.2" fill="currentColor" fontFamily="var(--font-jetbrains-mono), monospace">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
        <text x="100" y="114" textAnchor="middle" fontSize="40" fill="currentColor" fontFamily="var(--font-fraunces), serif" fontStyle="italic">
          bp
        </text>
      </svg>
    </div>
  );
}
