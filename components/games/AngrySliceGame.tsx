"use client";

import { useEffect, useRef } from "react";

type Mode = "release" | "control" | "channel";

type Orb = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  stunned: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

export default function AngrySliceGame({ mode }: { mode: Mode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const orbs = useRef<Orb[]>([]);
  const particles = useRef<Particle[]>([]);

  const shake = useRef(0);
  const freeze = useRef(0);

  // CONTROL
  const tension = useRef(0);

  // CHANNEL
  const charging = useRef(false);
  const charge = useRef(0);

  /* =======================
     MODE CONFIG (LOCKED)
  ======================= */
  const CONFIG = {
    release: {
      maxOrbs: 14,
      speed: 1,
      gravity: 0.02,
      hitRadius: 1.5,
      strikeForce: 22,
      strikeRadius: 200,
      shake: 22,
    },
    control: {
      maxOrbs: 6,
      speed: 0.55,
      gravity: 0.012,
      hitRadius: 0.7,
      shake: 6,
    },
    channel: {
      maxOrbs: 9,
      speed: 0.85,
      gravity: 0.016,
      hitRadius: 1,
      strikeForce: 18,
      strikeRadius: 180,
      shake: 16,
    },
  };

  const cfg = CONFIG[mode];

  /* =======================
     INIT
  ======================= */
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    orbs.current = [];
    particles.current = [];
    tension.current = 0;
    charging.current = false;
    charge.current = 0;

    function spawnOrb() {
      orbs.current.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 120,
        r: 22 + Math.random() * 14,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -2.2 - Math.random() * 1.8,
        stunned: 0,
      });
    }

    for (let i = 0; i < cfg.maxOrbs; i++) spawnOrb();

    function loop() {
      /* -----------------------
         TIME CONTROL (KEY FIX)
      ------------------------ */
      let timeScale = 1;

      if (mode === "channel" && charging.current) {
        timeScale = 0.1; // 🔥 INTENTIONAL, VERY STRONG
        charge.current = Math.min(charge.current + 0.05, 1);
      }

      if (freeze.current > 0) {
        freeze.current--;
        requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      // SCREEN SHAKE
      ctx.translate(
        (Math.random() - 0.5) * shake.current,
        (Math.random() - 0.5) * shake.current
      );
      shake.current *= 0.85;

      // CHANNEL: SUBTLE CAMERA COMPRESSION
      if (mode === "channel" && charging.current) {
        const z = 0.97;
        ctx.scale(z, z);
        ctx.translate(
          canvas.width * (1 - z) * 0.5,
          canvas.height * (1 - z) * 0.5
        );
      }

      // CONTROL: TENSION DARKENING
      if (mode === "control") {
        ctx.globalAlpha = Math.max(0.45, 1 - tension.current * 0.35);
        tension.current *= 0.96;
      }

      /* -----------------------
         UPDATE & DRAW ORBS
      ------------------------ */
      orbs.current.forEach((o) => {
        if (o.stunned > 0) {
          o.stunned--;
        } else {
          o.x += o.vx * cfg.speed * timeScale;
          o.y += o.vy * cfg.speed * timeScale;

          if (mode === "channel" && charging.current) {
            o.vy += cfg.gravity * 0.08; // almost suspended
          } else {
            o.vy += cfg.gravity * timeScale;
          }
        }

        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = "#ff3b3b";
        ctx.shadowColor = "rgba(255,0,0,0.75)";
        ctx.shadowBlur = charging.current ? 42 : 26;
        ctx.fill();
      });

      /* -----------------------
         PARTICLES
      ------------------------ */
      particles.current.forEach((p) => {
        p.x += p.vx * timeScale;
        p.y += p.vy * timeScale;
        p.life--;

        ctx.fillStyle = `rgba(255,90,90,${p.life / 30})`;
        ctx.fillRect(p.x, p.y, 3, 3);
      });

      ctx.restore();

      orbs.current = orbs.current.filter(
        (o) => o.y < canvas.height + 200
      );
      particles.current = particles.current.filter((p) => p.life > 0);

      if (orbs.current.length < cfg.maxOrbs) spawnOrb();

      requestAnimationFrame(loop);
    }

    loop();
  }, [mode]);

  /* =======================
     ACTIONS
  ======================= */
  function slice(x: number, y: number) {
    let hit = false;

    orbs.current = orbs.current.filter((o) => {
      const d = Math.hypot(o.x - x, o.y - y);
      const sliced = d < o.r * cfg.hitRadius;

      if (sliced) {
        hit = true;
        for (let i = 0; i < 16; i++) {
          particles.current.push({
            x: o.x,
            y: o.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30,
          });
        }
        shake.current = cfg.shake;
        freeze.current = 2;
      }

      return !sliced;
    });

    if (!hit && mode === "control") tension.current += 0.45;
  }

  function strike(x: number, y: number, power = 1) {
    orbs.current.forEach((o) => {
      const d = Math.hypot(o.x - x, o.y - y);
      if (d < cfg.strikeRadius! * power) {
        const f = (1 - d / (cfg.strikeRadius! * power)) * cfg.strikeForce!;
        o.vx += (o.x - x) / d * f;
        o.vy += (o.y - y) / d * f;
        o.stunned = 14;
      }
    });

    for (let i = 0; i < 24; i++) {
      particles.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 32,
      });
    }

    shake.current = cfg.shake + 10;
    freeze.current = 5;
  }

  /* =======================
     INPUT (MODE-LOCKED)
  ======================= */
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 cursor-crosshair"
      onMouseDown={(e) => {
        if (mode === "release") {
          strike(e.clientX, e.clientY);
        }

        if (mode === "channel") {
          charging.current = true;
          charge.current = 0;
        }
      }}
      onMouseMove={(e) => {
        if (e.buttons !== 1) return;

        if (mode === "release") slice(e.clientX, e.clientY);
        if (mode === "control") slice(e.clientX, e.clientY);

        if (mode === "channel" && !charging.current) {
          slice(e.clientX, e.clientY);
        }
      }}
      onMouseUp={(e) => {
        if (mode === "channel" && charging.current) {
          strike(
            e.clientX,
            e.clientY,
            1 + charge.current * 1.8
          );
          charging.current = false;
          charge.current = 0;
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
