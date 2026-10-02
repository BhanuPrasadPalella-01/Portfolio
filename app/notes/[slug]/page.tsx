import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SplitReveal from "../../components/ui/SplitReveal";
import Reveal from "../../components/ui/Reveal";
import TransitionLink from "../../components/transition/TransitionLink";
import ReadingProgress from "./ReadingProgress";
import { getNote, notes } from "../../lib/notes";
import { projects } from "../../lib/projects";

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  return note ? { title: note.title, description: note.dek } : {};
}

export default async function NotePage({ params }: PageProps<"/notes/[slug]">) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();
  const project = projects.find((p) => p.slug === note.project);
  const i = notes.indexOf(note);
  const next = notes[(i + 1) % notes.length];

  return (
    <article className="mx-auto w-full max-w-[820px] px-5 pt-36 pb-32 sm:px-10 sm:pt-44">
      <ReadingProgress />
      <Reveal trigger="load">
        <TransitionLink data-reveal-item href="/notes" className="font-mono text-[11px] tracking-[0.2em] text-ink-soft uppercase hover:text-ink">
          ← All notes
        </TransitionLink>
      </Reveal>
      <SplitReveal as="h1" trigger="load" by="words" delay={0.1} className="mt-10 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.03em] text-ink">
        {note.title}
      </SplitReveal>
      <Reveal trigger="load" delay={0.4}>
        <p data-reveal-item className="mt-6 text-xl leading-relaxed text-ink-soft">
          {note.dek}
        </p>
        <p data-reveal-item className="mt-6 font-mono text-[11px] tracking-[0.15em] text-ink-soft uppercase">
          {note.minutes} min read · from{" "}
          {project && (
            <TransitionLink href={`/work/${project.slug}`} className="link-line text-accent">
              {project.title}
            </TransitionLink>
          )}
        </p>
      </Reveal>

      <div className="mt-14 space-y-6 border-t border-ink/15 pt-12 text-[17px] leading-[1.8] text-ink">
        {note.body.map((b, k) => {
          switch (b.type) {
            case "h":
              return (
                <h2 key={k} className="pt-6 font-display text-3xl tracking-tight text-ink">
                  {b.text}
                </h2>
              );
            case "list":
              return (
                <ul key={k} className="space-y-2">
                  {b.items.map((it) => (
                    <li key={it} className="flex gap-4">
                      <span className="mt-[0.85em] h-px w-4 shrink-0 bg-accent" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              );
            case "code":
              return (
                <pre key={k} className="overflow-x-auto rounded-2xl bg-night p-5 font-mono text-[13px] leading-relaxed text-paper" data-lenis-prevent>
                  <code>{b.text}</code>
                </pre>
              );
            case "quote":
              return (
                <blockquote key={k} className="border-l-2 border-accent py-1 pl-6 font-display text-2xl leading-snug text-ink italic">
                  {b.text}
                </blockquote>
              );
            default:
              return <p key={k}>{b.text}</p>;
          }
        })}
      </div>

      <TransitionLink href={`/notes/${next.slug}`} data-cursor="Next" className="group mt-24 block border-t border-ink/15 pt-10">
        <p className="eyebrow">Next note</p>
        <p className="mt-3 font-display text-3xl text-ink transition-transform duration-700 group-hover:translate-x-3 group-hover:italic sm:text-4xl">
          {next.title} <span className="text-accent">→</span>
        </p>
      </TransitionLink>
    </article>
  );
}
