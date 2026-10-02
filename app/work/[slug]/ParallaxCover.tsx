"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";

// Cover that unclips from the centre on load, then drifts slower than the page.
export default function ParallaxCover({ children }: { children: React.ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        frame.current,
        { clipPath: "inset(18% 22% 18% 22% round 2rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 2rem)", duration: 1.6, ease: "expo.inOut", delay: 0.3 }
      );
      gsap.fromTo(
        inner.current,
        { yPercent: -8, scale: 1.15 },
        {
          yPercent: 8,
          scale: 1.15,
          ease: "none",
          scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: frame }
  );

  return (
    <div ref={frame} className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] sm:aspect-[16/8]">
      <div ref={inner} className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
