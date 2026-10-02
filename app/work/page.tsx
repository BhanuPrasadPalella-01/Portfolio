import type { Metadata } from "next";
import SplitReveal from "../components/ui/SplitReveal";
import Reveal from "../components/ui/Reveal";
import WorkList from "./WorkList";
import { projects } from "../lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by Bhanu Prasad Palella — AI platforms, robotics, graph learning and NLP.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 pt-36 pb-32 sm:px-10 sm:pt-44">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SplitReveal
          as="h1"
          trigger="load"
          className="font-display text-[clamp(3.5rem,11vw,10rem)] leading-[0.85] tracking-[-0.045em] text-ink"
        >
          Selected <em className="text-accent italic">work</em>
        </SplitReveal>
        <Reveal trigger="load" delay={0.4} className="max-w-xs pb-3">
          <p data-reveal-item className="font-mono text-[11px] tracking-[0.2em] text-ink-soft uppercase">
            ({String(projects.length).padStart(2, "0")}) projects
          </p>
          <p data-reveal-item className="mt-3 text-ink-soft">
            Platforms, robots, research and models — each one built end to end.
          </p>
        </Reveal>
      </div>

      <Reveal trigger="load" delay={0.5} className="mt-20">
        <div data-reveal-item>
          <WorkList projects={projects} />
        </div>
      </Reveal>
    </div>
  );
}
