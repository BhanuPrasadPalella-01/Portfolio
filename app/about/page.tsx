import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "../components/ui/Reveal";
import Scramble from "../components/ui/Scramble";
import SplitReveal from "../components/ui/SplitReveal";
import TiltCard from "../components/ui/TiltCard";
import SpinningBadge from "./SpinningBadge";
import { certificates, site, stack } from "../lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "About Bhanu Prasad Palella — B.Tech AI & Data Science at Amrita School of Artificial Intelligence.",
};

const facts = [
  { label: "Studying", value: "B.Tech, AI & Data Science" },
  { label: "At", value: "Amrita School of Artificial Intelligence, Amrita Vishwa Vidyapeetham" },
  { label: "Focus", value: "Graph learning, reinforcement learning, embedded robotics, applied ML" },
  { label: "Based in", value: "Ettimadai, Coimbatore, Tamil Nadu" },
];

export default function AboutPage() {
  return (
    <div className="pt-36 pb-32 sm:pt-44">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-10">
        <Reveal trigger="load">
          <p data-reveal-item className="eyebrow">
            <span className="text-accent">●</span> About
          </p>
        </Reveal>
        <SplitReveal
          as="h1"
          trigger="load"
          delay={0.1}
          by="words"
          className="mt-8 max-w-5xl font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em] text-ink"
        >
          Curious about how machines <em className="text-accent italic">learn</em> — and how they
          hold up in the real world.
        </SplitReveal>

        <div className="mt-24 grid gap-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-20">
          <Reveal trigger="load" delay={0.4} className="relative">
            <div data-reveal-item>
              <TiltCard className="group overflow-hidden rounded-[2rem]">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/photo/bhanu.png"
                    alt={site.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-[50%_15%] grayscale transition-[filter,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
              </TiltCard>
            </div>
            <SpinningBadge className="absolute -right-6 -bottom-10 h-32 w-32 sm:-right-10 sm:h-40 sm:w-40" />
          </Reveal>

          <div>
            <Reveal className="space-y-6 text-lg leading-relaxed text-ink-soft">
              <p data-reveal-item>
                I&apos;m an undergraduate exploring how intelligent systems learn, cooperate and hold
                up under scrutiny — from decentralised swarm behaviour to graph learning to secure,
                production-grade software.
              </p>
              <p data-reveal-item>
                I like work that crosses layers: training a model, wiring the sensor that feeds it,
                and shipping the interface people actually use.
              </p>
            </Reveal>

            <Reveal as="ul" className="mt-12 border-t border-ink/15">
              {facts.map((f) => (
                <li
                  key={f.label}
                  data-reveal-item
                  className="grid grid-cols-[7rem_1fr] gap-6 border-b border-ink/15 py-5"
                >
                  <span className="font-mono text-[11px] tracking-[0.18em] text-ink-soft uppercase">{f.label}</span>
                  <span className="text-ink">{f.value}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </div>

      {/* Stack */}
      <section className="mx-auto mt-40 w-full max-w-[1400px] px-5 sm:px-10">
        <SplitReveal className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[-0.03em] text-ink">
          The <em className="text-accent italic">toolkit</em>
        </SplitReveal>
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {stack.map((s) => (
            <Reveal key={s.group}>
              <p data-reveal-item className="eyebrow">
                {s.group}
              </p>
              <ul className="mt-5 border-t border-ink/15">
                {s.items.map((item) => (
                  <li key={item} data-reveal-item className="group relative border-b border-ink/15">
                    <span className="absolute inset-y-0 left-0 w-0 bg-accent-soft/60 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
                    <span className="relative flex items-center justify-between py-4 font-display text-2xl text-ink transition-transform duration-500 group-hover:translate-x-3">
                      <Scramble text={item} />
                      <span className="font-mono text-xs text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">↗</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="mx-auto mt-40 w-full max-w-[1400px] px-5 sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SplitReveal className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[-0.03em] text-ink">
            Certifications
          </SplitReveal>
          <Reveal>
            <p data-reveal-item className="max-w-sm text-ink-soft">
              Industry job simulations on Forage — the same frames hanging on the wall of the room.
            </p>
          </Reveal>
        </div>
        <Reveal className="mt-14 grid gap-8 md:grid-cols-2">
          {certificates.map((c) => (
            <div key={c.title} data-reveal-item>
              <TiltCard max={6} className="group rounded-[1.75rem] border border-ink/10 bg-surface p-3">
                <a href={c.pdf} target="_blank" rel="noopener noreferrer" data-cursor="Open PDF" className="block">
                  <div className="relative aspect-[2339/1653] w-full overflow-hidden rounded-[1.25rem] bg-background">
                    <Image
                      src={c.preview}
                      alt={`${c.issuer} certificate`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-6 px-4 pt-6 pb-4">
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">{c.issuer}</p>
                      <p className="mt-2 font-display text-2xl leading-tight text-ink">{c.title}</p>
                      <p className="mt-1 text-sm text-ink-soft">Forage · {c.date}</p>
                    </div>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-background">
                      ↗
                    </span>
                  </div>
                </a>
              </TiltCard>
              <a
                href={c.programUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line mt-4 ml-4 inline-block font-mono text-[11px] tracking-[0.15em] text-ink-soft uppercase hover:text-ink"
              >
                About this program
              </a>
            </div>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
