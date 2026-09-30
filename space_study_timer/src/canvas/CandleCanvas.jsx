import React, { useEffect, useRef } from 'react';
import { CANDLE_STYLES } from '../data/iceCandleStyles';

export default function CandleCanvas({
  isRunning,
  sessionSeconds,
  targetDurationSeconds,
  currentTotalSeconds,
  activeStyleId = 'golden_beeswax'
}) {
  const canvasRef = useRef(null);

  // Find active style
  const style = CANDLE_STYLES.find((s) => s.id === activeStyleId) || CANDLE_STYLES[0];

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

    // Warm floating room ember particles & smoke trails
    const emberParticles = [];
    const smokeParticles = [];
    let flameTime = 0;

    // Static wax drips on candle pillar
    const waxDrips = [
      { xOffset: -28, lengthRatio: 0.7, width: 8, speed: 0.15 },
      { xOffset: 20, lengthRatio: 0.9, width: 9, speed: 0.2 },
      { xOffset: -10, lengthRatio: 0.45, width: 6, speed: 0.1 },
      { xOffset: 34, lengthRatio: 0.55, width: 5, speed: 0.12 },
      { xOffset: -38, lengthRatio: 0.35, width: 5, speed: 0.1 }
    ];

    const render = () => {
      // 1. Calculate Burn Progression (0 = 100% Full Height, 1 = 100% Burned down)
      let burnRatio = 0;
      if (propsRef.current.targetDurationSeconds > 0) {
        burnRatio = Math.min(1, propsRef.current.sessionSeconds / propsRef.current.targetDurationSeconds);
      } else {
        // Open mode: 45 mins cycle (2700s)
        burnRatio = (propsRef.current.sessionSeconds % 2700) / 2700;
      }

      // Height scale: from 1.0 (full tall pillar) down to 0.18 (shallow burned stump)
      const heightScale = Math.max(0.18, 1.0 - burnRatio * 0.82);

      // Deep intimate sanctuary / dark academia twilight background
      const bgGrad = ctx.createRadialGradient(width * 0.5, height * 0.35, 40, width * 0.5, height * 0.35, width * 0.75);
      bgGrad.addColorStop(0, '#221208');
      bgGrad.addColorStop(0.35, '#120a05');
      bgGrad.addColorStop(0.7, '#070402');
      bgGrad.addColorStop(1, '#020101');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Candle Center Stage Position (Upper-Center, clear above the bottom HUD)
      const centerX = width * 0.5;
      const centerY = height <= 750 ? height * 0.33 : height * 0.36;
      const candleBaseY = centerY + 130;

      // Candle Dimensions
      const pillarFullH = 220;
      const pillarCurrentH = pillarFullH * heightScale;
      const candleTopY = candleBaseY - pillarCurrentH;

      // 2. Dynamic Flame Physics & Flickering
      flameTime += propsRef.current.isRunning ? 0.09 : 0.03;
      const flameFlutterX = Math.sin(flameTime * 2.4) * 3.5 + Math.cos(flameTime * 4.2) * 2.0;
      const flameFlutterH = Math.sin(flameTime * 3.2) * 5.0;
      const flameBaseY = candleTopY - 18;

      // 3. Ambient Room Candle Glow Radiance (Breathing Halo)
      const haloRadius = 300 + Math.sin(flameTime * 2.0) * 22;
      const haloGrad = ctx.createRadialGradient(centerX + flameFlutterX * 0.5, flameBaseY - 20, 10, centerX, flameBaseY - 20, haloRadius);
      haloGrad.addColorStop(0, propsRef.current.style.flameGlow || 'rgba(251, 146, 60, 0.5)');
      haloGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.15)');
      haloGrad.addColorStop(0.75, 'rgba(234, 88, 12, 0.04)');
      haloGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(centerX, flameBaseY - 20, haloRadius, 0, Math.PI * 2);
      ctx.fill();

      // 4. Candle Holder / Terracotta / Brass / Geode Vessel
      drawCandleHolder(ctx, centerX, candleBaseY, propsRef.current.style.containerType, propsRef.current.style);

      // 5. Melted Wax Accumulation Pool at Base
      drawBaseWaxPool(ctx, centerX, candleBaseY, burnRatio, propsRef.current.style);

      // 6. Candle Wax Pillar Body with Active Dripping Wax
      drawCandlePillar(ctx, centerX, candleTopY, candleBaseY, pillarCurrentH, burnRatio, propsRef.current.style, waxDrips);

      // 7. Melted Translucent Liquid Wax Crater at the Top
      drawWaxPool(ctx, centerX, candleTopY, propsRef.current.style, burnRatio);

      // 8. Wick
      drawWick(ctx, centerX, candleTopY, flameBaseY, propsRef.current.style);

      // 9. Alive Flickering Flame
      drawFlame(ctx, centerX, flameBaseY, flameFlutterX, flameFlutterH, propsRef.current.style);

      // 10. Floating Embers & Smoke
      if (propsRef.current.isRunning) {
        if (Math.random() > 0.6) {
          emberParticles.push({
            x: centerX + flameFlutterX + (Math.random() - 0.5) * 24,
            y: flameBaseY - 45,
            vx: (Math.random() - 0.5) * 1.0,
            vy: -(Math.random() * 1.8 + 0.8),
            size: Math.random() * 3.0 + 1.2,
            alpha: 0.85,
            decay: Math.random() * 0.018 + 0.008
          });
        }

        if (Math.random() > 0.75) {
          smokeParticles.push({
            x: centerX + flameFlutterX * 0.8,
            y: flameBaseY - 55,
            vx: (Math.random() - 0.5) * 0.6 + (flameFlutterX * 0.1),
            vy: -(Math.random() * 1.2 + 0.6),
            size: Math.random() * 12 + 6,
            alpha: 0.3,
            decay: 0.008
          });
        }
      }

      // Render Smoke Wisps
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const sp = smokeParticles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= sp.decay;
        sp.size += 0.3;

        if (sp.alpha <= 0) {
          smokeParticles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(203, 213, 225, ${sp.alpha * 0.25})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Embers
      for (let i = emberParticles.length - 1; i >= 0; i--) {
        const ep = emberParticles[i];
        ep.x += ep.vx;
        ep.y += ep.vy;
        ep.alpha -= ep.decay;
        ep.size *= 0.98;

        if (ep.alpha <= 0 || ep.size <= 0.3) {
          emberParticles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(253, 224, 71, ${ep.alpha})`;
        ctx.beginPath();
        ctx.arc(ep.x, ep.y, ep.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 11. Floating Status Tag below the dish
      drawFloatingStatusTag(ctx, centerX, candleBaseY + 45, burnRatio, propsRef.current.style, propsRef.current.isRunning);

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

// Candle Holder / Container Renderer
function drawCandleHolder(ctx, cx, cy, type, style) {
  ctx.save();
  const width = 320;

  if (type === 'ornate_brass_holder') {
    // Victorian Antique Brass Stand & Handle
    const brassGrad = ctx.createLinearGradient(cx - width / 2, cy, cx + width / 2, cy + 35);
    brassGrad.addColorStop(0, '#ca8a04');
    brassGrad.addColorStop(0.5, '#fef08a');
    brassGrad.addColorStop(1, '#854d0e');
    ctx.fillStyle = brassGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, width / 2, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Brass holder ring handle
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(cx + width / 2 + 14, cy + 6, 22, -Math.PI * 0.6, Math.PI * 0.6);
    ctx.stroke();

  } else if (type === 'raw_amethyst_geode') {
    // Sparkling Purple Geode Gemstone Dish
    const geodeGrad = ctx.createLinearGradient(cx - width / 2, cy, cx + width / 2, cy + 40);
    geodeGrad.addColorStop(0, '#581c87');
    geodeGrad.addColorStop(0.5, '#c084fc');
    geodeGrad.addColorStop(1, '#3b0764');
    ctx.fillStyle = geodeGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 12, width / 2, 38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e9d5ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

  } else if (type === 'amber_apothecary_glass') {
    // Vintage Amber Glass Jar Base
    const glassGrad = ctx.createLinearGradient(cx - 70, cy - 25, cx + 70, cy + 25);
    glassGrad.addColorStop(0, 'rgba(180, 83, 9, 0.75)');
    glassGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.9)');
    glassGrad.addColorStop(1, 'rgba(120, 53, 15, 0.95)');
    ctx.fillStyle = glassGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, 75, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

  } else {
    // Terracotta / Ceramic Minimalist Plate
    const plateGrad = ctx.createRadialGradient(cx, cy + 8, 25, cx, cy + 8, width / 2);
    plateGrad.addColorStop(0, '#292524');
    plateGrad.addColorStop(0.7, '#1c1917');
    plateGrad.addColorStop(1, '#0c0a09');
    ctx.fillStyle = plateGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 12, width / 2, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  ctx.restore();
}

// Base Wax Pool accumulating at the dish
function drawBaseWaxPool(ctx, cx, baseY, burnRatio, style) {
  ctx.save();
  const poolRx = 55 + burnRatio * 55;
  const poolRy = 14 + burnRatio * 12;

  const waxBaseGrad = ctx.createRadialGradient(cx, baseY + 6, 10, cx, baseY + 6, poolRx);
  waxBaseGrad.addColorStop(0, style.waxColor || '#fef3c7');
  waxBaseGrad.addColorStop(0.6, style.secondaryWaxColor || '#b45309');
  waxBaseGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = waxBaseGrad;
  ctx.globalAlpha = 0.5 + burnRatio * 0.45;
  ctx.beginPath();
  ctx.ellipse(cx, baseY + 6, poolRx, poolRy, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Candle Pillar Body & Organic Cascading Wax Drips
function drawCandlePillar(ctx, cx, topY, baseY, currentH, burnRatio, style, drips) {
  ctx.save();
  const pillarW = style.candleType === 'taper' ? 44 : 96;
  const halfW = pillarW / 2;

  // Pillar Body Gradient
  const waxGrad = ctx.createLinearGradient(cx - halfW, 0, cx + halfW, 0);
  waxGrad.addColorStop(0, style.secondaryWaxColor || '#b45309');
  waxGrad.addColorStop(0.35, style.waxColor || '#fef3c7');
  waxGrad.addColorStop(0.75, style.waxColor || '#fde68a');
  waxGrad.addColorStop(1, style.secondaryWaxColor || '#78350f');
  ctx.fillStyle = waxGrad;

  // Main Cylinder Body
  ctx.beginPath();
  ctx.rect(cx - halfW, topY, pillarW, currentH);
  ctx.fill();

  // Bottom curved base
  ctx.beginPath();
  ctx.ellipse(cx, baseY, halfW, 16, 0, 0, Math.PI);
  ctx.fill();

  // Draw Realistic Wax Drips cascading down the pillar
  ctx.fillStyle = style.waxColor || '#fef3c7';
  drips.forEach((drip) => {
    const dripLen = Math.min(currentH * 0.88, drip.lengthRatio * currentH * (0.6 + burnRatio * 0.7));
    const dx = cx + drip.xOffset;
    if (Math.abs(drip.xOffset) < halfW - 4) {
      ctx.beginPath();
      ctx.moveTo(dx - drip.width / 2, topY + 4);
      ctx.lineTo(dx - drip.width / 2, topY + dripLen - 6);
      ctx.arc(dx, topY + dripLen - 6, drip.width / 2, 0, Math.PI);
      ctx.lineTo(dx + drip.width / 2, topY + 4);
      ctx.closePath();
      ctx.fill();
    }
  });

  ctx.restore();
}

// Molten Liquid Wax Pool at the Top Crater
function drawWaxPool(ctx, cx, topY, style, burnRatio) {
  ctx.save();
  const poolRx = style.candleType === 'taper' ? 22 : 48;
  const poolRy = 14;

  // Translucent Liquid Molten Wax Gradient
  const poolGrad = ctx.createRadialGradient(cx, topY, 6, cx, topY, poolRx);
  poolGrad.addColorStop(0, '#ffffff');
  poolGrad.addColorStop(0.4, style.waxColor || '#fef3c7');
  poolGrad.addColorStop(1, style.secondaryWaxColor || '#d97706');
  ctx.fillStyle = poolGrad;
  ctx.beginPath();
  ctx.ellipse(cx, topY, poolRx, poolRy, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wax Rim Highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
}

// Wick
function drawWick(ctx, cx, topY, flameBaseY, style) {
  ctx.save();
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = style.candleType === 'amber_jar' ? 6 : 3.5;
  ctx.beginPath();
  ctx.moveTo(cx, topY);
  ctx.lineTo(cx, flameBaseY);
  ctx.stroke();

  // Glowing Wick Tip Ember
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(cx, flameBaseY + 2, 3.0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Alive Dynamic Flickering Flame
function drawFlame(ctx, cx, flameBaseY, flutterX, flutterH, style) {
  ctx.save();
  const flameH = 58 + flutterH;
  const flameW = 22;
  const tipX = cx + flutterX;
  const tipY = flameBaseY - flameH;

  // 1. Outer Flame Corona
  const outerGrad = ctx.createRadialGradient(cx, flameBaseY - 25, 3, cx, flameBaseY - 25, 36);
  outerGrad.addColorStop(0, '#ffffff');
  outerGrad.addColorStop(0.2, '#fef08a');
  outerGrad.addColorStop(0.6, style.flameColor || '#f97316');
  outerGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
  ctx.fillStyle = outerGrad;

  ctx.beginPath();
  ctx.moveTo(cx - flameW / 2, flameBaseY);
  ctx.bezierCurveTo(cx - flameW, flameBaseY - flameH * 0.4, tipX - flameW * 0.35, tipY + 16, tipX, tipY);
  ctx.bezierCurveTo(tipX + flameW * 0.35, tipY + 16, cx + flameW, flameBaseY - flameH * 0.4, cx + flameW / 2, flameBaseY);
  ctx.closePath();
  ctx.fill();

  // 2. Inner Blue/Violet Oxygen Core at Wick Base
  const blueCoreGrad = ctx.createRadialGradient(cx, flameBaseY - 5, 2, cx, flameBaseY - 5, 16);
  blueCoreGrad.addColorStop(0, '#38bdf8');
  blueCoreGrad.addColorStop(0.65, '#6366f1');
  blueCoreGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = blueCoreGrad;
  ctx.beginPath();
  ctx.ellipse(cx, flameBaseY - 5, 9, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. Bright Center Core
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx + flutterX * 0.3, flameBaseY - flameH * 0.35, 5, flameH * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Floating Status Tag below the candle
function drawFloatingStatusTag(ctx, cx, tagY, burnRatio, style, isRunning) {
  ctx.save();
  const waxPercent = Math.max(0, Math.round((1 - burnRatio) * 100));

  ctx.textAlign = 'center';
  ctx.font = '600 13px "Outfit", sans-serif';
  ctx.fillStyle = '#ffedd5';
  ctx.fillText(style.name.toUpperCase(), cx, tagY);

  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillStyle = style.accentColor || '#fb923c';
  const statusLabel = isRunning 
    ? `${waxPercent}% WAX • BURNING IN REAL-TIME` 
    : `${waxPercent}% WAX • AWAITING MATCH STRIKE`;
  ctx.fillText(statusLabel, cx, tagY + 18);

  ctx.restore();
}
