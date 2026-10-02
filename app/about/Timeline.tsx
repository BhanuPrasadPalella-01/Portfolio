"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../lib/gsap";

export type Milestone = { when: string; title: string; detail: string; href?: string };

// Pinned horizontal timeline: vertical scroll drives it sideways on wide screens.
export default function Timeline({ items }: { items: Milestone[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || window.innerWidth < 768) return;
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth + 80;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.8,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      gsap.fromTo(
        "[data-progress]",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } }
      );
      return () => tween.scrollTrigger?.kill();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="mt-40 overflow-hidden md:flex md:h-[100svh] md:flex-col md:justify-center">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-10">
        <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[-0.03em] text-ink">
          The <em className="text-accent italic">story</em> so far
        </h2>
        <div className="mt-8 hidden h-px bg-surface-border md:block">
          <div data-progress className="h-px origin-left bg-accent" />
        </div>
      </div>
      <div
        ref={track}
        className="mt-12 flex flex-col gap-6 px-5 sm:px-10 md:w-max md:flex-row md:gap-6 md:pr-[20vw] md:pl-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]"
      >
        {items.map((m, i) => (
          <article
            key={m.title}
            className="group relative flex shrink-0 flex-col justify-between rounded-[1.75rem] border border-surface-border bg-background p-7 transition-colors duration-500 hover:border-ink md:h-[46vh] md:w-[340px]"
          >
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">{m.when}</p>
              <h3 className="mt-4 font-display text-3xl leading-tight text-ink">{m.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">{m.detail}</p>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <span className="font-display text-6xl leading-none text-ink/10 transition-colors duration-500 group-hover:text-accent/40">
                {String(i + 1).padStart(2, "0")}
              </span>
              {m.href && (
                <a href={m.href} className="link-line font-mono text-[11px] tracking-[0.15em] text-ink uppercase">
                  Open →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
