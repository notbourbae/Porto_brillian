import React, { useEffect, useRef } from 'react';

export default function ActiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic density based on screen size
    const isMobile = width < 768;
    const particleCount = isMobile ? 35 : 85;
    const connectionDistance = 120;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }

    const particles: Particle[] = [];

    // Colors that complement the slate background, emerald secondary and slate blue tertiary
    const colors = [
      'rgba(78, 222, 163, ',  // #4edea3 (brand secondary emerald)
      'rgba(183, 200, 225, ', // #b7c8e1 (brand tertiary slate blue)
      'rgba(110, 230, 180, ', // medium emerald
    ];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25, // Very slow drifting
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.4 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Mouse coordinates tracking
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 160,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY; // Keep relative to screen since canvas is fixed
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Main animation loop
    const render = () => {
      // Clear with absolute transparency to avoid blocking the background
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Draw two large, very subtle drifting accent glows in the background
      const time = Date.now() * 0.0003;
      const glow1X = width * 0.25 + Math.sin(time) * 120;
      const glow1Y = height * 0.35 + Math.cos(time * 0.8) * 80;
      const glow2X = width * 0.75 + Math.cos(time * 0.9) * 100;
      const glow2Y = height * 0.65 + Math.sin(time * 0.7) * 120;

      // Subtle emerald bg light
      const grad1 = ctx.createRadialGradient(glow1X, glow1Y, 10, glow1X, glow1Y, isMobile ? 150 : 320);
      grad1.addColorStop(0, 'rgba(78, 222, 163, 0.025)');
      grad1.addColorStop(1, 'rgba(16, 20, 21, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Subtle slate blue bg light
      const grad2 = ctx.createRadialGradient(glow2X, glow2Y, 10, glow2X, glow2Y, isMobile ? 130 : 280);
      grad2.addColorStop(0, 'rgba(183, 200, 225, 0.018)');
      grad2.addColorStop(1, 'rgba(16, 20, 21, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Draw active connection lines
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            // connection opacity drops as distance increases
            const alpha = (1 - dist / connectionDistance) * 0.08;
            ctx.strokeStyle = `rgba(78, 222, 163, ${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Mouse connection or push
        const mdx = p1.x - mouse.x;
        const mdy = p1.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < mouse.radius) {
          // Attract/interactive glow lines from mouse to nodes
          const malpha = (1 - mdist / mouse.radius) * 0.15;
          ctx.strokeStyle = `rgba(78, 222, 163, ${malpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();

          // Gentle push effect away from cursor
          const force = (mouse.radius - mdist) / mouse.radius;
          const angle = Math.atan2(mdy, mdx);
          p1.x += Math.cos(angle) * force * 0.4;
          p1.y += Math.sin(angle) * force * 0.4;
        }

        // Update particle physics
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Wrap around borders
        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        // Draw particle
        ctx.fillStyle = p1.color + p1.alpha + ')';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="active-interactive-background"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-60"
    />
  );
}
