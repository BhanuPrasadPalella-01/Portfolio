import { ImageResponse } from "next/og";

export const alt = "Bhanu Prasad Palella — AI & Data Science Portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const dots = [
  { x: 60, y: 80, r: 4 },
  { x: 160, y: 220, r: 3 },
  { x: 90, y: 400, r: 5 },
  { x: 240, y: 520, r: 3 },
  { x: 1080, y: 90, r: 4 },
  { x: 1140, y: 260, r: 3 },
  { x: 1020, y: 420, r: 5 },
  { x: 1110, y: 550, r: 3 },
  { x: 40, y: 260, r: 3 },
  { x: 1160, y: 400, r: 3 },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4F0E8",
          position: "relative",
        }}
      >
        {dots.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: d.r * 2,
              height: d.r * 2,
              borderRadius: "50%",
              background: "#8A5C2C",
              opacity: 0.6,
            }}
          />
        ))}

        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#5A5E67",
            marginBottom: 28,
          }}
        >
          AI &amp; Data Science · Portfolio
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 600,
            color: "#16181D",
            lineHeight: 1.05,
          }}
        >
          Bhanu Prasad Palella
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 26,
            color: "#5A5E67",
          }}
        >
          Amrita School of Artificial Intelligence (ASAI)
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            padding: "10px 26px",
            borderRadius: 999,
            background: "#16181D",
            color: "#F4F0E8",
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          Swarm Intelligence · Protein Prediction · VaultSphere
        </div>
      </div>
    ),
    { ...size }
  );
}