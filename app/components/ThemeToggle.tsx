"use client";

import { setTheme, useTheme } from "../lib/theme";

// Sun ↔ moon morph. The new theme spreads out from the button as a circle.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      data-cursor={dark ? "Day" : "Night"}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(dark ? "light" : "dark", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className={`group relative flex h-11 w-11 items-center justify-center rounded-full border border-surface-border bg-background/70 text-ink backdrop-blur-xl transition-colors duration-300 hover:border-ink ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] overflow-visible" aria-hidden="true">
        <mask id="theme-moon-cut">
          <rect x="-4" y="-4" width="32" height="32" fill="white" />
          <circle
            cx={dark ? 17 : 30}
            cy={dark ? 7 : 0}
            r="6"
            fill="black"
            style={{ transition: "cx 0.6s cubic-bezier(0.16,1,0.3,1), cy 0.6s cubic-bezier(0.16,1,0.3,1)" }}
          />
        </mask>
        <circle
          cx="12"
          cy="12"
          r={dark ? 8 : 5}
          fill="currentColor"
          mask="url(#theme-moon-cut)"
          style={{ transition: "r 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <g
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{
            transformOrigin: "12px 12px",
            transform: dark ? "rotate(-90deg) scale(0)" : "rotate(0) scale(1)",
            transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="1.5" x2="12" y2="3.5" transform={`rotate(${a} 12 12)`} />
          ))}
        </g>
      </svg>
    </button>
  );
}
