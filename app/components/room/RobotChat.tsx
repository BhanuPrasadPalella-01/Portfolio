"use client";

import { useEffect, useRef, useState } from "react";
import TransitionLink from "../transition/TransitionLink";
import { answer, suggestions, type Reply } from "../../lib/robotBrain";
import { emit } from "../../lib/events";
import { sfx } from "../../lib/sound";
import { gsap } from "../../lib/gsap";

type Message = { from: "you" | "bot"; text: string; link?: Reply["link"] };

// "Ask RescueBot" — a chat drawer whose answers are also spoken in the robot's speech bubble.
export default function RobotChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi! I know everything Bhanu has built. Ask away." },
  ]);
  const [typing, setTyping] = useState(false);
  const [ai, setAi] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!panel.current) return;
    if (open) {
      gsap.set(panel.current, { display: "flex" });
      gsap.fromTo(panel.current, { y: 30, autoAlpha: 0, scale: 0.96 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" });
      requestAnimationFrame(() => field.current?.focus());
    } else {
      gsap.to(panel.current, { y: 20, autoAlpha: 0, duration: 0.25, onComplete: () => void gsap.set(panel.current, { display: "none" }) });
    }
  }, [open]);

  // Is the Claude-powered brain switched on (API key set on the server)?
  useEffect(() => {
    fetch("/api/robot")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setAi(Boolean(d?.ai)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Ask the server (Claude when configured); fall back to the local brain on any failure.
  const fetchReply = async (q: string): Promise<Reply> => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch("/api/robot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok || typeof data?.text !== "string") throw new Error("bad reply");
      return { text: data.text, link: data.link };
    } catch {
      return answer(q);
    } finally {
      window.clearTimeout(timer);
    }
  };

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q) {
      setError("Type a question first");
      return;
    }
    setError("");
    setInput("");
    setMessages((m) => [...m, { from: "you", text: q }]);
    setTyping(true);
    sfx.click();
    const started = Date.now();
    const reply = await fetchReply(q);
    // Keep a short "typing" beat even when the answer is instant.
    const wait = Math.max(0, 600 - (Date.now() - started));
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", ...reply }]);
      emit("robot-say", reply.text.length > 70 ? reply.text.slice(0, 68) + "…" : reply.text);
      emit("robot-wave", undefined);
      sfx.beep();
    }, wait);
  };

  return (
    <div className="pointer-events-none fixed bottom-6 left-5 z-30 sm:left-10" data-no-print>
      <div
        ref={panel}
        className="pointer-events-auto mb-3 hidden h-[420px] w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[1.5rem] border border-surface-border bg-background/90 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        style={{ opacity: 0 }}
        role="dialog"
        aria-label="Chat with RescueBot"
      >
        <div className="flex items-center justify-between border-b border-surface-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#62d26f] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#62d26f]" />
            </span>
            <span className="font-display text-lg text-ink">RescueBot</span>
            <span className="font-mono text-[10px] text-ink-soft">{ai ? "powered by Claude" : "offline brain"}</span>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="text-ink-soft hover:text-ink">
            ✕
          </button>
        </div>

        <div ref={list} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" data-lenis-prevent>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.from === "you" ? "rounded-br-sm bg-ink text-background" : "rounded-bl-sm bg-surface text-ink"
                }`}
              >
                {m.text}
                {m.link && (
                  <TransitionLink href={m.link.href} className="mt-2 block font-mono text-[11px] text-accent underline-offset-4 hover:underline">
                    {m.link.label} →
                  </TransitionLink>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-1 px-2 py-1" aria-label="RescueBot is typing">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft" style={{ animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-full border border-surface-border px-2.5 py-1 text-[11px] text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="border-t border-surface-border p-3"
        >
          <div className="flex gap-2">
            <input
              ref={field}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError("");
              }}
              placeholder="Ask about robots, NLP, React…"
              aria-label="Your question"
              className="h-10 flex-1 rounded-full border border-surface-border bg-transparent px-4 text-sm text-ink outline-none placeholder:text-ink-soft focus:border-ink"
            />
            <button type="submit" className="h-10 rounded-full bg-ink px-4 text-sm text-background transition-colors hover:bg-accent">
              Ask
            </button>
          </div>
          {error && <p className="mt-1.5 pl-3 text-[13px] text-[#d14b3c]">{error}</p>}
        </form>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        data-cursor={open ? "Close" : "Chat"}
        className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-surface-border bg-background/80 py-2 pr-4 pl-2 shadow-lg backdrop-blur-xl transition-colors hover:border-ink"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink">
          <span className="flex gap-1">
            <span className="h-2.5 w-1 rounded-full bg-background" />
            <span className="h-2.5 w-1 rounded-full bg-background" />
          </span>
        </span>
        <span className="text-sm text-ink">{open ? "Close chat" : "Ask RescueBot"}</span>
      </button>
    </div>
  );
}
