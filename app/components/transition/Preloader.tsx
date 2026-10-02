"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { markReady } from "../../lib/ready";

// Counter + name on first load, then the panel lifts away.
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDone(true);
      markReady();
      return;
    }
    document.documentElement.classList.add("is-loading");
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.classList.remove("is-loading");
            setDone(true);
          },
        })
        .fromTo(
          "[data-pre-char]",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.03 }
        )
        .to(
          counter,
          {
            v: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => setCount(Math.round(counter.v)),
          },
          0
        )
        .to("[data-pre-bar]", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
        .to("[data-pre-inner]", { yPercent: -30, opacity: 0, duration: 0.6, ease: "expo.in" }, "+=0.15")
        .add(() => markReady(), "-=0.1")
        .to(root.current, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.2");
    }, root);
    return () => {
      ctx.revert();
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (done) return null;

  const name = "Bhanu Prasad Palella";

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[180] flex flex-col justify-between bg-background px-6 py-8 sm:px-12 sm:py-10"
    >
      <div data-pre-inner className="flex h-full flex-col justify-between">
        <div className="flex justify-between font-mono text-[11px] tracking-[0.25em] text-ink-soft uppercase">
          <span>Portfolio ©2026</span>
          <span>AI &amp; Data Science</span>
        </div>

        <div>
          <p className="overflow-hidden font-display text-[clamp(2.5rem,9vw,8rem)] leading-none tracking-tight text-ink">
            {name.split("").map((ch, i) => (
              <span
                key={i}
                data-pre-char
                className="inline-block whitespace-pre"
                style={{ transform: "translateY(110%)" }}
              >
                {ch}
              </span>
            ))}
          </p>
          <div className="mt-8 flex items-end justify-between gap-6">
            <div className="h-px flex-1 bg-surface-border">
              <div data-pre-bar className="h-px origin-left scale-x-0 bg-ink" />
            </div>
            <span className="font-display text-6xl leading-none text-accent tabular-nums sm:text-8xl">
              {String(count).padStart(3, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
