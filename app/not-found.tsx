import TransitionLink from "./components/transition/TransitionLink";
import LostScene from "./components/LostScene";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-night text-paper">
      <LostScene />
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 sm:px-10">
        <p className="font-mono text-[11px] tracking-[0.28em] text-paper/60 uppercase">Error 404</p>
        <h1 className="mt-4 font-display text-[clamp(3rem,10vw,9rem)] leading-[0.9] tracking-[-0.04em]">
          Lost in the <em className="text-[#d39b5f] italic">dark</em>.
        </h1>
        <p className="mt-6 max-w-md text-lg text-paper/70">RescueBot is searching for this page. Poke it — or head somewhere that exists.</p>
        <div className="pointer-events-auto mt-10 flex gap-6">
          <TransitionLink href="/" className="rounded-full bg-paper px-6 py-3 text-sm text-night transition-colors hover:bg-[#d39b5f]">
            Back to the room
          </TransitionLink>
          <TransitionLink href="/work" className="link-line self-center font-mono text-xs tracking-[0.2em] uppercase">
            See all work
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
