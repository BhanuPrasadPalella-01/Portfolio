export type Tag = "AI & ML" | "Robotics" | "Research" | "Web" | "Simulation";

export type Project = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  tags: Tag[];
  status: string;
  tagline: string;
  /** Object in the home-page room that represents this project. */
  roomObject: string;
  team?: string;
  role?: string;
  stats: { value: string; label: string }[];
  tech: string[];
  overview: string;
  highlights: string[];
  results?: string;
  links?: { label: string; href: string }[];
  images?: { src: string; alt: string; caption: string; width: number; height: number }[];
  /** Real photo or screenshot used as the project-page hero instead of the illustrated cover. */
  heroImage?: string;
  /** Self-contained HTML demo embedded on the project page. */
  demo?: { src: string; note: string };
};

const GROUP_10 = "Team of 4 · Group 10, Amrita School of AI";

type Draft = Omit<Project, "index">;

// Order matters: it is the order of the home-page room tour and the work list.
const drafts: Draft[] = [
  {
    slug: "vaultsphere",
    title: "VaultSphere",
    subtitle: "Secure project vault & collaboration platform",
    category: "Full-stack · AI",
    tags: ["Web", "AI & ML"],
    status: "Live",
    tagline:
      "A full-stack, AI-powered workspace where students and developers organise projects, files, certificates and teams in one place.",
    roomObject: "The laptop",
    team: "Solo project",
    stats: [
      { value: "12+", label: "Backend routes" },
      { value: "3", label: "ML models" },
      { value: "5", label: "Languages" },
      { value: "8", label: "Email templates" },
    ],
    tech: [
      "React 19",
      "Node.js 22",
      "Express 5",
      "MongoDB Atlas",
      "JWT",
      "Groq AI",
      "Python",
      "scikit-learn",
      "Cloudinary",
      "Vercel",
      "Render",
    ],
    overview:
      "VaultSphere lets students and developers organize projects, files, certificates, teams, and productivity data in one centralized platform — with AI-powered file analysis, analytics, notifications, and an administrative intelligence dashboard.",
    highlights: [
      "React user portal for project and file management",
      "Node.js/Express REST API on a MongoDB data layer",
      "JWT authentication, OTP verification, password recovery and role-based access control",
      "Collaborative folders with Viewer, Editor and Admin roles",
      "AI-powered file analysis using Groq AI — summary, key points, complexity and tags",
      "Certificate management, global search, version history and public sharing",
      "Analytics, GitHub-style activity heatmaps and achievement badges",
      "Separate CEO/admin portal with analytics and ML insights",
      "ML models for satisfaction prediction, recommendation prediction and user clustering",
      "Interface in English, Hindi, Telugu, Tamil and Malayalam",
    ],
    results:
      "A production-deployed system with 12+ backend routes, 6 frontend pages, 3 ML models, 5 supported languages and 8 branded email templates.",
    links: [{ label: "Visit live site", href: "https://vaultsphere.online" }],
    images: [
      {
        src: "/projects/vaultsphere-login.jpg",
        alt: "VaultSphere sign-in screen",
        caption: "The production sign-in at vaultsphere.online",
        width: 1440,
        height: 900,
      },
    ],
  },
  {
    slug: "protein-structure",
    title: "Protein Structure AI",
    subtitle: "Secondary structure prediction with attention-augmented BiLSTMs",
    category: "Deep learning · Bioinformatics",
    tags: ["AI & ML", "Research", "Web"],
    status: "Live",
    tagline:
      "Predicts whether each amino acid in a protein folds into a helix, strand or coil — from a 68.7% baseline to 80.1% Q3 accuracy.",
    roomObject: "The helix sculpture",
    heroImage: "/projects/protein-overview.jpg",
    team: GROUP_10,
    stats: [
      { value: "80.09%", label: "Q3 accuracy" },
      { value: "10.57", label: "Points gained from PSSM" },
      { value: "128835", label: "Model parameters" },
      { value: "3", label: "Random seeds validated" },
    ],
    tech: ["PyTorch", "BiLSTM", "Self-attention", "NumPy", "scikit-learn", "FastAPI", "React", "Three.js", "Vercel"],
    overview:
      "A deep-learning pipeline trained on the CullPDB dataset and tested on CB513. Each residue is embedded, joined with its 22-value evolutionary PSSM profile, read in both directions by a BiLSTM, refined by multi-head self-attention with a residual connection, and classified as helix, strand or coil. It ships as a live web app with prediction, model comparison and an interactive 3D architecture view.",
    highlights: [
      "Baseline BiLSTM on residue embeddings: 68.73% Q3",
      "Added PSSM evolutionary profiles: 79.30% Q3 (+10.57 points)",
      "Added 4-head self-attention with a residual skip and LayerNorm: 80.09% Q3",
      "Gains validated across 3 random seeds",
      "FastAPI backend serving live predictions",
      "React front end with live prediction, model comparison, sample explorer and a 3D network diagram",
    ],
    results:
      "Evolutionary PSSM profiles closed most of the gap (+10.57 points); self-attention added a smaller but consistent +0.79 points, reaching 80.09% Q3 with a 128,835-parameter model.",
    links: [
      { label: "Try the live app", href: "https://protein-secondary-structure-fronten.vercel.app/" },
      { label: "Front-end code", href: "https://github.com/BhanuPrasadPalella-01/protein-ss-frontend" },
      { label: "Back-end code", href: "https://github.com/BhanuPrasadPalella-01/protein-ss-backend" },
    ],
    images: [
      {
        src: "/projects/protein-overview.jpg",
        alt: "Protein secondary structure app overview showing three model accuracies",
        caption: "Live app — baseline vs. PSSM vs. self-attention",
        width: 1440,
        height: 900,
      },
    ],
  },
  {
    slug: "rescuebot",
    title: "RescueBot",
    subtitle: "Intelligent swarm robotics for disaster response",
    category: "Robotics · Embedded",
    tags: ["Robotics"],
    status: "Hardware",
    tagline:
      "A low-cost autonomous robot that finds victims, classifies obstacles and navigates collapsed buildings and hazard zones.",
    roomObject: "The robot",
    heroImage: "/projects/rescuebot-hardware.jpg",
    team: `${GROUP_10} · guided by Ms. Anjana C.`,
    stats: [
      { value: "6", label: "Control states" },
      { value: "80ms", label: "Control loop" },
      { value: "5", label: "Detection gates" },
      { value: "4", label: "Sensor types fused" },
    ],
    tech: [
      "ESP32",
      "Embedded C/C++",
      "Arduino IDE",
      "VL53L0X",
      "PIR HC-SR501",
      "RCWL-0516",
      "MPU6050",
      "TB6612FNG",
      "MATLAB",
      "Simulink",
    ],
    overview:
      "RescueBot fuses time-of-flight, infrared, microwave-radar and IMU data on an ESP32 to navigate disaster zones on its own. It hosts its own Wi-Fi network and serves a live dashboard with a map, sensor readings and a manual joystick — so rescue teams can follow it to survivors without entering danger first.",
    highlights: [
      "6-state machine: IDLE → EXPLORING → OBSTACLE → CONFIRMING → FOUND → MANUAL",
      "80 ms main loop with an emergency brake below 12 cm checked first, every cycle",
      "Two VL53L0X ToF sensors at measured 35° and 38° angles, with a 5-sample median filter",
      "Obstacle size classes — SMALL steer, MEDIUM turn, WALL long turn — from corrected sin-angle width maths",
      "5-gate human detection voting: dual PIR, RCWL radar (only when motors stop), warm-up and cooldown",
      "Wi-Fi hotspot dashboard at 192.168.4.1: live exploration map, speed control, manual joystick",
    ],
    results:
      "Hardware, firmware and dashboard validated together — autonomous navigation, human detection, obstacle classification, live mapping, manual override and safe-path recording. Known limits: ~45 min battery, ~30 m Wi-Fi range, 2WD on rubble.",
    images: [
      {
        src: "/projects/rescuebot-hardware.jpg",
        alt: "RescueBot hardware: purple 2WD chassis with PIR and radar sensors",
        caption: "The build — dual PIR, RCWL radar, ToF sensors on a 2WD chassis",
        width: 1650,
        height: 2200,
      },
      {
        src: "/projects/rescuebot-dashboard.jpg",
        alt: "RescueBot live dashboard with sensor readings and exploration map",
        caption: "Live dashboard served by the ESP32 — map, sensors, controls",
        width: 1167,
        height: 980,
      },
    ],
  },
  {
    slug: "swarmbot",
    title: "SwarmBot",
    subtitle: "Fault-tolerant multi-robot mapping simulation",
    category: "Swarm robotics · Simulation",
    tags: ["Robotics", "Simulation"],
    status: "Live demo",
    tagline:
      "Three robots map an unknown arena together, keep formation, and re-organise on their own when teammates fail.",
    roomObject: "The swarm arena",
    stats: [
      { value: "3", label: "Robots" },
      { value: "3", label: "Formations" },
      { value: "70px", label: "Minimum separation" },
      { value: "Live", label: "Interactive demo" },
    ],
    tech: ["JavaScript", "HTML5 Canvas", "Boids", "Occupancy grid", "ESP-NOW model"],
    overview:
      "A browser simulation of the swarm layer behind RescueBot. Robots explore with boids-style separation, alignment and cohesion, sweep a time-of-flight ray to discover obstacles, and build an occupancy map in real time. Each robot broadcasts an ESP-NOW-style heartbeat; when one goes silent, the survivors recompute targets and switch formation.",
    highlights: [
      "Hard minimum separation with soft alignment and cohesion bands",
      "Time-of-flight ray casting discovers and logs obstacles as they are seen",
      "Live occupancy map with coverage percentage",
      "Per-robot telemetry: position, velocity, heading, distance, ToF reading",
      "Heartbeat monitor; press 1, 2 or 3 to kill a robot",
      "Automatic re-formation — TRIANGLE → LINE-2 → SOLO — with warning and danger alerts",
    ],
    demo: {
      src: "/demos/swarm.html",
      note: "Press START, then 1, 2 or 3 to knock a robot out and watch the swarm re-form.",
    },
  },
  {
    slug: "adaptive-pso",
    title: "Adaptive PSO Rescue",
    subtitle: "Particle swarm optimisation for multi-robot search & rescue",
    category: "Optimisation · Research",
    tags: ["Research", "Robotics", "AI & ML"],
    status: "Mid review",
    tagline:
      "Collision-free rescue paths for a team of robots, with PSO parameters that adapt as the search progresses.",
    roomObject: "The corkboard",
    team: GROUP_10,
    stats: [
      { value: "3", label: "Rescue robots" },
      { value: "150", label: "PSO iterations" },
      { value: "αT+βP", label: "Objective" },
      { value: "6", label: "Research objectives" },
    ],
    tech: ["MATLAB", "Particle Swarm Optimisation", "Multi-agent dynamics", "Path planning"],
    overview:
      "Rescue-path planning framed as optimisation: minimise F(P) = αT + β·P_obstacle, where T = L / v is rescue time. Robots explore a 2D disaster field, detect the victim by Euclidean distance, then optimise a collision-free path. Standard PSO is the baseline; the adaptive version varies inertia and learning factors over time to avoid stagnation.",
    highlights: [
      "2D multi-robot rescue environment with obstacles",
      "Swarm exploration with separation, cohesion and repulsive obstacle forces",
      "Victim detection via Euclidean distance",
      "Standard PSO baseline with pbest / gbest updates and convergence analysis",
      "Adaptive w(t), c₁(t), c₂(t) with stagnation detection (next stage)",
      "Planned multi-seed statistical comparison and research paper",
    ],
    results:
      "Environment, swarm exploration, victim detection and the Standard PSO baseline are complete, with fitness and convergence analysed. Adaptive parameters and the statistical comparison are underway.",
    images: [
      {
        src: "/projects/pso-rescue-path.jpg",
        alt: "Standard PSO optimised rescue paths for three robots around circular obstacles",
        caption: "Rescue mode — three robots converge on the victim",
        width: 870,
        height: 700,
      },
      {
        src: "/projects/pso-convergence.jpg",
        alt: "Standard PSO rescue-time convergence over 150 iterations",
        caption: "Rescue-time convergence over 150 PSO iterations",
        width: 1114,
        height: 690,
      },
    ],
  },
  {
    slug: "mission-aware-sdr",
    title: "Mission-Aware SDR",
    subtitle: "Continual-learning packet scheduler for emergency networks",
    category: "Wireless · Continual learning",
    tags: ["Research", "AI & ML"],
    status: "Research",
    tagline:
      "A GNU Radio scheduler that re-ranks every packet by mission criticality — so an SOS never waits behind a status ping.",
    roomObject: "The software radio",
    team: GROUP_10,
    stats: [
      { value: "6", label: "Traffic types" },
      { value: "5", label: "Research gaps addressed" },
      { value: "3", label: "Novelties" },
      { value: "2", label: "Phases: sim → hardware" },
    ],
    tech: ["GNU Radio", "Python", "Gradient boosting", "Online learning", "HackRF", "SDR"],
    overview:
      "In disasters, voice, SOS, video, GPS, sensor and telemetry traffic all fight for scarce spectrum, and static QoS treats a trapped victim's SOS like routine telemetry. This framework scores each packet with a Dynamic Mission Criticality Score (DMCS) from message type, sender role, mission phase, congestion and link quality, and a continual-learning engine keeps the scheduler adapting in the field.",
    highlights: [
      "Dynamic Mission Criticality Score recomputed per packet, per mission phase",
      "Continual-learning decision engine — no offline retraining in the field",
      "Congestion prediction that acts before packet loss, not after",
      "Trust / anti-spoofing layer so a compromised node can't mark everything SOS",
      "A mission-success metric weighting delivery by criticality and deadline",
      "Simulation in GNU Radio first, then the same pipeline on real HackRF hardware",
    ],
    results:
      "Architecture and methodology defined; Term 1 validates the scheduler in simulation against FIFO / priority / fair-queue baselines, and Term 2 moves the identical pipeline onto real SDR hardware.",
  },
  {
    slug: "gnn-rl-scheduling",
    title: "GNN-RL Scheduling",
    subtitle: "Correlation- and interference-aware sensor scheduling",
    category: "Research · Graph ML",
    tags: ["Research", "AI & ML"],
    status: "Research",
    tagline:
      "Minimising Age of Information in capacity-constrained wireless sensor networks with graph neural networks and reinforcement learning.",
    roomObject: "The whiteboard",
    stats: [
      { value: "44%", label: "Lower prediction error" },
      { value: "8.4%", label: "AoCI improvement" },
      { value: "20", label: "Simulated sensors" },
      { value: "5", label: "Channel slots" },
    ],
    tech: ["Python", "PyTorch", "PyTorch Geometric", "GraphSAGE", "PPO", "Stable-Baselines3", "Gymnasium"],
    overview:
      "A research project that models both the statistical correlation between sensors and the physical wireless interference as separate graphs, then uses GNNs and reinforcement learning to learn intelligent sensor-scheduling decisions.",
    highlights: [
      "20-sensor IoT simulation with a hard channel capacity of 5 sensors per slot",
      "Online correlation-graph estimation using rolling covariance",
      "GraphSAGE-based encoder for correlated sensor information",
      "PPO-based reinforcement-learning scheduler",
      "Investigated reward-design failures such as sensor starvation and metric exploitation",
      "Anti-starvation reward mechanisms, evaluated on AoI/AoCI",
    ],
    results:
      "The GraphSAGE model reduced masked prediction error by 44%, and the PPO scheduler achieved an 8.4% improvement in AoCI over the AoI baseline without permanently starving sensors. Next: dual-graph integration and validation on real NOAA data.",
  },
  {
    slug: "complaint-intelligence",
    title: "Complaint Intelligence",
    subtitle: "AI-based complaint analysis & decision support",
    category: "NLP · Decision support",
    tags: ["AI & ML", "Web"],
    status: "ML system",
    tagline:
      "An NLP pipeline that classifies customer complaints, reads sentiment, scores urgency and recommends the next action.",
    roomObject: "The inbox tray",
    team: GROUP_10,
    stats: [
      { value: "SVM", label: "Classifier" },
      { value: "TF-IDF", label: "Text features" },
      { value: "4", label: "Priority levels" },
      { value: "3", label: "Sentiment classes" },
    ],
    tech: ["Python", "NLP", "TF-IDF", "SVM", "Sentiment analysis", "Streamlit"],
    overview:
      "Organisations drown in complaint text, and urgent cases get lost. This system analyses a real consumer-complaint dataset end to end — classifying the issue, detecting sentiment, scoring urgency and recommending a decision — and wraps it in a Streamlit app that does all of it from a single pasted complaint.",
    highlights: [
      "Cleaning: missing narratives removed, lower-casing, punctuation, numbers and stop-words stripped",
      "TF-IDF features feeding an SVM classifier",
      "Categories such as payment, loans, fraud and account issues",
      "Positive / neutral / negative sentiment model",
      "Rule-based urgency from sentiment, keywords like “fraud” and complaint type — Critical, High, Medium, Low",
      "Action recommendations: immediate escalation, senior support or complaint team",
      "Interactive Streamlit app for real-time analysis",
    ],
  },
  {
    slug: "fractallab-flockhunt",
    title: "FractalLab & FlockHunt",
    subtitle: "Fractal explorer and boids predator game",
    category: "Graphics · Simulation",
    tags: ["Simulation"],
    status: "Complete",
    tagline:
      "Two simulations that turn maths into play — an interactive multi-fractal engine and a 280-boid flocking game.",
    roomObject: "The fractal print",
    team: GROUP_10,
    role: "Built the FractalPanel rendering engine and the core Boid behaviour.",
    stats: [
      { value: "4", label: "Fractal types" },
      { value: "5", label: "Colour palettes" },
      { value: "280", label: "Boids at 60 fps" },
      { value: "O(n)", label: "Neighbour search" },
    ],
    tech: ["Java 17", "Java Swing", "SwingWorker", "JavaScript", "HTML5 Canvas", "Web Audio API"],
    overview:
      "FractalLab renders Mandelbrot, Julia, Burning Ship and Newton fractals with mouse-wheel zoom, drag-to-pan and PNG export, computing every pixel off the UI thread. FlockHunt implements Reynolds' boids — separation, alignment, cohesion — as a predator game where your cursor hunts the flock, with a spatial grid cutting neighbour search from O(n²) to O(n).",
    highlights: [
      "FractalPanel engine: pixel-by-pixel BufferedImage rendering, zoom 0.8× / 1.25× per tick, drag-to-pan",
      "SwingWorker threading keeps the UI responsive during heavy renders",
      "Model–view–controller split across five Java classes",
      "Boid behaviour: separation (50 px), alignment (75 px), cohesion (100 px) and a predator flee force",
      "Spatial grid of 100 px cells: 78,400 pair checks per frame down to a 3×3 cell lookup",
      "Leader boids, per-round difficulty scaling, synthesised Web Audio sounds and a local leaderboard",
    ],
  },
];

export const projects: Project[] = drafts.map((p, i) => ({
  ...p,
  index: String(i + 1).padStart(2, "0"),
}));

export const TAGS: Tag[] = ["AI & ML", "Robotics", "Research", "Web", "Simulation"];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
