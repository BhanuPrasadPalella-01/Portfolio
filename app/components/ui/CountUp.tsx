"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";

// Counts numeric values up when scrolled into view; scrambles in non-numeric ones.
export default function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (prefersReducedMotion()) return;
      const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
      const scrollTrigger = { trigger: el, start: "top 90%", once: true };

      if (!match) {
        gsap.from(el, {
          duration: 1.2,
          scrambleText: { text: value, chars: "01", speed: 0.4 },
          scrollTrigger,
        });
        return;
      }
      const target = parseFloat(match[1]);
      const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
      const suffix = match[2];
      const counter = { v: 0 };
      const format = (n: number) =>
        decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString("en-US");
      el.textContent = format(0) + suffix;
      gsap.to(counter, {
        v: target,
        duration: 1.8,
        ease: "expo.out",
        scrollTrigger,
        onUpdate: () => {
          el.textContent = format(counter.v) + suffix;
        },
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
    </span>
  );
}
