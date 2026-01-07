"use client";

import EmotionOrb from "@/components/EmotionOrb";
import { useEmotion } from "@/emotion/EmotionProvider";
import { emotions } from "@/emotion/emotionConfig";

export default function Home() {
  const { setEmotion } = useEmotion();

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold mb-2 text-white">
        How are you feeling?
      </h1>

      <p className="text-white/60 mb-10 max-w-xl">
        Choose an emotion. There’s no right or wrong — only what feels true for you.
      </p>

      <div
        style={{
          display: "flex",
          gap: "48px",
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: "900px",
        }}
      >
        {Object.entries(emotions).map(([key, emotion]) => (
          <EmotionOrb
            key={key}
            label={emotion.label}
            emotion={key as any}
            onHoverStart={() => setEmotion(key as any)}
            onHoverEnd={() => setEmotion(null)}
          />
        ))}
      </div>

      <p className="text-sm text-white/40 mt-10">
        Hover to preview • Click to enter
      </p>
    </main>
  );
}
