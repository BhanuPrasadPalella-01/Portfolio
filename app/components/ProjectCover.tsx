// Illustrated covers for each project, drawn in the site palette.

const INK = "#16181d";
const PAPER = "#f4f0e8";
const BRONZE = "#8a5c2c";
const SAND = "#d9c7a7";

// Round computed geometry so server and browser render identical SVG attributes.
const r2 = (n: number) => Math.round(n * 100) / 100;

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
        <circle key={i} cx="400" cy="330" r={i * 62} fill="none" stroke={INK} strokeOpacity={r2(0.5 - i * 0.08)} strokeWidth="1.5" />
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

function Protein() {
  const pts = Array.from({ length: 60 }, (_, i) => {
    const t = i / 59;
    return [r2(120 + t * 560), r2(300 + Math.sin(t * Math.PI * 7) * 90), r2(Math.cos(t * Math.PI * 7))] as const;
  });
  return (
    <>
      <rect width="800" height="600" fill="#e9e2d4" />
      <circle cx="660" cy="120" r="160" fill={BRONZE} opacity="0.12" />
      {pts.map(([x, y, z], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={r2(10 + z * 5)}
          fill={i < 26 ? BRONZE : i < 42 ? "#8fa08a" : INK}
          opacity={r2(0.55 + z * 0.4)}
        />
      ))}
      <text x="40" y="560" fontFamily="monospace" fontSize="20" fill={INK} opacity="0.65">
        H · E · C   —   Q3 80.09%
      </text>
    </>
  );
}

function Swarm() {
  return (
    <>
      <rect width="800" height="600" fill="#1d2026" />
      <g stroke="#ffffff" strokeOpacity="0.06">
        {Array.from({ length: 17 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
        ))}
      </g>
      {[
        [220, 180, 34],
        [520, 140, 28],
        [600, 420, 40],
        [300, 440, 30],
      ].map(([x, y, r]) => (
        <circle key={`${x}`} cx={x} cy={y} r={r} fill="none" stroke="#d96b5f" strokeWidth="3" />
      ))}
      <polygon points="400,250 340,350 460,350" fill="none" stroke="#e3c35a" strokeDasharray="6 8" strokeWidth="2" />
      {[
        [400, 250, "#4fa8b8"],
        [340, 350, "#7fa36b"],
        [460, 350, "#d9a441"],
      ].map(([x, y, c]) => (
        <g key={`${x}${y}`}>
          <path d={`M${x} ${y} L${(x as number) + 90} ${(y as number) - 40} L${(x as number) + 90} ${(y as number) + 30} Z`} fill={c as string} opacity="0.18" />
          <circle cx={x} cy={y} r="14" fill={c as string} />
        </g>
      ))}
      <text x="40" y="560" fontFamily="monospace" fontSize="20" fill={PAPER} opacity="0.6">
        TRIANGLE → LINE-2 → SOLO
      </text>
    </>
  );
}

function Pso() {
  const paths: [string, string][] = [
    ["#2f6fb5", "M80 480 C 200 300, 300 200, 640 140"],
    ["#d0702b", "M300 520 C 380 380, 520 260, 640 140"],
    ["#c9a227", "M700 500 C 720 380, 660 240, 640 140"],
  ];
  return (
    <>
      <rect width="800" height="600" fill={PAPER} />
      {[
        [250, 360, 50],
        [430, 250, 40],
        [560, 380, 55],
      ].map(([x, y, r]) => (
        <circle key={`${x}`} cx={x} cy={y} r={r} fill="#d6d1c7" stroke={INK} strokeOpacity="0.4" strokeWidth="2" />
      ))}
      {paths.map(([c, d]) => (
        <path key={c} d={d} fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" />
      ))}
      <text x="625" y="155" fontSize="44" fill="#d62828">
        ✱
      </text>
      <text x="40" y="70" fontFamily="Georgia, serif" fontStyle="italic" fontSize="34" fill={INK}>
        F(P) = αT + βP
      </text>
    </>
  );
}

function Sdr() {
  return (
    <>
      <rect width="800" height="600" fill="#151821" />
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <circle key={i} cx="400" cy="320" r={i * 55} fill="none" stroke={BRONZE} strokeOpacity={r2(0.6 - i * 0.08)} strokeWidth="2" />
      ))}
      <rect x="330" y="300" width="140" height="44" rx="10" fill="#2a2e38" stroke="#3a3f4b" />
      <line x1="360" y1="300" x2="340" y2="200" stroke={PAPER} strokeWidth="4" strokeLinecap="round" />
      <line x1="440" y1="300" x2="460" y2="200" stroke={PAPER} strokeWidth="4" strokeLinecap="round" />
      {[
        ["SOS", 1, "#ff6a3c"],
        ["VOICE", 2, "#f2c14e"],
        ["VIDEO", 3, "#9db2ff"],
        ["GPS", 4, "#7fa36b"],
      ].map(([label, rank, c]) => (
        <g key={label as string} transform={`translate(560 ${100 + (rank as number) * 60})`}>
          <rect width={200 - (rank as number) * 30} height="34" rx="8" fill={c as string} opacity="0.85" />
          <text x="12" y="23" fontFamily="monospace" fontSize="16" fill="#151821">
            {label}
          </text>
        </g>
      ))}
      <text x="40" y="560" fontFamily="monospace" fontSize="20" fill={PAPER} opacity="0.6">
        DMCS — mission-critical first
      </text>
    </>
  );
}

function Fractal() {
  return (
    <>
      <rect width="800" height="600" fill={INK} />
      {Array.from({ length: 14 }, (_, i) => (
        <circle
          key={i}
          cx={440 - i * 6}
          cy="300"
          r={260 - i * 18}
          fill="none"
          stroke={i % 2 ? BRONZE : SAND}
          strokeOpacity={r2(0.15 + i * 0.05)}
          strokeWidth="2"
        />
      ))}
      <path d="M440 300 m-150 0 a150 140 0 1 0 300 0 a150 140 0 1 0 -300 0" fill={INK} stroke={SAND} strokeWidth="2" />
      <circle cx="250" cy="300" r="62" fill={INK} stroke={SAND} strokeWidth="2" />
      {Array.from({ length: 40 }, (_, i) => {
        const a = (i / 40) * Math.PI * 2;
        return <circle key={i} cx={r2(440 + Math.cos(a) * 190)} cy={r2(300 + Math.sin(a) * 170)} r={3 + (i % 3)} fill={BRONZE} />;
      })}
      <text x="40" y="560" fontFamily="monospace" fontSize="20" fill={PAPER} opacity="0.6">
        z → z² + c   ·   280 boids
      </text>
    </>
  );
}

const COVERS: Record<string, () => React.ReactElement> = {
  vaultsphere: VaultSphere,
  "protein-structure": Protein,
  rescuebot: RescueBot,
  swarmbot: Swarm,
  "adaptive-pso": Pso,
  "mission-aware-sdr": Sdr,
  "gnn-rl-scheduling": GnnRl,
  "complaint-intelligence": Complaints,
  "fractallab-flockhunt": Fractal,
};

export default function ProjectCover({ slug, className = "" }: { slug: string; className?: string }) {
  const Art = COVERS[slug];
  return (
    <svg viewBox="0 0 800 600" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {Art ? <Art /> : <rect width="800" height="600" fill={SAND} />}
    </svg>
  );
}
