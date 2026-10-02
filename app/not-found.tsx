import TransitionLink from "./components/transition/TransitionLink";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[80svh] w-full max-w-[1400px] flex-col justify-center px-5 pt-32 sm:px-10">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-6 font-display text-[clamp(3rem,10vw,9rem)] leading-[0.9] tracking-[-0.04em] text-ink">
        Lost in the <em className="text-accent italic">room</em>.
      </h1>
      <p className="mt-6 max-w-md text-lg text-ink-soft">
        Even RescueBot couldn&apos;t find this page.
      </p>
      <TransitionLink href="/" className="link-line mt-10 self-start font-mono text-xs tracking-[0.2em] text-ink uppercase">
        ← Back home
      </TransitionLink>
    </div>
  );
}
