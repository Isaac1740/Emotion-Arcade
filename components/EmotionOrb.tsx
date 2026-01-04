"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EmotionOrbProps = {
  label: string;
  emotion: "angry" | "calm";
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

  const glowColor =
    emotion === "angry"
      ? "rgba(255, 80, 80, 0.45)"
      : "rgba(100, 180, 255, 0.45)";

  const baseGlow =
    emotion === "angry"
      ? "rgba(255, 80, 80, 0.30)"
      : "rgba(100, 180, 255, 0.30)";

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

        /* Glass surface + emotion tint */
        background:
          emotion === "angry"
            ? "linear-gradient(135deg, rgba(255,80,80,0.18), rgba(255,255,255,0.08))"
            : "linear-gradient(135deg, rgba(100,180,255,0.18), rgba(255,255,255,0.08))",

        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.28)",

        /* Micro-interaction magic */
        transform: hovered ? "scale(1.06)" : "scale(1)",
        boxShadow: hovered
          ? `
            0 0 55px ${glowColor},
            0 25px 50px rgba(0,0,0,0.35),
            inset 0 0 22px rgba(255,255,255,0.28)
          `
          : `
            0 0 40px ${baseGlow},
            0 20px 40px rgba(0,0,0,0.25),
            inset 0 0 20px rgba(255,255,255,0.25)
          `,

        transition: "transform 0.25s ease, box-shadow 0.35s ease",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        fontSize: 18,
        fontWeight: 500,
        color: "white",

        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {label}
    </div>
  );
}
