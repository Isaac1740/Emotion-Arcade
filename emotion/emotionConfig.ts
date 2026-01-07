export const emotions = {
  happy: {
    label: "Happy",
    message: "Let this feeling spread. You don’t need to hold back.",
    color: "rgba(255, 200, 80,",
  },
  calm: {
    label: "Calm",
    message: "Slow down. Breathe. You are safe here.",
    color: "rgba(100, 180, 255,",
  },
  angry: {
    label: "Angry",
    message: "It’s okay to feel this. Let it move, not explode.",
    color: "rgba(255, 80, 80,",
  },
  sad: {
    label: "Sad",
    message: "It’s okay to feel heavy. You don’t need to rush.",
    color: "rgba(120, 120, 255,",
  },
  tired: {
    label: "Tired",
    message: "You don’t need motivation right now. Just rest.",
    color: "rgba(180, 180, 180,",
  },
} as const;

export type EmotionKey = keyof typeof emotions;
