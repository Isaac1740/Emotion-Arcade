"use client";

import { useEmotion } from "../emotion/EmotionProvider";

export default function Home() {
  const { setEmotion } = useEmotion();

  return (
    <main
      className="h-screen w-full flex flex-col items-center justify-center text-center"
      style={{ background: "transparent" }}
    >
      <h1 className="text-4xl font-semibold mb-2">
        How are you feeling?
      </h1>

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
  {/* Angry */}
  <div
    onMouseEnter={() => setEmotion("angry")}
    onMouseLeave={() => setEmotion(null)}
    style={{
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      backgroundColor: "red",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      fontWeight: 500,
      cursor: "pointer",
      color: "white",
    }}
  >
    Angry
  </div>

  {/* Calm */}
  <div
    onMouseEnter={() => setEmotion("calm")}
    onMouseLeave={() => setEmotion(null)}
    style={{
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      backgroundColor: "blue",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      fontWeight: 500,
      cursor: "pointer",
      color: "white",
    }}
  >
    Calm
  </div>
</div>


      <p className="text-sm text-white/40 mt-8">
        Hover to preview • Click later to enter
      </p>
    </main>
  );
}
