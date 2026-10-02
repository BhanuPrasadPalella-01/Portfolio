// The bp monogram. Light theme: ink tile, paper letters. Dark theme: no tile,
// paper letters straight on the page. The bronze dot stays the same in both.
export default function Logo({ className = "", title = "Bhanu Prasad Palella" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={title}>
      <rect width="120" height="120" rx="28" fill="var(--logo-tile)" />
      <text
        x="60"
        y="71"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontStyle="italic"
        fontWeight={500}
        fontSize="60"
        letterSpacing="-1"
        fill="var(--logo-mark)"
      >
        bp
      </text>
      <circle cx="96" cy="86" r="6" fill="#B5844F" />
    </svg>
  );
}
