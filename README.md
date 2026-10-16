# Bhanu Prasad Palella: Portfolio

**Live site:** <https://bhanuprasadpalella.vercel.app>

Personal portfolio of an AI & Data Science student at Amrita School of Artificial Intelligence. The home page
is an interactive 3D room: each object in it is a project, and a small rescue robot answers questions about
the work.

## What's inside

* **3D room home page:** a camera tour through the room, where each object opens a project (React Three Fiber).
* **9 project pages** (`/work`): research, robotics, ML systems and web apps, each with an overview,
  highlights, results, tech stack and links to code or live demos.
* **RescueBot chat:** answers questions about the projects, skills and contact details. It uses Claude when
  `ANTHROPIC_API_KEY` is set and falls back to an offline keyword brain otherwise. The API only accepts
  same-site requests and is rate-limited per visitor.
* **Notes** (`/notes`): short write-ups of lessons from the projects.
* **About, Resume and Contact** pages, a command palette, light/dark themes, optional sound, page transitions
  and smooth scrolling.
* Generated link-preview images for the site and for each project page.

## Built with

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Three.js with React Three Fiber, drei and
postprocessing, GSAP, Lenis, the Anthropic SDK, and Vercel Analytics.

## Run locally

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>. The chat works without a key (offline answers); to use Claude, create
`.env.local` with:

```bash
ANTHROPIC_API_KEY=your-key
```

Other scripts: `npm run build`, `npm start`, `npm run lint`.

## Where things live

```
app/page.tsx              Home page with the 3D room
app/components/room/      Room scene, camera rig, models, robot and chat
app/work/[slug]/          Project pages
app/lib/projects.ts       All project content (also what the chat knows)
app/lib/site.ts           Name, contact links, skills and certificates
app/lib/notes.ts          Notes content
app/api/robot/route.ts    RescueBot chat API
public/                   Models, photos, project images and certificates
```

## Deploy

Deployed on Vercel: every push to `main` builds and goes live. Set `ANTHROPIC_API_KEY` in the Vercel
project's environment variables to enable Claude answers, and set a spend limit on that key in the Anthropic
Console.
