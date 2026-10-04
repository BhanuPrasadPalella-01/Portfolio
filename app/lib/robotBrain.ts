import { projects, type Project } from "./projects";
import { certificates, site, stack } from "./site";

// RescueBot's offline brain: keyword matching over the real project data.
// Every answer is assembled from lib/projects and lib/site, so it never makes things up.

export type Reply = { text: string; link?: { label: string; href: string } };

const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9+.#\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

// Keys ending in "*" match as prefixes ("cert*" → certificate); others must match whole words.
const has = (q: string[], ...keys: string[]) =>
  keys.some((k) => (k.endsWith("*") ? q.some((w) => w.startsWith(k.slice(0, -1))) : q.includes(k)));

function projectScore(p: Project, q: string[]) {
  const hay = words(
    [p.title, p.subtitle, p.category, p.tags.join(" "), p.tech.join(" "), p.tagline, p.roomObject, p.slug.replace(/-/g, " ")].join(" ")
  );
  let s = 0;
  for (const w of q) {
    if (w.length < 3) continue;
    if (words(p.title).some((t) => t.startsWith(w))) s += 5;
    if (hay.includes(w)) s += 2;
    else if (hay.some((h) => h.startsWith(w))) s += 1;
  }
  return s;
}

function describe(p: Project): Reply {
  const stat = p.stats[0];
  return {
    text: `${p.title}: ${p.tagline} Headline number: ${stat.value} ${stat.label.toLowerCase()}. Built with ${p.tech.slice(0, 4).join(", ")}.`,
    link: { label: `Open ${p.title}`, href: `/work/${p.slug}` },
  };
}

export function answer(input: string): Reply {
  const q = words(input);
  if (q.length === 0) return { text: "Beep? Ask me about Bhanu's projects, skills, or how to get in touch." };

  if (has(q, "hi", "hello", "hey", "yo", "namaste", "sup"))
    return { text: "Hello, human! I'm RescueBot. Ask me what Bhanu builds — try “robotics”, “best project” or “how do I get in touch?”" };

  if (has(q, "contact*", "email", "mail", "reach", "hire", "hiring", "intern*", "linkedin", "talk", "touch"))
    return {
      text: `Best way: email ${site.email}. Bhanu is open to internships, research collaborations and ambitious side projects.`,
      link: { label: "Contact page", href: "/contact" },
    };

  if (has(q, "skill*", "stack", "tool*", "language*", "tech", "technologies"))
    return {
      text: stack.map((s) => `${s.group}: ${s.items.slice(0, 4).join(", ")}`).join(". ") + ".",
      link: { label: "About Bhanu", href: "/about" },
    };

  if (has(q, "study", "studies", "studying", "college", "university", "amrita", "degree", "education", "student"))
    return { text: `Bhanu is doing a B.Tech in ${site.role} at the ${site.school}, Amrita Vishwa Vidyapeetham, in ${site.location}.` };

  if (has(q, "cert*", "deloitte", "tata", "forage"))
    return {
      text: `${certificates.length} industry job simulations: ${certificates.map((c) => `${c.issuer} — ${c.title}`).join("; ")}.`,
      link: { label: "See certificates", href: "/about" },
    };

  if (has(q, "resume", "cv"))
    return { text: "There's a printable resume — one click to save it as a PDF.", link: { label: "Open resume", href: "/resume" } };

  if (has(q, "best", "favourite", "favorite", "proud*", "top", "flagship", "impressive"))
    return {
      text: "Hard to pick, but: VaultSphere is live in production, Protein Structure AI hits 80.09% Q3 accuracy, and I'm literally RescueBot. Biased? Maybe.",
      link: { label: "All work", href: "/work" },
    };

  if ((has(q, "rescuebot") || (has(q, "who") && has(q, "you", "are"))) && !has(q, "swarm", "arena"))
    return {
      text: "I'm RescueBot — an ESP32 robot with ToF, PIR, radar and IMU sensors that hunts for survivors. In here I just hunt for cursors.",
      link: { label: "My real-world twin", href: "/work/rescuebot" },
    };

  if (has(q, "joke*", "funny", "lol"))
    return { text: "Why did the robot cross the room? Its PSO converged there. …I'll see myself out." };

  if (has(q, "secret*", "easter", "egg*", "hidden"))
    return { text: "Psst: try the Konami code (↑↑↓↓←→←→BA), type “hello”, double-click the lamp, or knock over the mug. Also ⌘K." };

  if (has(q, "many", "count") && has(q, "project*"))
    return { text: `${projects.length} projects so far — web, AI, robotics, research and simulations.`, link: { label: "All work", href: "/work" } };

  const ranked = projects
    .map((p) => ({ p, s: projectScore(p, q) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);

  if (ranked.length === 1 || (ranked.length > 1 && ranked[0].s >= ranked[1].s * 1.6)) return describe(ranked[0].p);
  if (ranked.length > 1) {
    const names = ranked.slice(0, 3).map((r) => r.p.title);
    return {
      text: `A few match: ${names.join(", ")}. ${ranked[0].p.title} is the closest — ${ranked[0].p.tagline}`,
      link: { label: `Open ${ranked[0].p.title}`, href: `/work/${ranked[0].p.slug}` },
    };
  }

  return { text: "My sensors came up empty. Try a topic like “NLP”, “robots”, “React”, “protein” or “swarm”." };
}

export const suggestions = ["Best project?", "Robotics work?", "Which skills?", "How do I get in touch?"];
