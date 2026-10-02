import type { Metadata } from "next";
import PrintButton from "./PrintButton";
import Reveal from "../components/ui/Reveal";
import { projects } from "../lib/projects";
import { certificates, site, stack } from "../lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume of Bhanu Prasad Palella — AI & Data Science, Amrita School of Artificial Intelligence.",
};

const featured = ["vaultsphere", "protein-structure", "rescuebot", "gnn-rl-scheduling", "swarmbot", "complaint-intelligence"];

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 border-b border-ink/15 pb-2 font-mono text-[11px] tracking-[0.25em] text-accent uppercase print:text-[#8a5c2c]">
      {children}
    </h2>
  );
}

// A printable resume generated from the same data as the rest of the site.
export default function ResumePage() {
  const picks = featured.map((s) => projects.find((p) => p.slug === s)!).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-[1000px] px-5 pt-36 pb-32 sm:px-10 sm:pt-44 print:max-w-none print:p-0">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6" data-no-print>
        <div>
          <p className="eyebrow">
            <span className="text-accent">●</span> Resume
          </p>
          <p className="mt-3 max-w-md text-ink-soft">One page, generated from this site. Save it as a PDF from the print dialog.</p>
        </div>
        <PrintButton />
      </div>

      <Reveal className="print-sheet rounded-[1.75rem] border border-surface-border bg-background p-8 sm:p-12">
        <header className="flex flex-col gap-4 border-b border-ink/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-5xl leading-none tracking-tight text-ink print:text-4xl">{site.name}</h1>
            <p className="mt-3 text-lg text-ink-soft">AI & Data Science · builds ML systems, robots and full-stack platforms</p>
          </div>
          <ul className="space-y-1 font-mono text-[12px] text-ink sm:text-right">
            <li>{site.email}</li>
            <li>{site.github.replace("https://", "")}</li>
            <li>{site.linkedin.replace("https://www.", "")}</li>
            <li>bhanuprasadpalella.vercel.app</li>
          </ul>
        </header>

        <section className="mt-8">
          <Heading>Education</Heading>
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <p className="font-medium text-ink">B.Tech, Artificial Intelligence & Data Science (CPS)</p>
              <p className="text-ink-soft">Amrita School of Artificial Intelligence, Amrita Vishwa Vidyapeetham — Coimbatore</p>
            </div>
            <p className="font-mono text-[12px] text-ink-soft">2025 – 2029</p>
          </div>
        </section>

        <section className="mt-8">
          <Heading>Projects</Heading>
          <ul className="space-y-5">
            {picks.map((p) => (
              <li key={p.slug} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-ink">
                    {p.title} <span className="font-normal text-ink-soft">— {p.subtitle}</span>
                  </p>
                  <p className="font-mono text-[11px] text-ink-soft">{p.status}</p>
                </div>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                  {p.tagline} {p.stats[0].value} {p.stats[0].label.toLowerCase()}.
                </p>
                <p className="mt-1 font-mono text-[11px] text-ink-soft">{p.tech.slice(0, 7).join(" · ")}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-ink-soft">
            Also: {projects.filter((p) => !featured.includes(p.slug)).map((p) => p.title).join(", ")} — details at /work.
          </p>
        </section>

        <section className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <Heading>Skills</Heading>
            <ul className="space-y-2 text-[15px]">
              {stack.map((s) => (
                <li key={s.group}>
                  <span className="font-medium text-ink">{s.group}:</span> <span className="text-ink-soft">{s.items.join(", ")}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Heading>Certifications</Heading>
            <ul className="space-y-2 text-[15px]">
              {certificates.map((c) => (
                <li key={c.title}>
                  <span className="font-medium text-ink">{c.issuer}</span> <span className="text-ink-soft">— {c.title} (Forage, {c.date})</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
