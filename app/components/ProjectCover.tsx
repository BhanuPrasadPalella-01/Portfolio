// Illustrated covers for each project, drawn in the site palette.

const INK = "#16181d";
const PAPER = "#f4f0e8";
const BRONZE = "#8a5c2c";
const SAND = "#d9c7a7";

function VaultSphere() {
  return (
    <>
      <rect width="800" height="600" fill={INK} />
      <circle cx="640" cy="90" r="220" fill={BRONZE} opacity="0.18" />
      <g transform="translate(110 110)">
        <rect width="580" height="380" rx="18" fill="#1f2229" stroke="#2c3038" />
        <rect width="580" height="44" rx="18" fill="#252930" />
        <circle cx="26" cy="22" r="6" fill="#4a4e57" />
        <circle cx="46" cy="22" r="6" fill="#4a4e57" />
        <circle cx="66" cy="22" r="6" fill={BRONZE} />
        <rect x="20" y="64" width="120" height="296" rx="10" fill="#252930" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="36" y={84 + i * 34} width={i === 1 ? 88 : 70} height="12" rx="6" fill={i === 1 ? BRONZE : "#3a3e47"} />
        ))}
        <rect x="160" y="64" width="400" height="70" rx="10" fill="#252930" />
        <rect x="180" y="84" width="150" height="14" rx="7" fill={PAPER} opacity="0.9" />
        <rect x="180" y="108" width="230" height="10" rx="5" fill="#4a4e57" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${160 + i * 136} 152)`}>
            <rect width="124" height="100" rx="10" fill="#252930" />
            <rect x="14" y="16" width="40" height="40" rx="8" fill={i === 0 ? BRONZE : "#3a3e47"} />
            <rect x="14" y="70" width="80" height="10" rx="5" fill="#4a4e57" />
          </g>
        ))}
        <rect x="160" y="268" width="400" height="92" rx="10" fill="#252930" />
        <polyline
          points="180,340 230,320 280,330 330,296 380,306 430,282 480,290 540,284"
          fill="none"
          stroke={BRONZE}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </>
  );
}

function RescueBot() {
  return (
    <>
      <rect width="800" height="600" fill={SAND} />
      {[1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx="400" cy="330" r={i * 62} fill="none" stroke={INK} strokeOpacity={0.5 - i * 0.08} strokeWidth="1.5" />
      ))}
      <path d="M400 330 L400 20 A310 310 0 0 1 640 130 Z" fill={BRONZE} opacity="0.22" />
      <g transform="translate(400 330)">
        <rect x="-120" y="-70" width="240" height="140" rx="34" fill={PAPER} stroke={INK} strokeWidth="3" />
        {[-1, 1].map((sx) =>
          [-1, 1].map((sy) => (
            <rect key={`${sx}${sy}`} x={sx * 130 - 22} y={sy * 48 - 26} width="44" height="52" rx="12" fill={INK} />
          ))
        )}
        <rect x="-70" y="-46" width="140" height="56" rx="16" fill={INK} />
        <circle cx="-30" cy="-18" r="10" fill={PAPER} />
        <circle cx="30" cy="-18" r="10" fill={PAPER} />
        <rect x="-90" y="30" width="180" height="8" rx="4" fill={BRONZE} />
      </g>
      <circle cx="560" cy="170" r="10" fill={BRONZE} />
      <circle cx="560" cy="170" r="22" fill="none" stroke={BRONZE} strokeWidth="2" />
    </>
  );
}

const NODES: [number, number][] = [
  [400, 300], [560, 190], [250, 170], [590, 420], [220, 420], [400, 110], [410, 500],
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 5], [5, 2], [2, 4], [4, 6], [6, 3], [3, 1],
];

function GnnRl() {
  return (
    <>
      <rect width="800" height="600" fill="#e9e2d4" />
      <g stroke={INK} strokeOpacity="0.07">
        {Array.from({ length: 16 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
        ))}
      </g>
      {EDGES.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} stroke={INK} strokeWidth="2" />
      ))}
      {NODES.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i === 0 ? 34 : 22} fill={i === 0 ? BRONZE : PAPER} stroke={INK} strokeWidth="2.5" />
          {i === 0 && <circle cx={x} cy={y} r="56" fill="none" stroke={BRONZE} strokeWidth="1.5" strokeDasharray="4 6" />}
        </g>
      ))}
      <text x="40" y="560" fontFamily="monospace" fontSize="20" fill={INK} opacity="0.6">
        AoCI ↑ 8.4%   ·   error ↓ 44%
      </text>
    </>
  );
}

function Complaints() {
  return (
    <>
      <rect width="800" height="600" fill={BRONZE} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${200 + i * 26} ${130 + i * 46}) rotate(${-8 + i * 5})`}>
          <rect width="340" height="210" rx="10" fill={PAPER} stroke={INK} strokeOpacity="0.15" />
          <path d="M0 0 L170 120 L340 0" fill="none" stroke={INK} strokeOpacity="0.25" strokeWidth="2" />
        </g>
      ))}
      {[
        { y: 130, w: 150, label: "CRITICAL" },
        { y: 180, w: 110, label: "HIGH" },
        { y: 230, w: 70, label: "MEDIUM" },
        { y: 280, w: 40, label: "LOW" },
      ].map((b) => (
        <g key={b.label} transform="translate(560 0)">
          <rect x="0" y={b.y} width={b.w} height="26" rx="6" fill={INK} opacity="0.85" />
          <text x="0" y={b.y - 8} fontFamily="monospace" fontSize="14" fill={PAPER}>
            {b.label}
          </text>
        </g>
      ))}
    </>
  );
}

const COVERS: Record<string, () => React.ReactElement> = {
  vaultsphere: VaultSphere,
  rescuebot: RescueBot,
  "gnn-rl-scheduling": GnnRl,
  "complaint-intelligence": Complaints,
};

export default function ProjectCover({ slug, className = "" }: { slug: string; className?: string }) {
  const Art = COVERS[slug];
  return (
    <svg viewBox="0 0 800 600" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {Art ? <Art /> : <rect width="800" height="600" fill={SAND} />}
    </svg>
  );
}
