"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useNavigate } from "./transition/TransitionProvider";
import { projects } from "../lib/projects";
import { navLinks, site } from "../lib/site";
import { setTheme } from "../lib/theme";
import { isSoundOn, setSound, sfx } from "../lib/sound";
import { isParty, on, setParty } from "../lib/events";
import { gsap } from "../lib/gsap";

type Item = {
  id: string;
  label: string;
  hint: string;
  group: "Pages" | "Projects" | "Actions" | "Elsewhere";
  keywords?: string;
  run: () => void;
};

// Simple fuzzy score: every query character must appear in order; tighter runs score higher.
function score(text: string, q: string) {
  if (!q) return 1;
  const t = text.toLowerCase();
  let ti = 0;
  let s = 0;
  let streak = 0;
  for (const ch of q.toLowerCase()) {
    const at = t.indexOf(ch, ti);
    if (at < 0) return 0;
    streak = at === ti ? streak + 1 : 0;
    s += 1 + streak * 2 + (at === 0 ? 3 : 0);
    ti = at + 1;
  }
  return s;
}

export default function CommandPalette() {
  const navigate = useNavigate();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursorIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const items: Item[] = useMemo(
    () => [
      ...navLinks.map((l) => ({
        id: `page-${l.href}`,
        label: l.label,
        hint: l.href,
        group: "Pages" as const,
        run: () => navigate(l.href),
      })),
      { id: "page-resume", label: "Resume", hint: "/resume", group: "Pages", keywords: "cv", run: () => navigate("/resume") },
      { id: "page-notes", label: "Notes", hint: "/notes", group: "Pages", keywords: "blog writing", run: () => navigate("/notes") },
      ...projects.map((p) => ({
        id: `project-${p.slug}`,
        label: p.title,
        hint: p.category,
        group: "Projects" as const,
        keywords: `${p.tags.join(" ")} ${p.tech.join(" ")}`,
        run: () => navigate(`/work/${p.slug}`),
      })),
      {
        id: "theme",
        label: "Toggle light / dark",
        hint: "Theme",
        group: "Actions",
        keywords: "night day mode",
        run: () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", { x: innerWidth / 2, y: innerHeight / 2 }),
      },
      {
        id: "sound",
        label: "Toggle sound",
        hint: "Audio",
        group: "Actions",
        keywords: "mute music",
        run: () => setSound(!isSoundOn()),
      },
      {
        id: "copy",
        label: "Copy email address",
        hint: site.email,
        group: "Actions",
        keywords: "contact mail",
        run: () => {
          void navigator.clipboard?.writeText(site.email);
          flash("Email copied");
        },
      },
      {
        id: "party",
        label: "Party mode",
        hint: "↑↑↓↓←→←→BA",
        group: "Actions",
        keywords: "disco konami secret",
        run: () => {
          if (pathname !== "/") navigate("/");
          setParty(!isParty());
        },
      },
      {
        id: "github",
        label: "GitHub",
        hint: "BhanuPrasadPalella-01",
        group: "Elsewhere",
        run: () => window.open(site.github, "_blank", "noopener"),
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: "in/bhanuprasadpalella",
        group: "Elsewhere",
        run: () => window.open(site.linkedin, "_blank", "noopener"),
      },
    ],
    [navigate, pathname]
  );

  const results = useMemo(() => {
    return items
      .map((it) => ({ it, s: Math.max(score(it.label, query) * 2, score(`${it.hint} ${it.keywords ?? ""}`, query)) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => (query ? b.s - a.s : 0))
      // Drop scattered-letter matches that score far below the best hit.
      .filter((r, _, all) => !query || r.s >= all[0].s * 0.45)
      .map((r) => r.it);
  }, [items, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    const off = on("palette-open", () => setOpen(true));
    return () => {
      window.removeEventListener("keydown", onKey);
      off();
    };
  }, []);

  useEffect(() => {
    if (!panel.current) return;
    if (open) {
      sfx.open();
      setQuery("");
      setCursorIndex(0);
      gsap.set(panel.current, { display: "flex" });
      gsap.fromTo(panel.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
      gsap.fromTo(
        panel.current.querySelector("[data-box]"),
        { y: -20, scale: 0.96 },
        { y: 0, scale: 1, duration: 0.5, ease: "expo.out" }
      );
      requestAnimationFrame(() => input.current?.focus());
    } else {
      gsap.to(panel.current, {
        autoAlpha: 0,
        duration: 0.2,
        onComplete: () => void gsap.set(panel.current, { display: "none" }),
      });
    }
  }, [open]);

  const choose = (it: Item | undefined) => {
    if (!it) return;
    sfx.click();
    setOpen(false);
    window.setTimeout(it.run, 120);
  };

  let lastGroup = "";

  return (
    <>
      <div
        ref={panel}
        className="fixed inset-0 z-[170] hidden items-start justify-center bg-night/40 px-4 pt-[14vh] backdrop-blur-sm"
        style={{ opacity: 0 }}
        onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div
          data-box
          className="w-full max-w-xl overflow-hidden rounded-2xl border border-surface-border bg-background shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center gap-3 border-b border-surface-border px-5">
            <span className="font-mono text-xs text-accent">⌘K</span>
            <input
              ref={input}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCursorIndex(0);
                sfx.type();
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setCursorIndex((c) => Math.min(c + 1, results.length - 1));
                  sfx.tick();
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setCursorIndex((c) => Math.max(c - 1, 0));
                  sfx.tick();
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  choose(results[cursor]);
                }
              }}
              placeholder="Search projects, pages, actions"
              aria-label="Search"
              className="h-14 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-soft"
            />
            <kbd className="rounded border border-surface-border px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">esc</kbd>
          </div>
          <ul className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
            {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-ink-soft">No matches. Try “robot” or “dark”.</li>}
            {results.map((it, i) => {
              const header = it.group !== lastGroup ? it.group : null;
              lastGroup = it.group;
              return (
                <li key={it.id}>
                  {header && (
                    <p className="px-3 pt-3 pb-1 font-mono text-[10px] tracking-[0.2em] text-ink-soft uppercase">{header}</p>
                  )}
                  <button
                    type="button"
                    onPointerEnter={() => setCursorIndex(i)}
                    onClick={() => choose(it)}
                    className={`flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      i === cursor ? "bg-ink text-background" : "text-ink"
                    }`}
                  >
                    <span className="truncate">{it.label}</span>
                    <span className={`truncate font-mono text-[11px] ${i === cursor ? "text-background/70" : "text-ink-soft"}`}>{it.hint}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="flex justify-between border-t border-surface-border px-5 py-2.5 font-mono text-[10px] text-ink-soft">
            <span>↑↓ navigate · ↵ open</span>
            <span>{results.length} results</span>
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-8 left-1/2 z-[175] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 font-mono text-xs text-background shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
