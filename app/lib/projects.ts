export type Project = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  tagline: string;
  /** Object in the home-page room that represents this project. */
  roomObject: string;
  stats: { value: string; label: string }[];
  tech: string[];
  overview: string;
  highlights: string[];
  results?: string;
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "vaultsphere",
    index: "01",
    title: "VaultSphere",
    subtitle: "Secure project vault & collaboration platform",
    category: "Full-stack · AI",
    status: "Live",
    tagline:
      "A full-stack, AI-powered workspace where students and developers organise projects, files, certificates and teams in one place.",
    roomObject: "The laptop",
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
      "AI-powered file analysis using Groq AI",
      "Certificate management, global search, version history and public sharing",
      "Analytics, activity heatmaps and achievement badges",
      "Separate CEO/admin portal with analytics and ML insights",
      "ML models for satisfaction prediction, recommendation prediction and user clustering",
      "Deployed on Vercel, Render, MongoDB Atlas and Cloudinary",
    ],
    results:
      "A production-deployed system with 12+ backend routes, 6 frontend pages, 3 ML models, 5 supported languages and 8 branded email templates.",
    links: [{ label: "Visit live site", href: "https://vaultsphere.online" }],
  },
  {
    slug: "rescuebot",
    index: "02",
    title: "RescueBot",
    subtitle: "Intelligent swarm robotics for disaster response",
    category: "Robotics · Embedded",
    status: "Hardware",
    tagline:
      "A low-cost autonomous robot that finds victims, classifies obstacles and navigates collapsed buildings and hazard zones.",
    roomObject: "The robot",
    stats: [
      { value: "4", label: "Sensor types fused" },
      { value: "6", label: "Control states" },
      { value: "3", label: "Obstacle classes" },
      { value: "1", label: "Live Wi-Fi dashboard" },
    ],
    tech: [
      "ESP32",
      "Embedded C/C++",
      "Arduino IDE",
      "VL53L0X",
      "PIR",
      "RCWL-0516",
      "MPU6050",
      "TB6612FNG",
      "MATLAB",
      "Simulink",
    ],
    overview:
      "RescueBot combines multiple sensors through sensor fusion and runs autonomous navigation on an ESP32. It is designed for environments like collapsed buildings, earthquakes, mines and industrial hazards.",
    highlights: [
      "ESP32-based autonomous robotic platform",
      "VL53L0X ToF sensors, PIR sensors, RCWL-0516 radar and MPU6050 IMU integrated",
      "Multi-sensor voting for human detection",
      "Obstacle-size classification: SMALL / MEDIUM / WALL",
      "Six-state autonomous control system",
      "Real-time Wi-Fi monitoring and a manual-control dashboard",
      "Sensor filtering, emergency braking and calibrated sensor-angle calculations",
    ],
    results:
      "Hardware, firmware and dashboard validated together — autonomous navigation, human detection, obstacle classification, live sensor monitoring, mapping, manual override and safe-path generation.",
  },
  {
    slug: "gnn-rl-scheduling",
    index: "03",
    title: "GNN-RL Scheduling",
    subtitle: "Correlation- and interference-aware sensor scheduling",
    category: "Research · Graph ML",
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
    tech: [
      "Python",
      "PyTorch",
      "PyTorch Geometric",
      "GraphSAGE",
      "PPO",
      "Stable-Baselines3",
      "Gymnasium",
    ],
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
    index: "04",
    title: "Complaint Intelligence",
    subtitle: "AI-based complaint analysis & decision support",
    category: "NLP · Decision support",
    status: "ML system",
    tagline:
      "An NLP pipeline that classifies customer complaints, reads sentiment, scores urgency and recommends the next action.",
    roomObject: "The inbox tray",
    stats: [
      { value: "SVM", label: "Classifier" },
      { value: "TF-IDF", label: "Text features" },
      { value: "4+", label: "Complaint categories" },
      { value: "Live", label: "Streamlit app" },
    ],
    tech: ["Python", "NLP", "TF-IDF", "SVM", "Sentiment analysis", "Streamlit"],
    overview:
      "Automatically analyzes large volumes of customer complaints — classifying the issue, detecting sentiment, determining urgency and recommending a decision — built on a real-world consumer complaint dataset.",
    highlights: [
      "Text cleaning and preprocessing on real complaint data",
      "TF-IDF text feature extraction",
      "SVM-based complaint classification pipeline",
      "Sentiment analysis",
      "Categories such as payment, loans, fraud and account issues",
      "Rule-based urgency scoring from Critical to Low",
      "Action recommendations based on complaint priority",
      "Interactive Streamlit web app for real-time analysis",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
