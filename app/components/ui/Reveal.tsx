"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/gsap";
import { onReady } from "../../lib/ready";

// Fade + rise for blocks. Children marked [data-reveal-item] stagger in.
export default function Reveal({
  children,
  className = "",
  delay = 0,
  trigger = "view",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  trigger?: "load" | "view";
  as?: "div" | "section" | "ul" | "li";
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (prefersReducedMotion()) return;
      const items = el.querySelectorAll("[data-reveal-item]");
      const targets = items.length ? items : el;
      const tween = gsap.from(targets, {
        y: 48,
        autoAlpha: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.08,
        delay,
        paused: true,
        ...(trigger === "view" ? { scrollTrigger: { trigger: el, start: "top 90%", once: true } } : {}),
      });
      if (trigger === "view") {
        tween.play();
        return;
      }
      return onReady(() => tween.play());
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
