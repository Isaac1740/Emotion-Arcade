"use client";

import { useParams, useRouter } from "next/navigation";
import { useEmotion } from "@/emotion/EmotionProvider";
import { emotions } from "@/emotion/emotionConfig";
import { useEffect } from "react";

export default function EmotionPage() {
  const params = useParams();
  const router = useRouter();
  const emotionKey = params.emotion as keyof typeof emotions;

  const { setEmotion } = useEmotion();

  useEffect(() => {
    if (emotionKey) {
      setEmotion(emotionKey);
    }
  }, [emotionKey, setEmotion]);

  const emotion = emotions[emotionKey];

  if (!emotion) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center text-white px-6">
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 text-white/60 hover:text-white transition"
      >
        ← Back
      </button>

      <h1 className="text-5xl font-semibold mb-6 capitalize">
        {emotion.label}
      </h1>

      <p className="text-white/70 max-w-xl text-lg">
        {emotion.message}
      </p>
    </main>
  );
}
