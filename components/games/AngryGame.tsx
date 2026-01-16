"use client";

import { useEffect, useRef } from "react";

type Bullet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export default function AngryGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const bullets = useRef<Bullet[]>([]);

  const canvasWidth = 900;
  const canvasHeight = 500;

  // Hero
  const hero = {
    width: 64,
    height: 64,
    x: canvasWidth / 2 - 32,
    y: canvasHeight - 64 - 40,
  };

  // Demon
  const demon = useRef({
    x: 0,
    y: -50,
    width: 48,
    height: 48,
    speed: 0.6,
    alive: true,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Images
    const grassImg = new Image();
    grassImg.src = "/assets/angry/grass.jpg";

    const heroImg = new Image();
    heroImg.src = "/assets/angry/hero.png";

    const demonImg = new Image();
    demonImg.src = "/assets/angry/demon.png";

    const spawnDemon = () => {
      demon.current.x = Math.random() * (canvasWidth - demon.current.width);
      demon.current.y = -50;
      demon.current.alive = true;
    };

    spawnDemon();

    const draw = () => {
      // Background
      ctx.drawImage(grassImg, 0, 0, canvas.width, canvas.height);

      // Aim line
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hero.x + hero.width / 2, hero.y + hero.height / 2);
      ctx.lineTo(mousePos.current.x, mousePos.current.y);
      ctx.stroke();

      // Demon
      if (demon.current.alive) {
        demon.current.y += demon.current.speed;

        if (demon.current.y > canvasHeight) {
          demon.current.alive = false;
          setTimeout(spawnDemon, 1000);
        } else {
          ctx.drawImage(
            demonImg,
            demon.current.x,
            demon.current.y,
            demon.current.width,
            demon.current.height
          );
        }
      }

      // Bullets
      bullets.current.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;

        ctx.fillStyle = "#ff3333";
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Collision
        if (
          demon.current.alive &&
          b.x > demon.current.x &&
          b.x < demon.current.x + demon.current.width &&
          b.y > demon.current.y &&
          b.y < demon.current.y + demon.current.height
        ) {
          demon.current.alive = false;
          setTimeout(spawnDemon, 1000);
        }
      });

      bullets.current = bullets.current.filter(
        (b) =>
          b.x >= 0 &&
          b.x <= canvasWidth &&
          b.y >= 0 &&
          b.y <= canvasHeight
      );

      // Hero
      ctx.drawImage(heroImg, hero.x, hero.y, hero.width, hero.height);

      requestAnimationFrame(draw);
    };

    draw();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseDown = () => {
      const startX = hero.x + hero.width / 2;
      const startY = hero.y + hero.height / 2;

      const dx = mousePos.current.x - startX;
      const dy = mousePos.current.y - startY;
      const len = Math.hypot(dx, dy);
      if (len === 0) return;

      const speed = 3;

      bullets.current.push({
        x: startX,
        y: startY,
        vx: (dx / len) * speed,
        vy: (dy / len) * speed,
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
