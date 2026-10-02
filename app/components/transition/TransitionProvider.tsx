"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, prefersReducedMotion } from "../../lib/gsap";
import { scrollToTop } from "../SmoothScroll";

type Navigate = (href: string, label?: string) => void;

const TransitionContext = createContext<Navigate>(() => {});

export function useNavigate() {
  return useContext(TransitionContext);
}

function labelFor(href: string) {
  const path = href.split("#")[0].split("?")[0];
  if (path === "/") return "Home";
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return last.replace(/-/g, " ");
}

// Two-panel curtain that wipes up, swaps the route underneath, then wipes away.
export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const busy = useRef(false);
  const [label, setLabel] = useState("");

  const navigate = useCallback<Navigate>(
    (href, explicitLabel) => {
      const targetPath = href.split("#")[0] || "/";
      if (busy.current || targetPath === pathname) {
        if (targetPath === pathname) scrollToTop();
        return;
      }
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      busy.current = true;
      setLabel(explicitLabel ?? labelFor(href));
      const panels = curtain.current!.querySelectorAll<HTMLElement>("[data-panel]");
      const text = curtain.current!.querySelector<HTMLElement>("[data-label]");
      gsap
        .timeline({
          onComplete: () => {
            covering.current = true;
            router.push(href);
          },
        })
        .set(curtain.current, { visibility: "visible" })
        .fromTo(
          panels,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.7, ease: "expo.inOut", stagger: 0.08 }
        )
        .fromTo(text, { yPercent: 120 }, { yPercent: 0, duration: 0.5, ease: "expo.out" }, "-=0.25");
    },
    [pathname, router]
  );

  useEffect(() => {
    if (!covering.current) return;
    covering.current = false;
    scrollToTop();
    const panels = curtain.current!.querySelectorAll<HTMLElement>("[data-panel]");
    const text = curtain.current!.querySelector<HTMLElement>("[data-label]");
    gsap
      .timeline({
        delay: 0.15,
        onComplete: () => {
          gsap.set(curtain.current, { visibility: "hidden" });
          busy.current = false;
        },
      })
      .to(text, { yPercent: -120, duration: 0.4, ease: "expo.in" })
      .to(panels, { yPercent: -100, duration: 0.8, ease: "expo.inOut", stagger: -0.08 }, "-=0.1");
  }, [pathname]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={curtain}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[150]"
      >
        <div data-panel className="absolute inset-0 bg-accent" />
        <div data-panel className="absolute inset-0 flex items-center justify-center bg-ink">
          <div className="overflow-hidden">
            <p
              data-label
              className="font-display text-5xl text-background capitalize italic sm:text-7xl"
            >
              {label}
            </p>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
