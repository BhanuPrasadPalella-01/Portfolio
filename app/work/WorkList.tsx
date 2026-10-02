"use client";

import { useLayoutEffect, useRef, useState } from "react";
import TransitionLink from "../components/transition/TransitionLink";
import ProjectCover from "../components/ProjectCover";
import { gsap, useGSAP } from "../lib/gsap";
import { TAGS, type Project, type Tag } from "../lib/projects";

type Filter = "All" | Tag;

// Filter tabs + big hoverable rows; a cover card follows the cursor and leans with its velocity.
export default function WorkList({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");

  const filters: Filter[] = ["All", ...TAGS.filter((t) => projects.some((p) => p.tags.includes(t)))];
  const shown = filter === "All" ? projects : projects.filter((p) => p.tags.includes(filter));

  // Slide the highlight pill under the selected tab.
  useLayoutEffect(() => {
    const btn = tabs.current?.querySelector<HTMLButtonElement>(`[data-filter="${filter}"]`);
    if (!btn || !pill.current) return;
    gsap.to(pill.current, {
      x: btn.offsetLeft,
      width: btn.offsetWidth,
      duration: 0.6,
      ease: "expo.out",
    });
  }, [filter]);

  // Re-stagger rows in whenever the filter changes.
  useGSAP(
    () => {
      gsap.fromTo(
        "[data-row]",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: "expo.out", stagger: 0.05 }
      );
    },
    { scope: root, dependencies: [filter] }
  );

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
      const i = projects.findIndex((p) => p.slug === active);
      if (i >= 0) gsap.to("[data-cover-track]", { yPercent: -100 * i, duration: 0.7, ease: "expo.inOut" });
    },
    { scope: root, dependencies: [active] }
  );

  return (
    <div ref={root} className="relative">
      <div ref={tabs} role="tablist" aria-label="Filter projects" className="relative mb-12 flex flex-wrap gap-1">
        <span ref={pill} aria-hidden="true" className="absolute top-0 left-0 hidden h-full rounded-full bg-ink sm:block" style={{ width: 0 }} />
        {filters.map((f) => {
          const count = f === "All" ? projects.length : projects.filter((p) => p.tags.includes(f)).length;
          const on = filter === f;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={on}
              data-filter={f}
              onClick={() => setFilter(f)}
              className={`relative z-10 rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 ${
                on ? "bg-ink text-background sm:bg-transparent" : "text-ink-soft hover:text-ink"
              }`}
            >
              {f} <sup className="ml-0.5 text-[9px] opacity-60">{count}</sup>
            </button>
          );
        })}
      </div>

      <ul className="dim-list border-t border-ink/15" onPointerLeave={() => setActive(null)}>
        {shown.map((p) => (
          <li
            key={p.slug}
            data-row
            className="dim-item border-b border-ink/15 transition-opacity duration-500"
            onPointerEnter={() => setActive(p.slug)}
          >
            <TransitionLink
              href={`/work/${p.slug}`}
              data-cursor="View"
              className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 py-8 sm:grid-cols-[4rem_1fr_auto] sm:py-10"
            >
              <span className="font-mono text-xs text-accent">{p.index}</span>
              <span className="font-display text-[clamp(2.1rem,5.5vw,5rem)] leading-none tracking-[-0.03em] text-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-4 group-hover:italic">
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
