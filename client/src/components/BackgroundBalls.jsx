import React, { useEffect, useRef } from "react";

export default function BackgroundBalls() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let sparks = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    // Golden shimmer particles (background)
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 1.5,
      });
    }

    // Lightning sparks rising upward
    for (let i = 0; i < 25; i++) {
      sparks.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * canvas.height, // start near/below bottom
        dx: (Math.random() - 0.5) * 1, // small horizontal drift
        dy: -1 - Math.random() * 1.5, // always upward
        life: 60 + Math.random() * 60,
        maxLife: 60 + Math.random() * 60,
        baseR: 2 + Math.random() * 2,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Golden faint background balls
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 215, 0, 0.12)";
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(255, 215, 0, 0.5)";
        ctx.fill();
      });

      // Sparks rising
      sparks.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        s.life -= 1;

        // Respawn when life ends OR spark goes off top
        if (s.life <= 0 || s.y < -10) {
          s.x = Math.random() * canvas.width;
          s.y = canvas.height + 10; // respawn at bottom
          s.life = s.maxLife;
        }

        // Flicker effect
        const flicker = Math.sin(Date.now() * 0.1 + s.x * 0.1) * 1.5;
        const radius = Math.max(1, s.baseR + flicker);
        const alpha = Math.max(0.2, s.life / s.maxLife);

        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 150, ${0.5 + 0.5 * alpha})`;
        ctx.shadowBlur = 50;
        ctx.shadowColor = "rgba(255, 255, 200, 1)";
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    />
  );
}
