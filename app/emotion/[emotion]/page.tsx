"use client";

import { useParams, useRouter } from "next/navigation";
import { useEmotion } from "@/emotion/EmotionProvider";
import { useEffect } from "react";

export default function EmotionPage() {
  const params = useParams();
  const router = useRouter();
  const emotion = params.emotion as string;

  const { setEmotion } = useEmotion();

  useEffect(() => {
    if (emotion) {
      setEmotion(emotion as any);
    }
  }, [emotion, setEmotion]);

  const isCalm = emotion === "calm";
  const isAngry = emotion === "angry";

  const emotionMessage = isCalm
    ? "Slow down. Breathe. You are safe here."
    : isAngry
    ? "It’s okay to feel this. Let it move, not explode."
    : "";

  return (
    <main
      className={`min-h-screen w-full flex flex-col items-center justify-center text-center px-6 text-white
      ${isCalm ? "tracking-wide" : ""}
      ${isAngry ? "tracking-tight" : ""}`}
      style={{
        transition: "all 0.6s ease",
      }}
    >
      {/* Back */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 text-white/60 hover:text-white transition"
      >
        ← Back
      </button>

      {/* Emotion Title */}
      <h1
        className={`font-semibold capitalize mb-6
        ${isCalm ? "text-5xl" : ""}
        ${isAngry ? "text-6xl" : "text-5xl"}`}
        style={{
          transition: "transform 0.6s ease",
          transform: isCalm
            ? "translateY(-4px)"
            : isAngry
            ? "translateY(2px)"
            : "none",
        }}
      >
        {emotion}
      </h1>

      {/* Emotion Message */}
      <p
        className="text-white/65 max-w-xl mb-16 text-lg"
        style={{
          lineHeight: isCalm ? "1.9" : "1.6",
        }}
      >
        {emotionMessage}
      </p>

      {/* Content Placeholder */}
      <div
        className="w-full max-w-2xl h-48 border border-white/10 rounded-xl flex items-center justify-center text-white/40"
        style={{
          transform: isAngry ? "scale(0.98)" : "scale(1)",
          transition: "transform 0.4s ease",
        }}
      >
        Emotion experience coming here
      </div>
    </main>
  );
}
