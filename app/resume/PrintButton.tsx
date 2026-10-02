"use client";

import Magnetic from "../components/ui/Magnetic";

export default function PrintButton() {
  return (
    <Magnetic>
      <button
        type="button"
        onClick={() => window.print()}
        data-cursor="PDF"
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink py-3.5 pr-5 pl-6 text-sm font-medium text-background"
      >
        <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
        <span data-magnetic-inner className="relative">
          Download PDF ↓
        </span>
      </button>
    </Magnetic>
  );
}
