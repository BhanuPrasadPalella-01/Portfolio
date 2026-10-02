"use client";

import { useEffect } from "react";
import { resumeSoundOnGesture, setSound, useSound } from "../lib/sound";

// Four equaliser bars that dance while sound is on.
export default function SoundToggle({ className = "" }: { className?: string }) {
  const on = useSound();
  useEffect(() => resumeSoundOnGesture(), []);

  return (
    <button
      type="button"
      onClick={() => setSound(!on)}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      aria-pressed={on}
      data-cursor={on ? "Mute" : "Sound"}
      className={`flex h-11 w-11 items-center justify-center gap-[3px] rounded-full border border-surface-border bg-background/70 backdrop-blur-xl transition-colors duration-300 hover:border-ink ${className}`}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="block w-[2px] rounded-full bg-ink"
          style={{
            height: on ? undefined : 3,
            animation: on ? `eq 0.9s ${i * 0.12}s ease-in-out infinite alternate` : "none",
          }}
        />
      ))}
    </button>
  );
}
