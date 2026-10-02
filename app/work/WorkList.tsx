"use client";

import { useRef, useState } from "react";
import TransitionLink from "../components/transition/TransitionLink";
import ProjectCover from "../components/ProjectCover";
import { gsap, useGSAP } from "../lib/gsap";
import type { Project } from "../lib/projects";

// Big hoverable rows; a cover card follows the cursor and leans with its velocity.
export default function WorkList({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = preview.current!;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3" });
      const rTo = gsap.quickTo(el, "rotation", { duration: 0.6, ease: "power3" });
      let lastX = 0;
      const move = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        rTo(gsap.utils.clamp(-14, 14, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
      };
      window.addEventListener("pointermove", move, { passive: true });
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root }
  );

  useGSAP(
    () => {
      gsap.to(preview.current, {
        scale: active === null ? 0 : 1,
        autoAlpha: active === null ? 0 : 1,
        duration: 0.6,
        ease: "expo.out",
      });
      if (active !== null) {
        gsap.to("[data-cover-track]", { yPercent: -100 * active, duration: 0.7, ease: "expo.inOut" });
      }
    },
    { scope: root, dependencies: [active] }
  );

  return (
    <div ref={root} className="relative">
      <ul className="dim-list border-t border-ink/15" onPointerLeave={() => setActive(null)}>
        {projects.map((p, i) => (
          <li key={p.slug} className="dim-item border-b border-ink/15 transition-opacity duration-500" onPointerEnter={() => setActive(i)}>
            <TransitionLink
              href={`/work/${p.slug}`}
              data-cursor="View"
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 py-8 sm:grid-cols-[4rem_1fr_auto] sm:py-10"
            >
              <span className="font-mono text-xs text-accent">{p.index}</span>
              <span className="font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-none tracking-[-0.03em] text-ink transition-[transform,font-style] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:italic">
                {p.title}
              </span>
              <span className="col-start-2 flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[0.15em] text-ink-soft uppercase sm:col-start-3 sm:justify-end">
                <span>{p.category}</span>
                <span className="rounded-full border border-ink/15 px-2.5 py-1">{p.status}</span>
              </span>
              <div className="col-span-full mt-4 overflow-hidden rounded-2xl sm:hidden">
                <ProjectCover slug={p.slug} className="aspect-[4/3] w-full" />
              </div>
            </TransitionLink>
          </li>
        ))}
      </ul>

      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-40 hidden h-[260px] w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl opacity-0 shadow-[0_40px_80px_-30px_rgba(22,24,29,0.5)] sm:block"
        style={{ transform: "scale(0)" }}
      >
        <div data-cover-track className="h-full">
          {projects.map((p) => (
            <ProjectCover key={p.slug} slug={p.slug} className="block h-full w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
