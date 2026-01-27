"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { emotions } from "@/emotion/emotionConfig";
import { useEmotion } from "@/emotion/EmotionProvider";
import AngryGame from "@/components/games/AngryGame";



export default function EmotionPage() {
  const params = useParams();
  const router = useRouter();

  const emotionKey = params.emotion as keyof typeof emotions;
  const emotion = emotions[emotionKey];

  const { setEmotion } = useEmotion();


  // Sync URL emotion with global emotion state
  useEffect(() => {
    if (emotionKey && emotion) {
      setEmotion(emotionKey);
    }
  }, [emotionKey, emotion, setEmotion]);

  if (!emotion) return null;

  // Emotion-specific backgrounds
  const backgrounds: Record<string, string> = {
    calm: "radial-gradient(circle at center, #1e3a8a, #020617)",
    angry: "radial-gradient(circle at center, #7f1d1d, #020617)",
    happy: "radial-gradient(circle at center, #b45309, #020617)",
    sad: "radial-gradient(circle at center, #312e81, #020617)",
    tired: "radial-gradient(circle at center, #3f3f46, #020617)",
  };

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center text-center text-white px-6 transition-all duration-700 overflow-hidden"
      style={{
        background: backgrounds[emotionKey] || "#020617",
      }}
    >
      {/* GAME LAYER (only for angry) */}
      {emotionKey === "angry" && <AngryGame/>}

      {/* UI LAYER */}
      <div className="relative z-10 max-w-xl">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute -top-16 left-0 text-white/60 hover:text-white transition"
        >
          ← Back
        </button>

        {/* Emotion Title */}
        <h1 className="text-5xl font-semibold mb-6 capitalize">
          {emotion.label}
        </h1>

        {/* Emotion Message */}
        <p className="text-white/70 text-lg">
          {emotion.message}
        </p>

        {/* Hint */}
        {emotionKey === "angry" && (
          <p className="mt-4 text-white/40 text-sm animate-fade">
            Click or swipe to release
          </p>
        )}

      </div>
    </main>
  );
}
