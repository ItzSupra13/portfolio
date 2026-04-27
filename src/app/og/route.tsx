import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    <div style={{ fontSize: 80, background: "black", color: "white" }}>AsterDev 🚀</div>,
    { width: 1200, height: 630 },
  );
}
