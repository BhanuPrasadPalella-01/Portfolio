"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { roomState } from "./config";

const RoomCanvas = dynamic(() => import("./RoomCanvas"), { ssr: false });

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Fixed full-screen 3D room behind the home-page tour.
export default function RoomExperience() {
  const [env, setEnv] = useState<{ reduced: boolean; mobile: boolean } | null>(null);
  const bubble = useRef<HTMLDivElement>(null);

  useEffect(() => {
    roomState.bubble = bubble.current;
    return () => {
      roomState.bubble = null;
    };
  }, [env]);

  useEffect(() => {
    if (!hasWebGL()) return;
    setEnv({
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      mobile: !window.matchMedia("(pointer: fine)").matches || window.innerWidth < 768,
    });

    // The canvas sits under HTML panels, so track the pointer on the window.
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      roomState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      roomState.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      roomState.pointer.active = true;
    };
    const leave = () => {
      roomState.pointer.active = false;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      roomState.pointer.active = false;
    };
  }, []);

  if (!env) return null;

  return (
    <>
      <div className="fixed inset-0 z-0">
        <RoomCanvas reduced={env.reduced} mobile={env.mobile} />
      </div>
      <div
        ref={bubble}
        data-show="false"
        aria-live="polite"
        className="group pointer-events-none fixed top-0 left-0 z-[5]"
      >
        <div className="-translate-x-1/2 -translate-y-full">
          <span
            data-text
            className="block rounded-2xl rounded-bl-sm bg-ink px-4 py-2.5 font-mono text-[13px] whitespace-nowrap text-background shadow-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[show=false]:translate-y-2 group-data-[show=false]:scale-90 group-data-[show=false]:opacity-0"
          />
        </div>
      </div>
    </>
  );
}
