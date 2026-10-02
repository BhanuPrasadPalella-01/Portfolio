import { ImageResponse } from "next/og";
import { getProject, projects } from "../../lib/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project by Bhanu Prasad Palella";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

// Per-project share card: title, tagline and the two headline stats.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#16181D" }} />, size);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F4F0E8", padding: 72, fontFamily: "Georgia, serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "#16181D", color: "#F4F0E8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontStyle: "italic" }}>
              bp
            </div>
            <div style={{ fontSize: 26, color: "#5A5E67", fontFamily: "monospace", letterSpacing: 2 }}>
              {`${p.index} · ${p.category.toUpperCase()}`}
            </div>
          </div>
          <div style={{ fontSize: 22, color: "#8A5C2C", fontFamily: "monospace", border: "2px solid #DCD4C4", borderRadius: 40, padding: "8px 22px" }}>
            {p.status.toUpperCase()}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, color: "#16181D", letterSpacing: -3, lineHeight: 1 }}>{p.title}</div>
          <div style={{ fontSize: 34, color: "#5A5E67", marginTop: 24, lineHeight: 1.3, maxWidth: 1000 }}>{p.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 56, alignItems: "flex-end" }}>
          {p.stats.slice(0, 2).map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 64, color: "#8A5C2C" }}>{s.value}</div>
              <div style={{ fontSize: 22, color: "#5A5E67", fontFamily: "monospace" }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 24, color: "#16181D", fontFamily: "monospace" }}>bhanuprasadpalella.vercel.app</div>
        </div>
      </div>
    ),
    size
  );
}
