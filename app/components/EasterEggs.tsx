"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { emit, on, setParty, isParty } from "../lib/events";
import { sfx } from "../lib/sound";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

// Global secrets: the Konami code toggles party mode; typing "hello" makes the robot wave.
export default function EasterEggs() {
  const pathname = usePathname();
  const [party, setPartyState] = useState(false);

  useEffect(() => on("party", setPartyState), []);

  useEffect(() => {
    let konami = 0;
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      konami = key === KONAMI[konami] ? konami + 1 : key === KONAMI[0] ? 1 : 0;
      if (konami === KONAMI.length) {
        konami = 0;
        setParty(!isParty());
        sfx.party();
      }
      if (e.key.length === 1) {
        typed = (typed + key).slice(-5);
        if (typed === "hello") {
          emit("robot-wave", undefined);
          emit("robot-say", "Hello, human! 👋");
          sfx.beep();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Party mode only makes sense in the room.
  useEffect(() => {
    if (pathname !== "/" && isParty()) setParty(false);
  }, [pathname]);

  if (!party) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-[60] flex justify-center">
      <button
        type="button"
        onClick={() => setParty(false)}
        className="party-pill pointer-events-auto rounded-full px-5 py-2 font-mono text-xs tracking-[0.2em] text-white uppercase shadow-xl"
      >
        Party mode · click to stop
      </button>
    </div>
  );
}
