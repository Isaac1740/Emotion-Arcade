"use client";

import EmotionOrb from "@/components/EmotionOrb";
import { useEmotion } from "../emotion/EmotionProvider";

export default function Home() {
  const { setEmotion } = useEmotion();

  return (
    <main
      className="h-screen w-full flex flex-col items-center justify-center text-center"
      style={{ background: "transparent" }}
    >
      {/* Heading */}
      <h1 className="text-4xl font-semibold mb-2 text-white">
        How are you feeling?
      </h1>

      {/* Subtitle */}
      <p className="text-white/60 mb-10 max-w-xl">
        Choose an emotion. There’s no right or wrong — only what feels true for you.
      </p>

      {/* ORB CONTAINER */}
      <div
        style={{
          display: "flex",
          gap: "64px",
          marginTop: "32px",
        }}
      >
        {/* Angry Orb */}
        <EmotionOrb
          label="Angry"
          emotion="angry"
          onHoverStart={() => setEmotion("angry")}
          onHoverEnd={() => setEmotion(null)}
        />

        {/* Calm Orb */}
        <EmotionOrb
          label="Calm"
          emotion="calm"
          onHoverStart={() => setEmotion("calm")}
          onHoverEnd={() => setEmotion(null)}
        />
      </div>

      {/* Footer Hint */}
      <p className="text-sm text-white/40 mt-8">
        Hover to preview • Click later to enter
      </p>
    </main>
  );
}
