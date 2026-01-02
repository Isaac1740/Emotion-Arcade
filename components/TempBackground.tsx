"use client";

import { useEmotion } from "../emotion/EmotionProvider";

export default function Background() {
  const { emotion } = useEmotion();

  let background = "radial-gradient(circle at top, #141414, #000000)";

  if (emotion === "angry") {
    background =
      "radial-gradient(circle at top, rgba(255,60,60,0.35), #000000 65%)";
  }

  if (emotion === "calm") {
    background =
      "radial-gradient(circle at top, rgba(120,180,255,0.35), #000000 65%)";
  }

  return (
    <div
      className="fixed inset-0 transition-all duration-700 pointer-events-none"
      style={{
        background,
        zIndex: 0,
      }}
    />
  );
}
