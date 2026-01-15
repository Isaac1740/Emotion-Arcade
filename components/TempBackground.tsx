"use client";

import { useEmotion } from "@/emotion/EmotionProvider";

export default function TempBackground() {
  const { emotion } = useEmotion();

  const emotionGradients: Record<string, string> = {
    angry: `
      radial-gradient(
        circle at center,
        rgba(255, 80, 80, 0.24) 0%,
        rgba(255, 80, 80, 0.14) 35%,
        rgba(255, 80, 80, 0.07) 55%,
        rgba(0, 0, 0, 1) 80%
      )
    `,
    calm: `
      radial-gradient(
        circle at center,
        rgba(100, 180, 255, 0.22) 0%,
        rgba(100, 180, 255, 0.13) 35%,
        rgba(100, 180, 255, 0.06) 55%,
        rgba(0, 0, 0, 1) 80%
      )
    `,
    happy: `
      radial-gradient(
        circle at center,
        rgba(255, 200, 80, 0.26) 0%,
        rgba(255, 200, 80, 0.15) 35%,
        rgba(255, 200, 80, 0.07) 55%,
        rgba(0, 0, 0, 1) 80%
      )
    `,
    sad: `
      radial-gradient(
        circle at center,
        rgba(120, 120, 255, 0.20) 0%,
        rgba(120, 120, 255, 0.12) 35%,
        rgba(120, 120, 255, 0.06) 55%,
        rgba(0, 0, 0, 1) 80%
      )
    `,
    tired: `
      radial-gradient(
        circle at center,
        rgba(180, 180, 180, 0.18) 0%,
        rgba(180, 180, 180, 0.11) 35%,
        rgba(180, 180, 180, 0.06) 55%,
        rgba(0, 0, 0, 1) 80%
      )
    `,
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, rgba(0,0,0,1) 75%)",
        }}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: emotion ? emotionGradients[emotion] : "transparent",
          opacity: emotion ? 1 : 0,
          transition: "opacity 1s ease",
          animation: emotion
            ? "slowPulse 8s ease-in-out infinite"
            : "none",
          pointerEvents: "none",
        }}
      />
    </>
  );
}
