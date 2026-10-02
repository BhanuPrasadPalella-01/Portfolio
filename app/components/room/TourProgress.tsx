"use client";

import { useEffect, useState } from "react";

// Fixed rail on the right showing where you are in the room tour.
export default function TourProgress({ stops }: { stops: string[] }) {
  const STOPS = stops;
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tour = document.getElementById("tour");
    if (!tour) return;
    const onScroll = () => {
      const rect = tour.getBoundingClientRect();
      const vh = window.innerHeight;
      setActive(Math.min(STOPS.length - 1, Math.max(0, Math.round(-rect.top / vh))));
      setVisible(rect.bottom > vh * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [STOPS.length]);

  return (
    <nav
      aria-label="Room tour"
      className={`fixed top-1/2 right-6 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 transition-opacity duration-500 lg:flex ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {STOPS.map((label, i) => (
        <a key={label} href={`#stage-${i}`} className="group flex items-center gap-3" aria-current={active === i ? "step" : undefined}>
          <span
            className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-500 ${
              active === i
                ? "translate-x-0 text-ink opacity-100"
                : "translate-x-2 text-ink-soft opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
            }`}
          >
            {label}
          </span>
          <span
            className={`block h-px transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              active === i ? "w-10 bg-accent" : "w-4 bg-ink/30 group-hover:w-6 group-hover:bg-ink"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
