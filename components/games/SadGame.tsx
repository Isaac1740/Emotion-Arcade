"use client";

import { useRef, useState } from "react";

export default function SadGame() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [brightness, setBrightness] = useState(0.5);
  const [placed, setPlaced] = useState(false);
  const [piecePosition, setPiecePosition] = useState({ x: 50, y: 50 });

  function handleDrop(e: React.DragEvent<HTMLImageElement>) {
    if (placed || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const newX = e.clientX - containerRect.left - 75;
    const newY = e.clientY - containerRect.top - 75;

    // Center snap location
    const targetX = containerRect.width / 2 - 75;
    const targetY = containerRect.height / 2 - 75;

    const distance = Math.sqrt(
      (newX - targetX) ** 2 + (newY - targetY) ** 2
    );

    if (distance < 80) {
      setPiecePosition({ x: targetX, y: targetY });
      setPlaced(true);
      setBrightness(0.9);
    } else {
      setPiecePosition({ x: newX, y: newY });
    }
  }

 return (
  <div
    ref={containerRef}
    className="absolute inset-0 flex items-center justify-center transition-all duration-700"
    style={{
      backdropFilter: `brightness(${brightness})`,
    }}
  >
        {/* Broken Mirror Background */}
<img
  src="/assets/sad/mirror-broken.png"
  alt="Broken Mirror"
  className="w-[450px] max-w-[80vw] opacity-40 pointer-events-none select-none"
  draggable={false}
/>

      {/* Draggable Piece */}
      <img
        src="/assets/sad/mirror-piece-1.png"
        alt="Mirror Piece"
        draggable
        onDragEnd={handleDrop}
        style={{
          position: "absolute",
          left: piecePosition.x,
          top: piecePosition.y,
          width: 150,
          cursor: placed ? "default" : "grab",
        }}
      />
    </div>
  );
}