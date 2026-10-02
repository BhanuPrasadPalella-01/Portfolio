"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "../../lib/gsap";
import { onReady } from "../../lib/ready";

type Tag = "h1" | "h2" | "h3" | "p" | "div" | "span";

// Masked line + character reveal. "load" waits for the preloader; "view" plays on scroll.
export default function SplitReveal({
  as: Tag = "h2",
  children,
  className = "",
  trigger = "view",
  delay = 0,
  by = "chars",
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  trigger?: "load" | "view";
  delay?: number;
  by?: "chars" | "words" | "lines";
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }
      let cleanup = () => {};
      const split = SplitText.create(el, {
        type: "lines,words,chars",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { autoAlpha: 1 });
          const targets = by === "chars" ? self.chars : by === "words" ? self.words : self.lines;
          const tween = gsap.from(targets, {
            yPercent: 120,
            rotate: by === "chars" ? 6 : 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: by === "chars" ? 0.018 : by === "words" ? 0.04 : 0.1,
            delay,
            paused: true,
            ...(trigger === "view"
              ? { scrollTrigger: { trigger: el, start: "top 88%", once: true } }
              : {}),
          });
          if (trigger === "view") tween.play();
          else cleanup = onReady(() => tween.play());
          return tween;
        },
      });
      return () => {
        cleanup();
        split.revert();
      };
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as never} className={`invisible ${className}`}>
      {children}
    </Tag>
  );
}
