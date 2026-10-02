import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProjectCover from "../../components/ProjectCover";
import TransitionLink from "../../components/transition/TransitionLink";
import CountUp from "../../components/ui/CountUp";
import Magnetic from "../../components/ui/Magnetic";
import Reveal from "../../components/ui/Reveal";
import Scramble from "../../components/ui/Scramble";
import SplitReveal from "../../components/ui/SplitReveal";
import TiltCard from "../../components/ui/TiltCard";
import ParallaxCover from "./ParallaxCover";
import { getProject, projects } from "../../lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.tagline };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const i = projects.indexOf(project);
  const next = projects[(i + 1) % projects.length];

  return (
    <article className="pt-32 sm:pt-40">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-10">
        <Reveal trigger="load" className="flex flex-wrap items-center justify-between gap-4">
          <TransitionLink data-reveal-item href="/work" className="font-mono text-[11px] tracking-[0.2em] text-ink-soft uppercase hover:text-ink">
            ← <Scramble text="All work" />
          </TransitionLink>
          <p data-reveal-item className="font-mono text-[11px] tracking-[0.2em] text-ink-soft uppercase">
            <span className="text-accent">{project.index}</span> / {String(projects.length).padStart(2, "0")} · {project.category}
          </p>
        </Reveal>

        <SplitReveal
          as="h1"
          trigger="load"
          delay={0.1}
          className="mt-10 font-display text-[clamp(3.5rem,12vw,11rem)] leading-[0.85] tracking-[-0.05em] text-ink"
        >
          {project.title}
        </SplitReveal>

        <Reveal trigger="load" delay={0.5} className="mt-10 grid gap-10 border-t border-ink/15 pt-8 md:grid-cols-[1fr_auto]">
          <p data-reveal-item className="max-w-2xl font-display text-2xl leading-snug text-ink sm:text-3xl">
            {project.tagline}
          </p>
          <dl data-reveal-item className="grid grid-cols-2 gap-x-10 gap-y-4 font-mono text-[11px] tracking-[0.15em] uppercase md:grid-cols-1">
            <div>
              <dt className="text-ink-soft">Status</dt>
              <dd className="mt-1 text-ink">{project.status}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">In the room</dt>
              <dd className="mt-1 text-ink">{project.roomObject}</dd>
            </div>
            {project.team && (
              <div className="col-span-2 md:col-span-1 md:max-w-[16rem]">
                <dt className="text-ink-soft">Team</dt>
                <dd className="mt-1 leading-relaxed text-ink normal-case tracking-normal">{project.team}</dd>
              </div>
            )}
            {project.links?.map((l) => (
              <div key={l.href}>
                <dt className="text-ink-soft">Link</dt>
                <dd className="mt-1">
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-line text-accent">
                    {l.label} ↗
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 w-full max-w-[1400px] px-5 sm:px-10">
        <ParallaxCover>
          {project.heroImage ? (
            <Image
              src={project.heroImage}
              alt=""
              fill
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover object-[50%_45%]"
            />
          ) : (
            <ProjectCover slug={project.slug} className="h-full w-full" />
          )}
        </ParallaxCover>
      </div>

      {project.role && (
        <section className="mx-auto mt-16 w-full max-w-[1400px] px-5 sm:px-10">
          <Reveal>
            <p className="max-w-3xl border-l-2 border-accent pl-6 text-lg text-ink">
              <span className="eyebrow mb-2 block">My part</span>
              {project.role}
            </p>
          </Reveal>
        </section>
      )}

      {/* Stats */}
      <section className="mx-auto mt-24 w-full max-w-[1400px] px-5 sm:px-10">
        <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/10 lg:grid-cols-4">
          {project.stats.map((s) => (
            <div key={s.label} data-reveal-item className="group bg-background p-6 transition-colors duration-500 hover:bg-ink sm:p-8">
              <CountUp value={s.value} className="block font-display text-5xl text-accent transition-colors duration-500 group-hover:text-accent-soft sm:text-6xl" />
              <p className="mt-3 font-mono text-[11px] tracking-[0.15em] text-ink-soft uppercase transition-colors duration-500 group-hover:text-background/70">
                {s.label}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Live demo */}
      {project.demo && (
        <section className="mx-auto mt-32 w-full max-w-[1400px] px-5 sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="eyebrow">
              <span className="text-accent">●</span> Live demo
            </p>
            <a
              href={project.demo.src}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line self-start font-mono text-[11px] tracking-[0.18em] text-ink uppercase"
            >
              Open full screen ↗
            </a>
          </div>
          <p className="mt-4 max-w-2xl text-ink-soft">{project.demo.note}</p>
          <Reveal className="mt-8">
            <div className="overflow-hidden rounded-[1.75rem] border border-ink/10 bg-[#04040c] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
              <iframe
                src={project.demo.src}
                title={`${project.title} live demo`}
                loading="lazy"
                className="block aspect-[16/10] w-full"
              />
            </div>
          </Reveal>
        </section>
      )}

      {/* Overview */}
      <section className="mx-auto mt-32 grid w-full max-w-[1400px] gap-10 px-5 sm:px-10 md:grid-cols-[1fr_2fr]">
        <p className="eyebrow">
          <span className="text-accent">●</span> Overview
        </p>
        <SplitReveal by="lines" as="p" className="font-display text-3xl leading-[1.2] tracking-tight text-ink sm:text-4xl">
          {project.overview}
        </SplitReveal>
      </section>

      {/* Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="mx-auto mt-32 w-full max-w-[1400px] px-5 sm:px-10">
          <p className="eyebrow">
            <span className="text-accent">●</span> Gallery
          </p>
          <Reveal className={`mt-8 grid gap-6 ${project.images.length > 1 ? "md:grid-cols-2" : ""}`}>
            {project.images.map((img) => (
              <figure key={img.src} data-reveal-item>
                <TiltCard max={5} className="group overflow-hidden rounded-[1.5rem] border border-ink/10 bg-surface">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="h-auto w-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </TiltCard>
                <figcaption className="mt-3 font-mono text-[11px] tracking-[0.12em] text-ink-soft uppercase">{img.caption}</figcaption>
              </figure>
            ))}
          </Reveal>
        </section>
      )}

      {/* What I built */}
      <section className="mx-auto mt-32 w-full max-w-[1400px] px-5 sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <p className="eyebrow">
            <span className="text-accent">●</span> What I built
          </p>
          <Reveal as="ul" className="grid gap-3 sm:grid-cols-2">
            {project.highlights.map((h, n) => (
              <li
                key={h}
                data-reveal-item
                className="group relative overflow-hidden rounded-2xl border border-ink/10 p-6 transition-colors duration-500 hover:border-ink"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                <span className="relative font-mono text-[11px] text-accent transition-colors duration-500 group-hover:text-accent-soft">
                  {String(n + 1).padStart(2, "0")}
                </span>
                <p className="relative mt-3 leading-relaxed text-ink transition-colors duration-500 group-hover:text-background">{h}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Results + stack */}
      <section className="mx-auto mt-32 grid w-full max-w-[1400px] gap-10 px-5 sm:px-10 md:grid-cols-[1fr_2fr]">
        <p className="eyebrow">
          <span className="text-accent">●</span> {project.results ? "Results" : "Stack"}
        </p>
        <div>
          {project.results && (
            <Reveal>
              <p className="border-l-2 border-accent pl-6 font-display text-2xl leading-snug text-ink italic sm:text-3xl">
                {project.results}
              </p>
            </Reveal>
          )}
          <Reveal className={`flex flex-wrap gap-2 ${project.results ? "mt-14" : ""}`}>
            {project.tech.map((t) => (
              <span
                key={t}
                data-reveal-item
                className="rounded-full border border-ink/15 px-4 py-2 font-mono text-xs text-ink transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-background"
              >
                {t}
              </span>
            ))}
          </Reveal>
          {project.links && (
            <Reveal className="mt-12">
              {project.links.map((l) => (
                <Magnetic key={l.href} className="mr-3 mb-3">
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="Visit"
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent px-7 py-4 text-sm font-medium text-background"
                  >
                    <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                    <span data-magnetic-inner className="relative">{l.label} ↗</span>
                  </a>
                </Magnetic>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      {/* Next project */}
      <section className="mt-40 border-t border-ink/15">
        <TransitionLink
          href={`/work/${next.slug}`}
          data-cursor="Next"
          className="group mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-5 py-20 sm:px-10 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="eyebrow">Next project</p>
            <p className="mt-4 font-display text-[clamp(3rem,9vw,8rem)] leading-[0.9] tracking-[-0.04em] text-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-6 group-hover:italic">
              {next.title} <span className="inline-block text-accent transition-transform duration-700 group-hover:translate-x-4">→</span>
            </p>
          </div>
          <TiltCard className="w-full max-w-sm overflow-hidden rounded-2xl transition-transform duration-700 md:w-80">
            <ProjectCover slug={next.slug} className="aspect-[4/3] w-full grayscale transition-[filter] duration-700 group-hover:grayscale-0" />
          </TiltCard>
        </TransitionLink>
      </section>
    </article>
  );
}
