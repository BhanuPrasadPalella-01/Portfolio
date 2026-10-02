// Short technical write-ups. Every number comes from the project decks and code.

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; text: string }
  | { type: "quote"; text: string };

export type Note = {
  slug: string;
  title: string;
  dek: string;
  project: string;
  minutes: number;
  body: Block[];
};

export const notes: Note[] = [
  {
    slug: "pssm-beat-architecture",
    title: "Evolution beat architecture: +10.57 points from one input",
    dek: "Why adding evolutionary profiles mattered far more than adding attention in our protein secondary-structure model.",
    project: "protein-structure",
    minutes: 4,
    body: [
      { type: "p", text: "The task: for every amino acid in a protein, predict whether it sits in a helix (H), a strand (E) or a coil (C). The standard score is Q3 — the share of residues labelled correctly. We trained on CullPDB and tested on CB513." },
      { type: "h", text: "Three models, one surprise" },
      { type: "list", items: ["Baseline BiLSTM on residue embeddings: 68.73% Q3", "Same network plus PSSM profiles: 79.30% Q3 — +10.57 points", "Plus 4-head self-attention with a residual skip and LayerNorm: 80.09% Q3 — +0.79 points"] },
      { type: "p", text: "The architectural upgrade everyone expects to matter — attention — moved the needle less than a point. The input upgrade moved it more than ten." },
      { type: "h", text: "What a PSSM adds" },
      { type: "p", text: "A position-specific scoring matrix summarises how each position varies across related proteins in evolution. Positions that tolerate only certain substitutions carry structural constraints a single sequence can't reveal. Each residue gets 22 extra numbers, concatenated with its 32-dimensional embedding before the BiLSTM." },
      { type: "code", text: "embedding(32) ‖ pssm(22) → BiLSTM(64×2) → self-attention(4×32) + skip → LayerNorm → Linear(3)" },
      { type: "h", text: "Takeaways" },
      { type: "list", items: ["Fix the information before the architecture: the model can't attend to signal it never receives.", "Small gains need proof — the +0.79 from attention held across 3 random seeds before we trusted it.", "The whole model is 128,835 parameters. Good inputs beat big networks."] },
      { type: "quote", text: "The live demo runs the sequence-only baseline, because a pasted sequence has no PSSM. That gap is the lesson in miniature." },
    ],
  },
  {
    slug: "swarm-losing-gracefully",
    title: "Teaching three robots to lose gracefully",
    dek: "How the SwarmBot simulation keeps mapping when teammates fail — and why separation rules matter more than speed.",
    project: "swarmbot",
    minutes: 3,
    body: [
      { type: "p", text: "A swarm is only useful in a disaster if it degrades gracefully. SwarmBot simulates three robots mapping an unknown arena; you can knock any of them out with the 1, 2 and 3 keys and watch the rest adapt." },
      { type: "h", text: "Three distance bands" },
      { type: "list", items: ["Below 70 px: hard separation, scaled steeply so robots never collide.", "70–110 px: gentle alignment — match neighbours' velocity.", "Beyond 160 px: cohesion pulls the robot back so the group stays in radio range."] },
      { type: "p", text: "Obstacle repulsion and wall forces sit on top, plus a little random wander so the swarm doesn't settle into loops." },
      { type: "h", text: "Heartbeats and re-formation" },
      { type: "p", text: "Each robot broadcasts an ESP-NOW-style heartbeat. When one goes silent, survivors compute a new centroid and new formation targets: a triangle with three robots, a line of two, solo with one. Alerts escalate with losses — a warning at two down, a do-not-enter danger state when the whole swarm is gone." },
      { type: "h", text: "Mapping as a side effect" },
      { type: "p", text: "Every robot sweeps a time-of-flight ray ahead of it. Cells it passes through mark the occupancy grid as explored; rays that hit an obstacle log its position. Coverage percentage falls out for free." },
      { type: "quote", text: "The hardest part wasn't the motion — it was deciding what “safe” means when information disappears." },
    ],
  },
  {
    slug: "rescuebot-sensor-angles",
    title: "The 0.707 assumption that broke our obstacle sizing",
    dek: "Measuring the real mounting angles on RescueBot's ToF sensors — and the small fixes that made detection trustworthy.",
    project: "rescuebot",
    minutes: 3,
    body: [
      { type: "p", text: "RescueBot classifies obstacles as SMALL, MEDIUM or WALL to decide whether to steer, turn, or make a long turn. The size estimate comes from two VL53L0X time-of-flight sensors angled outward from the chassis." },
      { type: "h", text: "The bug" },
      { type: "p", text: "The default width formula assumed both sensors sat at 45°, multiplying by sin 45° ≈ 0.707. On the real chassis we measured 35° on the left and 38° on the right. Every width estimate was quietly off." },
      { type: "code", text: "width = distL × sin(35°) + distR × sin(38°)   // was: (distL + distR) × 0.707" },
      { type: "h", text: "Other fixes that mattered" },
      { type: "list", items: ["A 15-read warm-up flush per sensor, which eliminated garbage 8191 mm readings at boot.", "A rolling 5-sample median filter to kill single-read noise spikes.", "An emergency brake below 12 cm, checked first in every 80 ms loop.", "Human detection by voting: two PIRs plus the RCWL radar — and the radar only votes when the motors are stopped, because the robot's own motion triggers it."] },
      { type: "quote", text: "Measure the hardware you have, not the hardware the example code assumed." },
    ],
  },
];

export function getNote(slug: string) {
  return notes.find((n) => n.slug === slug);
}
