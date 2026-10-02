import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// bp monogram on ink (iOS adds its own rounded corners).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16181D",
          color: "#F4F0E8",
          fontSize: 96,
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          letterSpacing: -2,
          paddingBottom: 8,
        }}
      >
        bp
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: "#B5844F",
            marginLeft: 4,
            marginTop: 44,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
