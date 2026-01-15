"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { emotions, EmotionKey } from "@/emotion/emotionConfig";

type EmotionOrbProps = {
  label: string;
  emotion: EmotionKey;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};

export default function EmotionOrb({
  label,
  emotion,
  onHoverStart,
  onHoverEnd,
}: EmotionOrbProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const color = emotions[emotion].color;

  const baseGlow = `${color}0.30)`;
  const hoverGlow = `${color}0.45)`;

  return (
    <div
      onMouseEnter={() => {
        setHovered(true);
        onHoverStart();
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverEnd();
      }}
      onClick={() => router.push(`/emotion/${emotion}`)}
      style={{
        width: 140,
        height: 140,
        borderRadius: "50%",

        background: `linear-gradient(
          135deg,
          ${color}0.18),
          rgba(255,255,255,0.08)
        )`,

        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.28)",

        transform: hovered ? "scale(1.06)" : "scale(1)",
        boxShadow: hovered
          ? `
            0 0 55px ${hoverGlow},
            0 25px 50px rgba(0,0,0,0.35),
            inset 0 0 22px rgba(255,255,255,0.28)
          `
          : `
            0 0 40px ${baseGlow},
            0 20px 40px rgba(0,0,0,0.25),
            inset 0 0 20px rgba(255,255,255,0.25)
          `,

        transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.35s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: 500,
        color: "rgba(255,255,255,0.9)",
        textShadow: "0 1px 2px rgba(0,0,0,0.4)",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {label}
    </div>
  );
}
