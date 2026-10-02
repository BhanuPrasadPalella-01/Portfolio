"use client";

import { useRef, useState } from "react";
import Magnetic from "../components/ui/Magnetic";
import { gsap } from "../lib/gsap";

// Big email pill: click copies the address, with a scrambled confirmation.
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const label = useRef<HTMLSpanElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }
    setCopied(true);
    gsap.to(label.current, { duration: 0.6, scrambleText: { text: "Copied to clipboard ✓", chars: "01" } });
    setTimeout(() => {
      setCopied(false);
      gsap.to(label.current, { duration: 0.6, scrambleText: { text: email, chars: "01" } });
    }, 2200);
  };

  return (
    <Magnetic strength={0.2}>
      <button
        type="button"
        onClick={copy}
        data-cursor={copied ? "Copied" : "Copy"}
        className="group relative inline-flex max-w-full items-center gap-5 overflow-hidden rounded-full border border-ink/20 py-4 pr-4 pl-7 text-left sm:py-5 sm:pl-9"
      >
        <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
        <span
          ref={label}
          data-magnetic-inner
          className="relative truncate font-display text-xl text-ink transition-colors duration-500 group-hover:text-background sm:text-4xl"
        >
          {email}
        </span>
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-background sm:h-14 sm:w-14">
          {copied ? "✓" : "⧉"}
        </span>
      </button>
    </Magnetic>
  );
}
