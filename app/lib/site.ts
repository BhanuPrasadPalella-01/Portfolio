export const site = {
  name: "Bhanu Prasad Palella",
  short: "Bhanu Prasad",
  role: "AI & Data Science",
  school: "Amrita School of Artificial Intelligence",
  location: "Coimbatore, India",
  email: "bhanuprasadpalella@gmail.com",
  github: "https://github.com/BhanuPrasadPalella-01",
  linkedin: "https://www.linkedin.com/in/bhanuprasadpalella",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/notes", label: "Notes" },
  { href: "/contact", label: "Contact" },
];

// Newest first. `programUrl` links to the program page where one is known.
export const certificates: {
  issuer: string;
  title: string;
  date: string;
  pdf: string;
  preview: string;
  programUrl?: string;
  skills?: string[];
}[] = [
  {
    issuer: "Siemens",
    title: "Operations Industrial Engineer Job Simulation",
    date: "Oct 2026",
    pdf: "/certificates/siemens-operations-industrial-engineer.pdf",
    preview: "/certificates/previews/siemens-operations-industrial-engineer.png",
    skills: ["Time studies", "Proposing layout changes"],
  },
  {
    issuer: "Deloitte",
    title: "Data Analytics Job Simulation",
    date: "Aug 2026",
    pdf: "/certificates/deloitte-data-analytics.pdf",
    preview: "/certificates/previews/deloitte-data-analytics.png",
    programUrl: "https://www.theforage.com/simulations/deloitte-au/data-analytics-s5zy",
  },
  {
    issuer: "TATA",
    title: "GenAI Powered Data Analytics Job Simulation",
    date: "Aug 2026",
    pdf: "/certificates/tata-genai-data-analytics.pdf",
    preview: "/certificates/previews/tata-genai-data-analytics.png",
    programUrl: "https://www.theforage.com/simulations/tata/data-analytics-t3zr",
  },
];

export const stack = [
  {
    group: "Machine learning",
    items: ["PyTorch", "PyTorch Geometric", "Stable-Baselines3", "scikit-learn", "NLP / TF-IDF"],
  },
  { group: "Systems & hardware", items: ["ESP32", "Embedded C/C++", "MATLAB", "Simulink"] },
  {
    group: "Web & cloud",
    items: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Vercel"],
  },
];
