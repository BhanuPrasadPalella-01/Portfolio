"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { roomState } from "./room/config";

const Canvas3D = dynamic(() => import("./LostCanvas"), { ssr: false });

// 404 backdrop: RescueBot wandering a dark floor with a flashlight.
export default function LostScene() {
  const [ok, setOk] = useState(false);
  const bubble = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {}
  }, []);

  useEffect(() => {
    roomState.bubble = bubble.current;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      roomState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      roomState.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      roomState.pointer.active = true;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      roomState.bubble = null;
      roomState.pointer.active = false;
    };
  }, [ok]);

  if (!ok) return null;
  return (
    <>
      <div className="absolute inset-0">
        <Canvas3D />
      </div>
      <div ref={bubble} data-show="false" className="group pointer-events-none fixed top-0 left-0 z-[5]">
        <div className="-translate-x-1/2 -translate-y-full">
          <span
            data-text
            className="block rounded-2xl rounded-bl-sm bg-paper px-4 py-2.5 font-mono text-[13px] whitespace-nowrap text-night shadow-xl transition-all duration-500 group-data-[show=false]:translate-y-2 group-data-[show=false]:scale-90 group-data-[show=false]:opacity-0"
          />
        </div>
      </div>
    </>
  );
}
