import RoomExperience from "./components/room/RoomExperience";
import TourProgress from "./components/room/TourProgress";
import TransitionLink from "./components/transition/TransitionLink";
import Magnetic from "./components/ui/Magnetic";
import Reveal from "./components/ui/Reveal";
import SplitReveal from "./components/ui/SplitReveal";
import { projects } from "./lib/projects";
import { site } from "./lib/site";

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PrimaryButton({ href, children, cursor }: { href: string; children: React.ReactNode; cursor?: string }) {
  return (
    <Magnetic>
      <TransitionLink
        href={href}
        data-cursor={cursor}
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink py-3.5 pr-4 pl-6 text-sm font-medium text-background"
      >
        <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
        <span data-magnetic-inner className="relative flex items-center gap-3">
          {children}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-ink transition-transform duration-500 group-hover:-rotate-45">
            <Arrow className="h-3.5 w-3.5" />
          </span>
        </span>
      </TransitionLink>
    </Magnetic>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="pointer-events-auto w-full max-w-[26rem] rounded-[1.75rem] border border-surface-border/80 bg-background/80 p-7 shadow-[0_40px_80px_-40px_rgba(22,24,29,0.35)] backdrop-blur-xl sm:p-8">
      {children}
    </Reveal>
  );
}

function Stage({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <section
      id={`stage-${index}`}
      className="flex h-[100svh] items-end px-5 pb-6 sm:px-10 md:items-center md:pb-0"
    >
      <div className="mx-auto w-full max-w-[1400px]">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <RoomExperience />
      <TourProgress />

      <div id="tour" className="pointer-events-none relative z-10">
        {/* Intro */}
        <section id="stage-0" className="flex h-[100svh] items-start px-5 pt-28 sm:px-10 md:items-center md:pt-0">
          <div className="mx-auto w-full max-w-[1400px]">
            <div className="pointer-events-auto max-w-xl">
              <Reveal trigger="load" delay={0.1}>
                <p className="eyebrow" data-reveal-item>
                  <span className="text-accent">●</span> &nbsp;{site.role} · {site.school}
                </p>
              </Reveal>
              <SplitReveal
                as="h1"
                trigger="load"
                delay={0.2}
                className="mt-6 font-display text-[clamp(3rem,7.5vw,6.75rem)] leading-[0.92] tracking-[-0.035em] text-ink"
              >
                Bhanu Prasad <em className="text-accent italic">Palella</em>
              </SplitReveal>
              <Reveal trigger="load" delay={0.7}>
                <p data-reveal-item className="mt-7 max-w-md text-lg leading-relaxed text-ink-soft">
                  I build intelligent systems — and the robots, platforms and models around them.
                  Welcome to my room. <span className="text-ink">Every object is a project.</span>
                </p>
                <div data-reveal-item className="mt-9 flex flex-wrap items-center gap-5">
                  <Magnetic>
                    <a
                      href="#stage-1"
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ink py-3.5 pr-4 pl-6 text-sm font-medium text-background"
                    >
                      <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                      <span data-magnetic-inner className="relative flex items-center gap-3">
                        Step inside
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-ink transition-transform duration-500 group-hover:translate-y-0.5">
                          <Arrow className="h-3.5 w-3.5 rotate-90" />
                        </span>
                      </span>
                    </a>
                  </Magnetic>
                  <TransitionLink href="/work" className="link-line font-mono text-xs tracking-[0.18em] text-ink uppercase">
                    Skip to all work
                  </TransitionLink>
                </div>
                <p data-reveal-item className="mt-10 hidden font-mono text-[11px] text-ink-soft md:block">
                  ↳ psst — the robot is watching your cursor. Try poking it.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {projects.map((p, i) => (
          <Stage key={p.slug} index={i + 1}>
            <Panel>
              <div className="flex items-center justify-between" data-reveal-item>
                <span className="eyebrow">
                  <span className="text-accent">{p.index}</span> &nbsp;/&nbsp; {p.roomObject}
                </span>
                <span className="rounded-full border border-surface-border px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-ink-soft uppercase">
                  {p.status}
                </span>
              </div>
              <h2 data-reveal-item className="mt-5 font-display text-4xl leading-[1.02] tracking-tight text-ink sm:text-5xl">
                {p.title}
              </h2>
              <p data-reveal-item className="mt-2 text-sm text-ink-soft">
                {p.category}
              </p>
              <p data-reveal-item className="mt-5 leading-relaxed text-ink">
                {p.tagline}
              </p>
              <dl data-reveal-item className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-surface-border bg-surface-border">
                {p.stats.slice(0, 2).map((s) => (
                  <div key={s.label} className="flex flex-col-reverse bg-background px-4 py-3">
                    <dt className="font-mono text-[10px] tracking-[0.12em] text-ink-soft uppercase">{s.label}</dt>
                    <dd className="font-display text-3xl text-accent">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div data-reveal-item className="mt-7 flex flex-wrap items-center gap-4">
                <PrimaryButton href={`/work/${p.slug}`} cursor="Open">
                  Case study
                </PrimaryButton>
                <span className="hidden font-mono text-[11px] text-ink-soft md:inline">
                  or click {p.roomObject.toLowerCase()}
                </span>
              </div>
            </Panel>
          </Stage>
        ))}

        <Stage index={5}>
          <Panel>
            <p data-reveal-item className="eyebrow">
              <span className="text-accent">05</span> &nbsp;/&nbsp; The wall
            </p>
            <h2 data-reveal-item className="mt-5 font-display text-4xl leading-[1.02] tracking-tight text-ink sm:text-5xl">
              Certified by <em className="italic">industry</em>.
            </h2>
            <p data-reveal-item className="mt-5 leading-relaxed text-ink">
              Data-analytics job simulations from Deloitte and TATA — framed on the wall, filed on
              the about page.
            </p>
            <div data-reveal-item className="mt-7">
              <PrimaryButton href="/about" cursor="About">
                About me
              </PrimaryButton>
            </div>
          </Panel>
        </Stage>

        <section id="stage-6" className="flex h-[100svh] items-end px-5 pb-10 sm:px-10 md:items-center md:pb-0">
          <div className="mx-auto w-full max-w-[1400px]">
            <div className="pointer-events-auto max-w-xl">
              <SplitReveal className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-ink">
                That&apos;s the room. <em className="text-accent italic">Now the details.</em>
              </SplitReveal>
              <Reveal className="mt-9 flex flex-wrap items-center gap-5">
                <div data-reveal-item>
                  <PrimaryButton href="/work" cursor="Work">
                    All work
                  </PrimaryButton>
                </div>
                <TransitionLink data-reveal-item href="/contact" className="link-line font-mono text-xs tracking-[0.18em] text-ink uppercase">
                  Get in touch
                </TransitionLink>
              </Reveal>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
