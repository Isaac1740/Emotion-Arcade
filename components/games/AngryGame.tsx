"use client";

import { useEffect, useRef, useState } from "react";

type Bullet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type Demon = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
};

type Mode = "release" | "control" | "channel";

const MODE_CONFIG = {
  release: {
    spawnRate: 500,
    maxDemons: 6,
    speedRange: [0.9, 1.4],
  },
  control: {
    spawnRate: 1200,
    maxDemons: 3,
    speedRange: [0.6, 0.9],
  },
  channel: {
    spawnRate: 2000,
    maxDemons: 1,
    speedRange: [0.4, 0.6],
  },
};

export default function AngryGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const bullets = useRef<Bullet[]>([]);
  const demons = useRef<Demon[]>([]);

  const [mode, setMode] = useState<Mode>("release");
  const modeRef = useRef<Mode>("release");

  const lastSpawnTime = useRef(0);
  const animationId = useRef<number | null>(null);

  // 🔊 Shoot sound
  const shootSound = useRef<HTMLAudioElement | null>(null);

  const canvasWidth = 900;
  const canvasHeight = 500;
  const GROUND_Y = canvasHeight - 100;

  const hero = {
    baseWidth: 64,
    baseHeight: 64,
    scale: 1.6,
    x: canvasWidth / 2,
  };

  // Sync mode → ref (NO loop restart)
  useEffect(() => {
    modeRef.current = mode;
    demons.current = [];
    bullets.current = [];
    lastSpawnTime.current = 0;
  }, [mode]);

  // 🎮 GAME LOOP (runs once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const grassImg = new Image();
    grassImg.src = "/assets/angry/grass.jpg";

    const heroImg = new Image();
    heroImg.src = "/assets/angry/hero.png";

    const demonImg = new Image();
    demonImg.src = "/assets/angry/demon.png";

    // 🔊 Load shoot sound ONCE
    shootSound.current = new Audio("/assets/angry/shoot.mp3");

    const spawnDemon = () => {
      const cfg = MODE_CONFIG[modeRef.current];
      if (demons.current.length >= cfg.maxDemons) return;

      const speed =
        cfg.speedRange[0] +
        Math.random() * (cfg.speedRange[1] - cfg.speedRange[0]);

      demons.current.push({
        x: Math.random() * (canvasWidth - 48),
        y: -50,
        width: 48,
        height: 48,
        speed,
      });
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(grassImg, 0, 0, canvas.width, canvas.height);

      // HERO
      const heroW = hero.baseWidth * hero.scale;
      const heroH = hero.baseHeight * hero.scale;
      const heroX = hero.x - heroW / 2;
      const heroY = GROUND_Y - heroH;

      const heroCenter = {
        x: heroX + heroW / 2,
        y: heroY + heroH / 2,
      };

      // AIM LINE
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(heroCenter.x, heroCenter.y);
      ctx.lineTo(mousePos.current.x, mousePos.current.y);
      ctx.stroke();

      // MODE-BASED SPAWNING
      const cfg = MODE_CONFIG[modeRef.current];
      if (
        time - lastSpawnTime.current > cfg.spawnRate &&
        demons.current.length < cfg.maxDemons
      ) {
        spawnDemon();
        lastSpawnTime.current = time;
      }

      // DEMONS
      demons.current.forEach((d) => {
        d.y += d.speed;
        ctx.drawImage(demonImg, d.x, d.y, d.width, d.height);
      });

      demons.current = demons.current.filter(
        (d) => d.y < canvasHeight
      );

      // BULLETS
      bullets.current.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;

        ctx.fillStyle = "#ff3333";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();

        demons.current.forEach((d) => {
          if (
            b.x > d.x &&
            b.x < d.x + d.width &&
            b.y > d.y &&
            b.y < d.y + d.height
          ) {
            d.y = canvasHeight + 100; // remove demon
          }
        });
      });

      bullets.current = bullets.current.filter(
        (b) =>
          b.x >= 0 &&
          b.x <= canvasWidth &&
          b.y >= 0 &&
          b.y <= canvasHeight
      );

      // HERO DRAW
      ctx.drawImage(heroImg, heroX, heroY, heroW, heroH);

      animationId.current = requestAnimationFrame(draw);
    };

    animationId.current = requestAnimationFrame(draw);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseDown = () => {
      const heroW = hero.baseWidth * hero.scale;
      const heroH = hero.baseHeight * hero.scale;

      const startX = hero.x;
      const startY = GROUND_Y - heroH / 2;

      const dx = mousePos.current.x - startX;
      const dy = mousePos.current.y - startY;
      const len = Math.hypot(dx, dy);
      if (!len) return;

      // 🔊 MODE-BASED SOUND
      if (shootSound.current) {
        const volumeMap = {
          release: 0.6,
          control: 0.4,
          channel: 0.25,
        };

        shootSound.current.volume = volumeMap[modeRef.current];
        shootSound.current.currentTime = 0;
        shootSound.current.play();
      }

      bullets.current.push({
        x: startX,
        y: startY,
        vx: (dx / len) * 3,
        vy: (dy / len) * 3,
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      {/* MODE BUTTONS */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setMode("release")}>Release</button>
        <button onClick={() => setMode("control")}>Control</button>
        <button onClick={() => setMode("channel")}>Channel</button>
      </div>

      {/* GAME CANVAS */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
