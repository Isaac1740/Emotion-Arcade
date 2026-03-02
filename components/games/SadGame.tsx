"use client";

import { useState } from "react";

export default function SadGame() {
  const [brightness, setBrightness] = useState(0.5);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center transition-all duration-700"
      style={{
        backdropFilter: `brightness(${brightness})`,
      }}
    >
      <div className="text-white/40 text-lg">
        Sad Game Starting...
      </div>
    </div>
  );
}