"use client";

import { useEmotion } from "@/emotion/EmotionProvider";

export default function TempBackground() {
  const { emotion } = useEmotion();

  return (
    <>
      {/* Base dark background (never changes) */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          background: "radial-gradient(circle at center, rgba(255,255,255,0.015) 0%, rgba(0,0,0,1) 75%)",
        }}
      />

      {/* Emotion glow overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,

          background:
            emotion === "angry"
              ? `
                radial-gradient(
                  circle at center,
                  rgba(255, 80, 80, 0.16) 0%,
                  rgba(255, 80, 80, 0.10) 30%,
                  rgba(255, 80, 80, 0.05) 50%,
                  rgba(0, 0, 0, 1) 75%
                )
              `
              : emotion === "calm"
              ? `
                radial-gradient(
                  circle at center,
                  rgba(100, 180, 255, 0.14) 0%,
                  rgba(100, 180, 255, 0.09) 32%,
                  rgba(100, 180, 255, 0.045) 52%,
                  rgba(0, 0, 0, 1) 75%
                )
              `
              : "transparent",

          // ONLY opacity is animated (safe)
          opacity: emotion ? 1 : 0,
          transition: "opacity 0.6s ease",

          // Gentle breathing, no brightness spikes
          animation: emotion
            ? "slowPulse 6s ease-in-out infinite"
            : "none",

          pointerEvents: "none",
        }}
      />
    </>
  );
}
