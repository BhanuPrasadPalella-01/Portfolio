"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import TransitionLink from "./transition/TransitionLink";
import Magnetic from "./ui/Magnetic";
import Scramble from "./ui/Scramble";
import { navLinks, site } from "../lib/site";
import { gsap } from "../lib/gsap";

function useLocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Nav() {
  const pathname = usePathname();
  const time = useLocalTime();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 120 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!menu.current) return;
    const links = menu.current.querySelectorAll("[data-menu-link]");
    if (open) {
      gsap
        .timeline()
        .set(menu.current, { visibility: "visible" })
        .fromTo(menu.current, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" })
        .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 }, "-=0.4");
    } else {
      gsap
        .timeline()
        .to(menu.current, { clipPath: "circle(0% at 100% 0%)", duration: 0.6, ease: "expo.inOut" })
        .set(menu.current, { visibility: "hidden" });
    }
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hidden && !open ? "-translate-y-full" : ""
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-5 sm:px-10">
          <TransitionLink href="/" className="group flex items-center gap-3" aria-label="Home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm text-background italic transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[360deg]">
              bp
            </span>
            <span className="hidden font-display text-lg leading-none text-ink md:block">
              {site.short}
              <span className="text-accent">.</span>
            </span>
          </TransitionLink>

          <nav className="hidden items-center gap-1 rounded-full border border-surface-border bg-background/70 p-1 backdrop-blur-xl md:flex">
            {navLinks.map((l) => (
              <TransitionLink
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                  isActive(l.href) ? "bg-ink text-background" : "text-ink-soft hover:text-ink"
                }`}
              >
                <Scramble text={l.label} />
              </TransitionLink>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <span className="hidden font-mono text-[11px] tracking-[0.15em] text-ink-soft lg:block">
              COIMBATORE · {time} IST
            </span>
            <Magnetic className="hidden md:inline-block">
              <TransitionLink
                href="/contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background"
              >
                <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                <span data-magnetic-inner className="relative flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-background" />
                  Let&apos;s talk
                </span>
              </TransitionLink>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-[70] flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full bg-ink md:hidden"
            >
              <span className={`h-px w-5 bg-background transition-transform duration-500 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-background transition-transform duration-500 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menu}
        className="invisible fixed inset-0 z-[65] flex flex-col justify-between bg-ink px-6 pt-28 pb-10 md:hidden"
        style={{ clipPath: "circle(0% at 100% 0%)" }}
      >
        <ul className="space-y-2">
          {navLinks.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <div data-menu-link>
                <TransitionLink
                  href={l.href}
                  className={`flex items-baseline gap-4 font-display text-6xl ${
                    isActive(l.href) ? "text-accent italic" : "text-background"
                  }`}
                >
                  <span className="font-mono text-xs text-background/50">0{i + 1}</span>
                  {l.label}
                </TransitionLink>
              </div>
            </li>
          ))}
        </ul>
        <div className="space-y-2 font-mono text-xs text-background/60">
          <a href={`mailto:${site.email}`} className="block text-background">
            {site.email}
          </a>
          <p>COIMBATORE · {time} IST</p>
        </div>
      </div>
    </>
  );
}
