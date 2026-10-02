import type { Metadata } from "next";
import SplitReveal from "../components/ui/SplitReveal";
import Reveal from "../components/ui/Reveal";
import TransitionLink from "../components/transition/TransitionLink";
import { notes } from "../lib/notes";
import { projects } from "../lib/projects";

export const metadata: Metadata = {
  title: "Notes",
  description: "Short technical notes from Bhanu Prasad Palella's projects.",
};

export default function NotesPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pt-36 pb-32 sm:px-10 sm:pt-44">
      <SplitReveal as="h1" trigger="load" className="font-display text-[clamp(3.5rem,11vw,10rem)] leading-[0.85] tracking-[-0.045em] text-ink">
        Field <em className="text-accent italic">notes</em>
      </SplitReveal>
      <Reveal trigger="load" delay={0.4}>
        <p data-reveal-item className="mt-8 max-w-lg text-lg text-ink-soft">
          Short write-ups on what actually moved the needle — the bugs, the numbers and the lessons.
        </p>
      </Reveal>

      <Reveal as="ul" trigger="load" delay={0.5} className="mt-20 border-t border-ink/15">
        {notes.map((n, i) => {
          const project = projects.find((p) => p.slug === n.project);
          return (
            <li key={n.slug} data-reveal-item className="border-b border-ink/15">
              <TransitionLink
                href={`/notes/${n.slug}`}
                data-cursor="Read"
                className="group grid gap-4 py-10 md:grid-cols-[4rem_1fr_14rem] md:items-baseline"
              >
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="font-display text-3xl leading-tight tracking-tight text-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 sm:text-5xl">
                    {n.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-ink-soft">{n.dek}</p>
                </div>
                <p className="font-mono text-[11px] tracking-[0.15em] text-ink-soft uppercase md:text-right">
                  {project?.title} · {n.minutes} min
                </p>
              </TransitionLink>
            </li>
          );
        })}
      </Reveal>
    </div>
  );
}
