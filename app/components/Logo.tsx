// The bp monogram. Colours come from theme tokens, so the light version
// (ink tile, paper letters) and dark version (paper tile, ink letters) are automatic.
export default function Logo({ className = "", title = "Bhanu Prasad Palella" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={title}>
      <rect width="120" height="120" rx="28" fill="var(--ink)" />
      <text
        x="57"
        y="80"
        textAnchor="middle"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontStyle="italic"
        fontWeight={500}
        fontSize="64"
        letterSpacing="-1"
        fill="var(--background)"
      >
        bp
      </text>
      <circle cx="96" cy="80" r="6" fill="var(--accent)" />
    </svg>
  );
}
