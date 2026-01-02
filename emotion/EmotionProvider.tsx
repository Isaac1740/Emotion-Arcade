"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Emotion = "angry" | "calm" | null;

type EmotionContextType = {
  emotion: Emotion;
  setEmotion: (e: Emotion) => void;
};

const EmotionContext = createContext<EmotionContextType | undefined>(undefined);

export function EmotionProvider({ children }: { children: React.ReactNode }) {
  const [emotion, setEmotion] = useState<Emotion>(null);

  useEffect(() => {
    const body = document.body;

   if (emotion === "angry") {
  body.style.background = `
    radial-gradient(circle at center, rgba(255, 60, 60, 0.45), transparent 60%),
    radial-gradient(circle at center, rgba(180, 20, 20, 0.35), transparent 70%),
    #000000
  `;
}
else if (emotion === "calm") {
  body.style.background = `
    radial-gradient(circle at center, rgba(120, 180, 255, 0.4), transparent 60%),
    radial-gradient(circle at center, rgba(80, 120, 200, 0.3), transparent 70%),
    #000000
  `;
}

    else {
  body.style.background = `
    radial-gradient(circle at center, #141414, #000000)
  `;
}


    body.style.transition = "background 700ms ease";
  }, [emotion]);

  return (
    <EmotionContext.Provider value={{ emotion, setEmotion }}>
      {children}
    </EmotionContext.Provider>
  );
}

export function useEmotion() {
  const ctx = useContext(EmotionContext);
  if (!ctx) {
    throw new Error("useEmotion must be used inside EmotionProvider");
  }
  return ctx;
}
