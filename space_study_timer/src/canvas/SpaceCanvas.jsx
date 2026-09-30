import React, { useEffect, useRef } from 'react';

export default function SpaceCanvas({ isRunning, totalSeconds, currentMilestone, nextMilestone, progressPercent }) {
  const canvasRef = useRef(null);
  
  const propsRef = useRef({ isRunning, currentMilestone, nextMilestone, progressPercent });
  useEffect(() => {
    propsRef.current = { isRunning, currentMilestone, nextMilestone, progressPercent };
  }, [isRunning, currentMilestone, nextMilestone, progressPercent]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Star System
    const STAR_COUNT = 320;
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 3 + 0.2, // Depth layer
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: (Math.random() * 0.04 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
        color: ['#ffffff', '#e0f2fe', '#fef08a', '#fbcfe8', '#c7d2fe'][Math.floor(Math.random() * 5)]
      });
    }

    // Nebula Clouds
    const nebulae = [
      { x: width * 0.75, y: height * 0.25, r: 240, color: 'rgba(99, 102, 241, 0.08)' },
      { x: width * 0.2, y: height * 0.7, r: 300, color: 'rgba(236, 72, 153, 0.06)' },
      { x: width * 0.85, y: height * 0.8, r: 200, color: 'rgba(6, 182, 212, 0.07)' }
    ];

    // Engine Exhaust Particles
    const particles = [];
    const PARTICLE_MAX = 140;

    // Ship state
    let shipAngle = 0;
    let shipOscillation = 0;
    let warpSpeed = 1;
    let targetWarpSpeed = isRunning ? 5.5 : 0.8;

    let celestialRotation = 0;

    const render = () => {
      // Background clear with deep cosmic gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#030712');
      bgGrad.addColorStop(0.5, '#050b1a');
      bgGrad.addColorStop(1, '#020617');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Smooth warp speed interpolation
      targetWarpSpeed = propsRef.current.isRunning ? 6.0 : 0.8;
      warpSpeed += (targetWarpSpeed - warpSpeed) * 0.05;

      // Draw Nebulae
      nebulae.forEach(neb => {
        const nGrad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.r);
        nGrad.addColorStop(0, neb.color);
        nGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.arc(neb.x, neb.y, neb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Stars & Warp Streaks
      stars.forEach(star => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0.2) star.twinkleSpeed *= -1;

        // Move stars horizontally/diagonally to create sensation of rocket soaring through space
        star.x -= star.z * warpSpeed * 1.5;
        star.y += star.z * warpSpeed * 0.4;

        if (star.x < -50) star.x = width + 20;
        if (star.y > height + 50) star.y = -20;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));

        if (propsRef.current.isRunning && warpSpeed > 2.5) {
          // Warp streak
          const streakLen = star.z * warpSpeed * 3.5;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.radius * 1.2;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.x + streakLen, star.y - streakLen * 0.25);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;

      // Draw Approaching Celestial Body (Planet / Moon / Object)
      celestialRotation += 0.003;
      drawCelestialBody(ctx, width, height, propsRef.current.currentMilestone, propsRef.current.nextMilestone, propsRef.current.progressPercent, celestialRotation);

      // Ship Position & Dynamic Hover
      shipOscillation += 0.04;
      const shipX = width * 0.38 + Math.cos(shipOscillation * 0.5) * 6;
      const shipY = height * 0.52 + Math.sin(shipOscillation) * 8;
      shipAngle = (Math.sin(shipOscillation * 0.7) * 0.03) + (propsRef.current.isRunning ? -0.04 : 0);

      // Emit Engine Particles if running or idle idling
      const spawnRate = propsRef.current.isRunning ? 6 : 1;
      for (let i = 0; i < spawnRate; i++) {
        if (particles.length < PARTICLE_MAX) {
          particles.push({
            x: shipX - 58,
            y: shipY + 2 + (Math.random() - 0.5) * 8,
            vx: (-(Math.random() * (propsRef.current.isRunning ? 14 : 3) + (propsRef.current.isRunning ? 10 : 2))),
            vy: (Math.random() - 0.5) * (propsRef.current.isRunning ? 4 : 1.5),
            size: Math.random() * (propsRef.current.isRunning ? 8 : 4) + 2,
            life: 1.0,
            decay: Math.random() * 0.04 + 0.02,
            type: Math.random() > 0.4 ? 'plasma' : 'spark'
          });
        }
      }

      // Render & Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.size *= 0.96;

        if (p.life <= 0 || p.size <= 0.5) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.life;
        if (p.type === 'plasma') {
          const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          if (propsRef.current.isRunning) {
            pGrad.addColorStop(0, '#ffffff');
            pGrad.addColorStop(0.3, '#38bdf8');
            pGrad.addColorStop(0.7, '#6366f1');
            pGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
          } else {
            pGrad.addColorStop(0, '#fdba74');
            pGrad.addColorStop(0.6, '#ea580c');
            pGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
          }
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = propsRef.current.isRunning ? '#a5f3fc' : '#fed7aa';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw Spaceship
      drawSpaceship(ctx, shipX, shipY, shipAngle, propsRef.current.isRunning);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// Celestial Body Renderer
function drawCelestialBody(ctx, width, height, current, next, progress, rotation) {
  const target = next || current;
  if (!target || !target.body) return;

  const body = target.body;
  // Position the celestial body in the upper right quadrant
  const cx = width * 0.76;
  const cy = height * 0.38;

  // Scale based on progress towards milestone
  const scale = 0.8 + (progress / 100) * 0.5;
  const r = (body.radius || 40) * scale;

  ctx.save();
  ctx.translate(cx, cy);

  // Outer Atmosphere Glow
  const glow = ctx.createRadialGradient(0, 0, r * 0.8, 0, 0, r * 2.2);
  glow.addColorStop(0, target.glowColor || 'rgba(99, 102, 241, 0.3)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, r * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Saturn / Ice Giant Rings (Back layer)
  if (body.rings) {
    ctx.save();
    ctx.rotate(0.35);
    ctx.scale(1, 0.3);
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.8, Math.PI, Math.PI * 2);
    ctx.lineWidth = r * 0.7;
    ctx.strokeStyle = body.ringColor || '#fde047';
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.restore();
  }

  // Planet Base Sphere
  const planetGrad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
  planetGrad.addColorStop(0, body.color || '#3b82f6');
  planetGrad.addColorStop(0.7, body.secondary || '#1e3a8a');
  planetGrad.addColorStop(1, '#020617');
  ctx.fillStyle = planetGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Planet details / textures
  ctx.save();
  ctx.clip();

  if (body.type === 'earth' || body.type === 'earth_distant') {
    // Continents
    ctx.rotate(rotation);
    ctx.fillStyle = body.secondary || '#10b981';
    ctx.beginPath();
    ctx.arc(r * 0.2, -r * 0.1, r * 0.45, 0, Math.PI * 2);
    ctx.arc(-r * 0.3, r * 0.2, r * 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Swirling Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.2, r * 0.8, r * 0.25, 0.2, 0, Math.PI * 2);
    ctx.ellipse(r * 0.1, r * 0.3, r * 0.7, r * 0.2, -0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (body.type === 'moon') {
    // Craters
    ctx.fillStyle = '#6b7280';
    [
      { x: -r * 0.3, y: -r * 0.2, s: r * 0.18 },
      { x: r * 0.25, y: r * 0.1, s: r * 0.25 },
      { x: -r * 0.1, y: r * 0.4, s: r * 0.15 },
      { x: r * 0.35, y: -r * 0.35, s: r * 0.12 }
    ].forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.s, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (body.type === 'mars') {
    // Polar ice cap & canyon
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -r * 0.82, r * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.1, r * 0.7, r * 0.18, 0.1, 0, Math.PI * 2);
    ctx.fill();
  } else if (body.type === 'jupiter') {
    // Jovian cloud bands
    ctx.rotate(rotation * 0.2);
    const bandColors = body.bands || ['#c2410c', '#fb923c', '#fdba74'];
    bandColors.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(-r, -r + idx * (r * 0.6), r * 2, r * 0.25);
    });

    // Great Red Spot
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.ellipse(r * 0.3, r * 0.2, r * 0.24, r * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (body.type === 'pluto') {
    // Heart shape Tombaugh Regio
    ctx.fillStyle = body.heart || '#f3e8ff';
    ctx.beginPath();
    ctx.arc(-r * 0.1, r * 0.05, r * 0.2, 0, Math.PI * 2);
    ctx.arc(r * 0.1, r * 0.05, r * 0.2, 0, Math.PI * 2);
    ctx.lineTo(0, r * 0.35);
    ctx.fill();
  }

  // Shadow sphere overlay (terminator line)
  const shadowGrad = ctx.createLinearGradient(-r, 0, r, 0);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.4)');
  shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
  ctx.fillStyle = shadowGrad;
  ctx.fillRect(-r, -r, r * 2, r * 2);

  ctx.restore(); // end clip

  // Saturn Rings (Front layer)
  if (body.rings) {
    ctx.save();
    ctx.rotate(0.35);
    ctx.scale(1, 0.3);
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.8, 0, Math.PI);
    ctx.lineWidth = r * 0.7;
    ctx.strokeStyle = body.ringColor || '#fde047';
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    ctx.restore();
  }

  // Target Destination Label / Tag
  ctx.save();
  ctx.font = '600 12px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(target.name.toUpperCase(), 0, r + 24);

  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillStyle = target.color || '#38bdf8';
  ctx.fillText(`${target.displayDistance} • ${Math.round(progress)}% PROXIMITY`, 0, r + 40);
  ctx.restore();

  ctx.restore();
}

// Spaceship Vector Graphics
function drawSpaceship(ctx, x, y, angle, isThrusting) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Ship scale
  const s = 1.35;

  // Cockpit / Thruster Engine Glow Aura
  if (isThrusting) {
    const engineGlow = ctx.createRadialGradient(-40 * s, 0, 2, -40 * s, 0, 30 * s);
    engineGlow.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
    engineGlow.addColorStop(0.5, 'rgba(99, 102, 241, 0.4)');
    engineGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = engineGlow;
    ctx.beginPath();
    ctx.arc(-40 * s, 0, 30 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  // Top Wing / Fin
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(-18 * s, -10 * s);
  ctx.lineTo(-38 * s, -28 * s);
  ctx.lineTo(-24 * s, -8 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Bottom Wing / Fin
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(-18 * s, 10 * s);
  ctx.lineTo(-38 * s, 28 * s);
  ctx.lineTo(-24 * s, 8 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Main Fuselage Hull
  const hullGrad = ctx.createLinearGradient(-35 * s, 0, 45 * s, 0);
  hullGrad.addColorStop(0, '#0f172a');
  hullGrad.addColorStop(0.4, '#e2e8f0');
  hullGrad.addColorStop(0.8, '#f8fafc');
  hullGrad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = hullGrad;

  ctx.beginPath();
  ctx.moveTo(48 * s, 0); // Nose cone
  ctx.bezierCurveTo(25 * s, -14 * s, -20 * s, -14 * s, -38 * s, -10 * s);
  ctx.lineTo(-38 * s, 10 * s);
  ctx.bezierCurveTo(-20 * s, 14 * s, 25 * s, 14 * s, 48 * s, 0);
  ctx.closePath();
  ctx.fill();

  // Hull Edge Highlight
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Thruster Bell Nozzle
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(-38 * s, -9 * s);
  ctx.lineTo(-44 * s, -12 * s);
  ctx.lineTo(-44 * s, 12 * s);
  ctx.lineTo(-38 * s, 9 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.stroke();

  // Cockpit Glass Canopy
  const glassGrad = ctx.createLinearGradient(0, -6 * s, 26 * s, 4 * s);
  glassGrad.addColorStop(0, '#38bdf8');
  glassGrad.addColorStop(0.6, '#0284c7');
  glassGrad.addColorStop(1, '#082f49');
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.moveTo(32 * s, -1 * s);
  ctx.bezierCurveTo(20 * s, -8 * s, 6 * s, -8 * s, 0, -2 * s);
  ctx.lineTo(6 * s, 2 * s);
  ctx.bezierCurveTo(18 * s, 5 * s, 26 * s, 4 * s, 32 * s, -1 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Solar / Tech Stripes
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(-15 * s, -3 * s, 8 * s, 6 * s);

  // Status Beacon Light (Blinks)
  const beaconAlpha = 0.5 + Math.sin(Date.now() * 0.006) * 0.5;
  ctx.fillStyle = `rgba(56, 189, 248, ${beaconAlpha})`;
  ctx.beginPath();
  ctx.arc(-22 * s, -14 * s, 2.5 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
