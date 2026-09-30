import React, { useEffect, useRef } from 'react';
import { ICE_STYLES } from '../data/iceCandleStyles';

export default function IceCanvas({
  isRunning,
  sessionSeconds,
  targetDurationSeconds,
  currentTotalSeconds,
  activeStyleId = 'pure_glacier'
}) {
  const canvasRef = useRef(null);

  // Find active style
  const style = ICE_STYLES.find((s) => s.id === activeStyleId) || ICE_STYLES[0];

  const propsRef = useRef({ isRunning, sessionSeconds, targetDurationSeconds, style });
  useEffect(() => {
    propsRef.current = { isRunning, sessionSeconds, targetDurationSeconds, style };
  }, [isRunning, sessionSeconds, targetDurationSeconds, style]);

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

    // Frost & Vapor Particles
    const vaporParticles = [];
    const fallingDrops = [];
    const surfaceDroplets = [];
    let rippleTime = 0;
    let sparkleTimer = 0;

    // Generate static condensation droplets on the ice faces
    for (let i = 0; i < 24; i++) {
      surfaceDroplets.push({
        relX: (Math.random() - 0.5) * 1.4,
        relY: (Math.random() - 0.5) * 1.4,
        size: Math.random() * 3 + 1.5,
        speed: Math.random() * 0.003 + 0.001,
        alpha: Math.random() * 0.5 + 0.4
      });
    }

    // Pre-generate static crystalline fractures
    const internalCracks = [
      { x1: -45, y1: -50, x2: 25, y2: 15, alpha: 0.75, width: 2 },
      { x1: -15, y1: 30, x2: 45, y2: -25, alpha: 0.6, width: 1.5 },
      { x1: 10, y1: -60, x2: -35, y2: 45, alpha: 0.7, width: 2.2 },
      { x1: -55, y1: 0, x2: 35, y2: 35, alpha: 0.5, width: 1.2 },
      { x1: -20, y1: -30, x2: -5, y2: 10, alpha: 0.8, width: 1.8 }
    ];

    // Trapped Bubbles
    const trappedBubbles = [];
    for (let i = 0; i < 28; i++) {
      trappedBubbles.push({
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 120,
        r: Math.random() * 4 + 1.5,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    const render = () => {
      // 1. Calculate Melt Progression (0 = 100% Solid, 1 = 100% Melted)
      let meltRatio = 0;
      if (propsRef.current.targetDurationSeconds > 0) {
        meltRatio = Math.min(1, propsRef.current.sessionSeconds / propsRef.current.targetDurationSeconds);
      } else {
        // Open mode: 45 mins cycle (2700s)
        meltRatio = (propsRef.current.sessionSeconds % 2700) / 2700;
      }

      // Solid scale: from 1.35 (gorgeous prominent size) down to 0.18 (tiny melting ice shard)
      const solidScale = Math.max(0.18, 1.35 * (1.0 - meltRatio * 0.86));
      const puddleSpread = Math.min(1.85, 0.45 + meltRatio * 1.4);

      // Deep Nordic ambient room background
      const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.35, 40, width * 0.5, height * 0.35, width * 0.75);
      bgGrad.addColorStop(0, '#0a192f');
      bgGrad.addColorStop(0.35, '#051324');
      bgGrad.addColorStop(0.7, '#020b14');
      bgGrad.addColorStop(1, '#01050a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ice Center Stage Position (Upper-Center, clear above the bottom HUD)
      const centerX = width * 0.5;
      const centerY = height <= 750 ? height * 0.32 : height * 0.35;
      const coasterY = centerY + 130;

      // 2. Ambient Ice Chill Caustic Halo
      const auraRadius = (220 + Math.sin(Date.now() * 0.002) * 20) * (solidScale / 1.35);
      const auraGrad = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, auraRadius);
      auraGrad.addColorStop(0, propsRef.current.style.glowColor || 'rgba(56, 189, 248, 0.35)');
      auraGrad.addColorStop(0.45, 'rgba(6, 182, 212, 0.12)');
      auraGrad.addColorStop(0.8, 'rgba(3, 105, 161, 0.03)');
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Coaster / Pedestal
      drawCoaster(ctx, centerX, coasterY, propsRef.current.style.coasterType);

      // 4. Melted Water Pool on Coaster
      drawWaterPuddle(ctx, centerX, coasterY - 6, puddleSpread, meltRatio, propsRef.current.style);

      // 5. Spawn Falling Water Droplets & Frost Mist Vapor
      if (propsRef.current.isRunning) {
        // Vapor mist
        if (Math.random() > 0.35) {
          vaporParticles.push({
            x: centerX + (Math.random() - 0.5) * 140 * (solidScale / 1.35),
            y: centerY + (Math.random() - 0.5) * 80 * (solidScale / 1.35),
            vx: (Math.random() - 0.5) * 0.8,
            vy: -(Math.random() * 1.0 + 0.5),
            size: Math.random() * 26 + 14,
            alpha: 0.32,
            decay: Math.random() * 0.006 + 0.003
          });
        }

        // Active dripping droplet that falls into puddle
        if (Math.random() > 0.72) {
          const dropX = centerX + (Math.random() - 0.5) * 110 * (solidScale / 1.35);
          const startY = centerY + 30 * (solidScale / 1.35);
          fallingDrops.push({
            x: dropX,
            y: startY,
            targetY: coasterY - 4,
            vy: Math.random() * 2.5 + 2.0,
            size: Math.random() * 3.2 + 2.0
          });
        }
      }

      // Render Vapor Frost Mist
      for (let i = vaporParticles.length - 1; i >= 0; i--) {
        const p = vaporParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.size += 0.25;

        if (p.alpha <= 0) {
          vaporParticles.splice(i, 1);
          continue;
        }

        const mistGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        mistGrad.addColorStop(0, `rgba(224, 242, 254, ${p.alpha * 0.45})`);
        mistGrad.addColorStop(0.5, `rgba(186, 230, 253, ${p.alpha * 0.2})`);
        mistGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = mistGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Falling Water Droplets
      ctx.fillStyle = '#e0f2fe';
      for (let i = fallingDrops.length - 1; i >= 0; i--) {
        const d = fallingDrops[i];
        d.y += d.vy;
        if (d.y >= d.targetY) {
          fallingDrops.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Draw 3D Volumetric Ice Block
      drawIceBlock(ctx, centerX, centerY, solidScale, meltRatio, propsRef.current.style, internalCracks, trappedBubbles, surfaceDroplets, propsRef.current.isRunning);

      // 7. Sparkle Refraction Flares & Glistening Highlights
      sparkleTimer += 0.04;
      drawSparkleHighlights(ctx, centerX, centerY, solidScale, sparkleTimer, propsRef.current.style);

      // 8. Floating Melt Status Tag right beside/above the ice
      drawFloatingStatusTag(ctx, centerX, coasterY + 45, meltRatio, propsRef.current.style, propsRef.current.isRunning);

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

// Coaster / Pedestal Renderers
function drawCoaster(ctx, cx, cy, type) {
  ctx.save();
  const width = 360;
  const height = 62;

  if (type === 'hinoki_wood') {
    // Japanese Hinoki Wood Plate
    const woodGrad = ctx.createLinearGradient(cx - width / 2, cy, cx + width / 2, cy + height);
    woodGrad.addColorStop(0, '#78350f');
    woodGrad.addColorStop(0.5, '#b45309');
    woodGrad.addColorStop(1, '#451a03');
    ctx.fillStyle = woodGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 14, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.stroke();

  } else if (type === 'walnut_brass') {
    // Polished Walnut with Brass Inlay Rim
    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 16, (width / 2) + 10, (height / 2) + 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 12, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.stroke();

  } else if (type === 'iridescent_glass') {
    // Prismatic Iridescent Glass Coaster
    const glassGrad = ctx.createLinearGradient(cx - width / 2, cy, cx + width / 2, cy);
    glassGrad.addColorStop(0, 'rgba(192, 132, 252, 0.45)');
    glassGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.55)');
    glassGrad.addColorStop(0.7, 'rgba(244, 114, 182, 0.45)');
    glassGrad.addColorStop(1, 'rgba(167, 243, 208, 0.45)');
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 14, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

  } else {
    // Minimalist Scandinavian Dark Slate (Default)
    const slateGrad = ctx.createRadialGradient(cx, cy + 12, 30, cx, cy + 12, width / 2);
    slateGrad.addColorStop(0, '#1e293b');
    slateGrad.addColorStop(0.7, '#0f172a');
    slateGrad.addColorStop(1, '#020617');
    ctx.fillStyle = slateGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 14, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  ctx.restore();
}

// Melted Water Pool with Dynamic Wave Ripples
function drawWaterPuddle(ctx, cx, cy, puddleSpread, meltRatio, style) {
  ctx.save();
  const baseRx = 125 * puddleSpread;
  const baseRy = 38 * puddleSpread;

  // Liquid Water Base Gradient
  const waterGrad = ctx.createRadialGradient(cx, cy, 15, cx, cy, baseRx);
  waterGrad.addColorStop(0, style.primaryColor || '#38bdf8');
  waterGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.45)');
  waterGrad.addColorStop(0.85, 'rgba(2, 132, 199, 0.2)');
  waterGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = waterGrad;
  ctx.globalAlpha = 0.65 + meltRatio * 0.35;
  ctx.beginPath();
  ctx.ellipse(cx, cy + 10, baseRx, baseRy, 0, 0, Math.PI * 2);
  ctx.fill();

  // Water Ripple Rings
  const rippleTime = Date.now() * 0.0035;
  for (let r = 0; r < 3; r++) {
    const rOffset = (rippleTime + r * 1.2) % 3;
    const rX = (30 + rOffset * 32) * puddleSpread;
    const rY = (10 + rOffset * 11) * puddleSpread;
    const rAlpha = Math.max(0, 1 - rOffset / 3) * 0.4;
    ctx.strokeStyle = `rgba(255, 255, 255, ${rAlpha})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, rX, rY, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

// 3D Volumetric Ice Block with Organic Melting Degradation
function drawIceBlock(ctx, cx, cy, scale, meltRatio, style, cracks, bubbles, surfaceDroplets, isRunning) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Progressive edge rounding & organic melting deformity
  const rounded = meltRatio * 42;

  if (style.shape === 'sphere') {
    // 24K Gold Whiskey Ice Sphere
    const r = 74;
    const sphereGrad = ctx.createRadialGradient(-24, -28, 12, 0, 0, r);
    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.35, style.primaryColor || '#fef08a');
    sphereGrad.addColorStop(0.75, style.secondaryColor || '#f59e0b');
    sphereGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Suspended Gold Leaf Inclusions
    ctx.fillStyle = '#fef08a';
    for (let i = 0; i < 16; i++) {
      const gx = Math.sin(i * 9) * (42 * (1 - meltRatio * 0.5));
      const gy = Math.cos(i * 13) * (42 * (1 - meltRatio * 0.5));
      ctx.fillRect(gx, gy, 5, 4);
    }

    // Glassy Rim Highlight
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-10, -12, r - 8, Math.PI * 0.8, Math.PI * 1.7);
    ctx.stroke();

  } else if (style.shape === 'diamond' || style.shape === 'polyhedron') {
    // Prism Diamond / Polyhedral Gem
    const size = 88;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.85, -size * 0.25);
    ctx.lineTo(size * 0.65, size * 0.85);
    ctx.lineTo(-size * 0.65, size * 0.85);
    ctx.lineTo(-size * 0.85, -size * 0.25);
    ctx.closePath();

    const polyGrad = ctx.createLinearGradient(-size, -size, size, size);
    polyGrad.addColorStop(0, '#ffffff');
    polyGrad.addColorStop(0.3, style.primaryColor || '#e0f2fe');
    polyGrad.addColorStop(0.65, style.secondaryColor || '#818cf8');
    polyGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = polyGrad;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Internal Refraction Facets
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size * 0.85);
    ctx.moveTo(-size * 0.85, -size * 0.25);
    ctx.lineTo(size * 0.85, -size * 0.25);
    ctx.stroke();

  } else if (style.shape === 'berg') {
    // Arctic Berg / Organic Jagged Glacial Shard
    ctx.beginPath();
    ctx.moveTo(-65, -70);
    ctx.lineTo(30, -85);
    ctx.lineTo(80, -12);
    ctx.lineTo(60, 75);
    ctx.lineTo(-75, 70);
    ctx.closePath();

    const bergGrad = ctx.createLinearGradient(-60, -70, 60, 70);
    bergGrad.addColorStop(0, '#ffffff');
    bergGrad.addColorStop(0.35, style.primaryColor || '#06b6d4');
    bergGrad.addColorStop(0.75, style.secondaryColor || '#0284c7');
    bergGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = bergGrad;
    ctx.fill();
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 2.5;
    ctx.stroke();

  } else {
    // 3D Isometric Crystal Cube (Pure Glacier, Sakura, Emerald)
    const w = 130;
    const h = 130;

    // 1. Back/Base Shadow Face
    ctx.fillStyle = 'rgba(2, 132, 199, 0.3)';
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 10, -h / 2 + 10, w, h, rounded + 12);
    ctx.fill();

    // 2. Main Crystal Ice Body
    const frontGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    frontGrad.addColorStop(0, '#ffffff');
    frontGrad.addColorStop(0.25, style.primaryColor || '#e0f2fe');
    frontGrad.addColorStop(0.65, style.secondaryColor || '#38bdf8');
    frontGrad.addColorStop(1, '#0369a1');
    ctx.fillStyle = frontGrad;

    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, rounded + 10);
    ctx.fill();

    // 3. Top Translucent Specular Facet
    const topGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, 0);
    topGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    topGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
    ctx.fillStyle = topGrad;
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 8, -h / 2 + 8, w - 16, h * 0.38, rounded + 4);
    ctx.fill();

    // Sakura Blossom Inclusions
    if (style.id === 'sakura_petal') {
      ctx.fillStyle = '#fb7185';
      for (let p = 0; p < 6; p++) {
        const px = Math.sin(p * 7) * 36;
        const py = Math.cos(p * 5) * 36;
        ctx.beginPath();
        ctx.ellipse(px, py, 11, 6, p * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Outer Crystal Rim
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, rounded + 10);
    ctx.stroke();
  }

  // Draw Internal Crystalline Cracks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  cracks.forEach((c) => {
    ctx.lineWidth = c.width || 1.5;
    ctx.beginPath();
    ctx.moveTo(c.x1, c.y1);
    ctx.lineTo(c.x2, c.y2);
    ctx.stroke();
  });

  // Draw Trapped Ice Air Bubbles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  bubbles.forEach((b) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Surface Condensation Beads Trickling Down
  surfaceDroplets.forEach((drop) => {
    if (isRunning) drop.relY += drop.speed;
    if (drop.relY > 0.8) drop.relY = -0.8;

    const dx = drop.relX * 50;
    const dy = drop.relY * 50;
    ctx.fillStyle = `rgba(255, 255, 255, ${drop.alpha})`;
    ctx.beginPath();
    ctx.arc(dx, dy, drop.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// Sparkle Specular Flares
function drawSparkleHighlights(ctx, cx, cy, scale, timer, style) {
  ctx.save();
  const sparkleAlpha = 0.6 + Math.sin(timer * 2.2) * 0.4;
  const sx = cx - 42 * (scale / 1.35);
  const sy = cy - 42 * (scale / 1.35);

  ctx.fillStyle = `rgba(255, 255, 255, ${sparkleAlpha})`;
  ctx.beginPath();
  ctx.arc(sx, sy, 5, 0, Math.PI * 2);
  ctx.fill();

  // Cross Starflare
  ctx.strokeStyle = `rgba(255, 255, 255, ${sparkleAlpha * 0.9})`;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(sx - 16, sy);
  ctx.lineTo(sx + 16, sy);
  ctx.moveTo(sx, sy - 16);
  ctx.lineTo(sx, sy + 16);
  ctx.stroke();

  ctx.restore();
}

// Floating Status Tag beside/below the ice
function drawFloatingStatusTag(ctx, cx, tagY, meltRatio, style, isRunning) {
  ctx.save();
  const solidPercent = Math.max(0, Math.round((1 - meltRatio) * 100));

  ctx.textAlign = 'center';
  ctx.font = '600 13px "Outfit", sans-serif';
  ctx.fillStyle = '#e0f2fe';
  ctx.fillText(style.name.toUpperCase(), cx, tagY);

  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillStyle = style.accentColor || '#38bdf8';
  const statusLabel = isRunning 
    ? `${solidPercent}% SOLID • MELTING IN REAL-TIME` 
    : `${solidPercent}% SOLID • FROZEN EQUILIBRIUM`;
  ctx.fillText(statusLabel, cx, tagY + 18);

  ctx.restore();
}
