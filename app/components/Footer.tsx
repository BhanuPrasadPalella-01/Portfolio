"use client";

import { usePathname } from "next/navigation";
import TransitionLink from "./transition/TransitionLink";
import Magnetic from "./ui/Magnetic";
import Marquee from "./ui/Marquee";
import Scramble from "./ui/Scramble";
import { navLinks, site } from "../lib/site";

export default function Footer() {
  const pathname = usePathname();
  const onContact = pathname === "/contact";

  return (
    <footer className="relative z-10 overflow-hidden rounded-t-[2.5rem] bg-ink text-background">
      {!onContact && (
        <div className="mx-auto w-full max-w-[1400px] px-6 pt-24 sm:px-10">
          <p className="font-mono text-[11px] tracking-[0.25em] text-background/50 uppercase">
            Got an idea?
          </p>
          <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-3xl font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-tight">
              Let&apos;s build something <em className="text-accent-soft italic">intelligent</em>.
            </h2>
            <Magnetic strength={0.45}>
              <TransitionLink
                href="/contact"
                data-cursor="Say hi"
                className="group relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-accent text-background sm:h-48 sm:w-48"
              >
                <span className="absolute inset-0 scale-0 rounded-full bg-background transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100" />
                <span data-magnetic-inner className="relative text-base font-medium transition-colors duration-500 group-hover:text-ink">
                  Get in touch
                </span>
              </TransitionLink>
            </Magnetic>
          </div>
        </div>
      )}

      <Marquee className="mt-24 border-y border-background/10 py-6" speed={30}>
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="flex items-center gap-10 pr-10 font-display text-5xl whitespace-nowrap text-background/90 sm:text-7xl">
            {site.name}
            <span className="text-accent">✦</span>
            <em className="text-background/40 italic">AI &amp; Data Science</em>
            <span className="text-accent">✦</span>
          </span>
        ))}
      </Marquee>

      <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-14 sm:grid-cols-3 sm:px-10">
        <div>
          <p className="font-mono text-[11px] tracking-[0.25em] text-background/50 uppercase">Menu</p>
          <ul className="mt-4 space-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <TransitionLink href={l.href} className="text-background/80 transition-colors hover:text-accent-soft">
                  <Scramble text={l.label} />
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] tracking-[0.25em] text-background/50 uppercase">Elsewhere</p>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={site.github} target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent-soft">
                <Scramble text="GitHub ↗" />
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="text-background/80 hover:text-accent-soft">
                <Scramble text="LinkedIn ↗" />
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="text-background/80 hover:text-accent-soft">
                <Scramble text="Email ↗" />
              </a>
            </li>
          </ul>
        </div>
        <div className="sm:text-right">
          <p className="font-mono text-[11px] tracking-[0.25em] text-background/50 uppercase">Based in</p>
          <p className="mt-4 text-background/80">{site.location}</p>
          <p className="mt-10 font-mono text-[11px] text-background/40">
            © {new Date().getFullYear()} {site.name}
            <br />
            Built with Next.js, Three.js &amp; GSAP
          </p>
        </div>
      </div>
    </footer>
  );
}
