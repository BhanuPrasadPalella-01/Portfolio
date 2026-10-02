import type { Metadata } from "next";
import Reveal from "../components/ui/Reveal";
import SplitReveal from "../components/ui/SplitReveal";
import Marquee from "../components/ui/Marquee";
import CopyEmail from "./CopyEmail";
import { site } from "../lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Bhanu Prasad Palella — internships, research collaborations and side projects.",
};

const channels = [
  { label: "GitHub", handle: "BhanuPrasadPalella-01", href: site.github },
  { label: "LinkedIn", handle: "in/bhanuprasadpalella", href: site.linkedin },
  { label: "Email", handle: site.email, href: `mailto:${site.email}` },
];

export default function ContactPage() {
  return (
    <div className="pt-36 sm:pt-44">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-10">
        <Reveal trigger="load">
          <p data-reveal-item className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-ink-soft uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Open to internships, research & side projects
          </p>
        </Reveal>

        <SplitReveal
          as="h1"
          trigger="load"
          delay={0.1}
          className="mt-8 font-display text-[clamp(3.25rem,10vw,9.5rem)] leading-[0.88] tracking-[-0.045em] text-ink"
        >
          Let&apos;s build something <em className="text-accent italic">intelligent</em>.
        </SplitReveal>

        <Reveal trigger="load" delay={0.6} className="mt-16">
          <div data-reveal-item>
            <CopyEmail email={site.email} />
          </div>
        </Reveal>

        <Reveal as="ul" className="mt-24 border-t border-ink/15">
          {channels.map((c) => (
            <li key={c.label} data-reveal-item className="border-b border-ink/15">
              <a
                href={c.href}
                target={c.label === "Email" ? undefined : "_blank"}
                rel={c.label === "Email" ? undefined : "noopener noreferrer"}
                className="group relative flex items-center justify-between gap-6 overflow-hidden py-8"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
                <span className="relative font-display text-4xl text-ink transition-all duration-500 group-hover:translate-x-6 group-hover:text-background sm:text-6xl">
                  {c.label}
                </span>
                <span className="relative flex items-center gap-6 pr-2 transition-all duration-500 group-hover:-translate-x-6">
                  <span className="hidden font-mono text-xs text-ink-soft transition-colors duration-500 group-hover:text-background/70 sm:block">
                    {c.handle}
                  </span>
                  <span className="text-3xl text-ink transition-all duration-500 group-hover:rotate-45 group-hover:text-accent-soft">↗</span>
                </span>
              </a>
            </li>
          ))}
        </Reveal>

        <Reveal className="mt-16 grid gap-8 pb-24 font-mono text-[11px] tracking-[0.18em] text-ink-soft uppercase sm:grid-cols-3">
          <p data-reveal-item>
            Based in
            <br />
            <span className="text-ink">{site.location}</span>
          </p>
          <p data-reveal-item>
            Studying at
            <br />
            <span className="text-ink">{site.school}</span>
          </p>
          <p data-reveal-item>
            Timezone
            <br />
            <span className="text-ink">IST · UTC+5:30</span>
          </p>
        </Reveal>
      </div>

      <Marquee className="border-y border-ink/15 bg-accent py-5 text-background" speed={22}>
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className="flex items-center gap-8 pr-8 font-mono text-sm tracking-[0.25em] whitespace-nowrap uppercase">
            Available for internships <span>✦</span> Research collaborations <span>✦</span> Side projects <span>✦</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
