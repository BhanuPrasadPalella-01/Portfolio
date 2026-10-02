"use client";

import { useEffect, useRef } from "react";

// Thin bronze bar along the top edge that fills as you read.
export default function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div ref={bar} aria-hidden="true" className="fixed inset-x-0 top-0 z-[61] h-[2px] origin-left bg-accent" style={{ transform: "scaleX(0)" }} />;
}
