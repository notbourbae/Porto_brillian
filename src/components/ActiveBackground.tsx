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

    const isMobile = width < 768;
    
    // Increased particle count for a richer starry sky
    const activeParticleCount = isMobile ? 60 : 120;
    const backgroundStarCount = isMobile ? 100 : 220; // These stay beautifully spread out

    interface Stardust {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      baseAlpha: number;
      hueShift: number; // custom subtle tint variance
      baseSpeed: number;
      angle: number;
      life?: number;
      maxLife?: number;
      isBurst?: boolean;
      twinkleSpeed?: number;
      phase?: number;
    }

    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      speed: number;
      alpha: number;
      color: string;
    }

    const flowParticles: Stardust[] = [];
    const backgroundStars: Stardust[] = [];
    const activeRipples: Ripple[] = [];

    // Premium themed colors: Emerald/Mint and Neon Cyan/Deep space glow
    const primaryGlow = 'rgba(78, 222, 163, ';  // Emerald Green
    const secondaryGlow = 'rgba(0, 242, 254, '; // Neon Cyan
    const softWhiteGlow = 'rgba(230, 245, 240, '; // Celestial Stardust White

    // 1. Initialize active drifting/flowing particles
    for (let i = 0; i < activeParticleCount; i++) {
      const baseAlpha = Math.random() * 0.35 + 0.15;
      flowParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        radius: Math.random() * 1.3 + 0.6,
        alpha: baseAlpha,
        baseAlpha: baseAlpha,
        hueShift: Math.random(),
        baseSpeed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // 2. Initialize background twinkling stars (perfectly spread out, static or extremely slow drift)
    for (let i = 0; i < backgroundStarCount; i++) {
      const baseAlpha = Math.random() * 0.4 + 0.1;
      backgroundStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.04, // Extremely slow cosmic drift
        vy: (Math.random() - 0.5) * 0.04,
        radius: Math.random() * 1.1 + 0.3, // Very tiny, distant look
        alpha: baseAlpha,
        baseAlpha: baseAlpha,
        hueShift: Math.random(),
        baseSpeed: 0,
        angle: 0,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Interactive mouse state with physics
    const cursor = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      radius: isMobile ? 120 : 200,
      intensity: 0, // goes up with movement speed
    };

    let lastMouseX = -2000;
    let lastMouseY = -2000;
    let lastMoveTime = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      cursor.targetX = e.clientX;
      cursor.targetY = e.clientY;

      // Calculate instant speed to increase visual intensity
      const now = Date.now();
      const dt = now - lastMoveTime;
      if (dt > 0) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;
        cursor.intensity = Math.min(1.5, cursor.intensity + speed * 0.15);
      }
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      lastMoveTime = now;
    };

    const handleMouseLeave = () => {
      cursor.targetX = -2000;
      cursor.targetY = -2000;
    };

    const handleClick = (e: MouseEvent) => {
      // Trigger a dual-expanding ripple
      activeRipples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: isMobile ? 120 : 220,
        speed: isMobile ? 3.5 : 6,
        alpha: 0.7,
        color: secondaryGlow,
      });

      // Spawn bright orbital burst particles
      const burstCount = isMobile ? 10 : 24;
      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2 + Math.random() * 0.25;
        const velocity = Math.random() * 2.2 + 1.0;
        const baseAlpha = Math.random() * 0.8 + 0.2;
        flowParticles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          radius: Math.random() * 1.4 + 0.7,
          alpha: baseAlpha,
          baseAlpha: baseAlpha,
          hueShift: Math.random(),
          baseSpeed: velocity,
          angle: angle,
          life: 1.0,
          maxLife: 1.0,
          isBurst: true,
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // Flow Field Generator (uses smooth temporal sin/cos waves)
    let flowTime = 0;

    const render = () => {
      // Atmospheric clear trail
      ctx.fillStyle = 'rgba(16, 20, 21, 0.12)';
      ctx.fillRect(0, 0, width, height);

      flowTime += 0.002;
      cursor.intensity *= 0.95; // decay cursor intensity

      // Smooth mouse interpolation
      cursor.x += (cursor.targetX - cursor.x) * 0.08;
      cursor.y += (cursor.targetY - cursor.y) * 0.08;

      // 1. Draw Ripples/Shockwaves
      for (let r = activeRipples.length - 1; r >= 0; r--) {
        const rp = activeRipples[r];
        rp.radius += rp.speed;
        rp.alpha -= 0.016;

        if (rp.alpha <= 0) {
          activeRipples.splice(r, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = rp.color + rp.alpha * 0.25 + ')';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (rp.radius > 30) {
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.radius * 0.75, 0, Math.PI * 2);
          ctx.strokeStyle = primaryGlow + rp.alpha * 0.1 + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // 2. Draw & Update background twinkling stars (staying beautifully scattered)
      for (let i = 0; i < backgroundStars.length; i++) {
        const s = backgroundStars[i];
        
        // Gentle slow cosmic drift
        s.x += s.vx;
        s.y += s.vy;

        // Teleport wrap edges
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        // Shimmering twinkle animation
        if (s.phase !== undefined && s.twinkleSpeed !== undefined) {
          s.phase += s.twinkleSpeed;
          s.alpha = s.baseAlpha + Math.sin(s.phase) * (s.baseAlpha * 0.6);
        }

        // Palette selector
        let starColor = softWhiteGlow;
        if (s.hueShift > 0.85) {
          starColor = secondaryGlow;
        } else if (s.hueShift > 0.7) {
          starColor = primaryGlow;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = starColor + Math.max(0.05, s.alpha) + ')';
        ctx.fill();
      }

      // 3. Draw & Update active interactive flowing dust particles
      for (let i = flowParticles.length - 1; i >= 0; i--) {
        const p = flowParticles[i];

        if (p.isBurst && p.life !== undefined) {
          p.life -= 0.015;
          if (p.life <= 0) {
            flowParticles.splice(i, 1);
            continue;
          }
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.alpha = p.life * 0.85;
        } else {
          // Broad, smooth mathematical waves for elegant non-clumping flow paths
          const waveX = Math.sin(p.y * 0.0015 + flowTime * 1.5) * 0.35;
          const waveY = Math.cos(p.x * 0.0015 + flowTime * 1.2) * 0.35;

          p.angle = Math.atan2(waveY, waveX) + (p.hueShift * 0.05);

          let targetVx = Math.cos(p.angle) * p.baseSpeed;
          let targetVy = Math.sin(p.angle) * p.baseSpeed;

          // Magnetic Cursor Vortex influence
          if (cursor.x > -1000) {
            const dx = p.x - cursor.x;
            const dy = p.y - cursor.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < cursor.radius) {
              const effectRatio = 1 - dist / cursor.radius;
              const angleToMouse = Math.atan2(dy, dx);
              
              const tangentAngle = angleToMouse + Math.PI / 2;
              const swirlStrength = effectRatio * (0.7 + cursor.intensity * 1.0);

              targetVx += Math.cos(tangentAngle) * swirlStrength * 0.7 + Math.cos(angleToMouse) * effectRatio * 0.2;
              targetVy += Math.sin(tangentAngle) * swirlStrength * 0.7 + Math.sin(angleToMouse) * effectRatio * 0.2;

              p.alpha = Math.min(0.8, p.alpha + effectRatio * 0.02);
            } else {
              p.alpha += (p.baseAlpha - p.alpha) * 0.05;
            }
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.05;
          }

          p.vx += (targetVx - p.vx) * 0.08;
          p.vy += (targetVy - p.vy) * 0.08;

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        let activeColor = primaryGlow;
        if (p.hueShift > 0.8) {
          activeColor = softWhiteGlow;
        } else if (p.hueShift > 0.45) {
          activeColor = secondaryGlow;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (p.isBurst ? 1.4 : 1), 0, Math.PI * 2);
        ctx.fillStyle = activeColor + p.alpha + ')';
        ctx.fill();

        // Subtle bloom for active cursor nodes
        if (cursor.intensity > 0.5 && !p.isBurst && Math.random() < 0.04) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = activeColor + (p.alpha * 0.1) + ')';
          ctx.fill();
        }
      }

      // 4. Aurora base background glow
      const gradientTime = Date.now() * 0.00012;
      const xGlow = width * 0.5 + Math.sin(gradientTime) * (width * 0.15);
      const yGlow = height * 0.5 + Math.cos(gradientTime * 0.75) * (height * 0.12);

      const radialGlow = ctx.createRadialGradient(xGlow, yGlow, 50, xGlow, yGlow, isMobile ? 200 : 420);
      radialGlow.addColorStop(0, 'rgba(78, 222, 163, 0.012)');
      radialGlow.addColorStop(0.5, 'rgba(0, 242, 254, 0.006)');
      radialGlow.addColorStop(1, 'rgba(16, 20, 21, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 5. Dynamic Spotlight at cursor
      if (cursor.x > -1000) {
        const mouseSpotlight = ctx.createRadialGradient(cursor.x, cursor.y, 5, cursor.x, cursor.y, cursor.radius * 1.0);
        mouseSpotlight.addColorStop(0, 'rgba(0, 242, 254, 0.02)');
        mouseSpotlight.addColorStop(0.5, 'rgba(78, 222, 163, 0.008)');
        mouseSpotlight.addColorStop(1, 'rgba(16, 20, 21, 0)');
        ctx.fillStyle = mouseSpotlight;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="active-interactive-background"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-70"
    />
  );
}
