import React, { useEffect, useRef } from 'react';

export default function TrainCanvas({ isRunning, totalSeconds, currentMilestone, nextMilestone, progressPercent }) {
  const canvasRef = useRef(null);
  
  const propsRef = useRef({ isRunning });
  useEffect(() => {
    propsRef.current = { isRunning };
  }, [isRunning]);

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

    // Parallax scroll offsets
    let skyOffset = 0;
    let mountainOffset = 0;
    let hillOffset = 0;
    let treeOffset = 0;
    let poleOffset = 0;
    let trainBounce = 0;
    let steamParticles = [];

    // Speed multiplier based on isRunning
    let currentSpeed = 0.5;

    const render = () => {
      // Speed smoothing
      const targetSpeed = propsRef.current.isRunning ? 4.2 : 0.4;
      currentSpeed += (targetSpeed - currentSpeed) * 0.05;

      skyOffset += currentSpeed * 0.1;
      mountainOffset += currentSpeed * 0.4;
      hillOffset += currentSpeed * 1.2;
      treeOffset += currentSpeed * 3.0;
      poleOffset += currentSpeed * 6.5;

      trainBounce = propsRef.current.isRunning ? Math.sin(Date.now() * 0.008) * 1.8 + Math.cos(Date.now() * 0.015) * 0.8 : 0;

      // 1. Sky Gradient (Warm Golden Sunset / Twilight)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.65);
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.35, '#1e1b4b');
      skyGrad.addColorStop(0.65, '#431407');
      skyGrad.addColorStop(0.85, '#9a3412');
      skyGrad.addColorStop(1, '#ea580c');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Sun / Moon on Horizon
      ctx.fillStyle = '#ffedd5';
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 40;
      ctx.beginPath();
      ctx.arc(width * 0.72, height * 0.38, 55, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Sun Horizon Glow
      const sunGlow = ctx.createRadialGradient(width * 0.72, height * 0.38, 50, width * 0.72, height * 0.38, 200);
      sunGlow.addColorStop(0, 'rgba(251, 146, 60, 0.4)');
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(width * 0.72, height * 0.38, 200, 0, Math.PI * 2);
      ctx.fill();

      // 2. Distant Mountains Layer
      drawMountains(ctx, width, height, mountainOffset);

      // 3. Midground Rolling Hills & Village Silhouettes
      drawHills(ctx, width, height, hillOffset);

      // 4. Foreground Trees & Foliage
      drawTrees(ctx, width, height, treeOffset);

      // 5. Passing Telegraph Poles / Electricity Lines
      drawPowerPoles(ctx, width, height, poleOffset);

      // 6. Cozy Train Cabin Interior (Window frame, Table, Friends Studying)
      drawCozyTrainCabin(ctx, width, height, trainBounce, propsRef.current.isRunning, steamParticles);

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

// Distant Mountain Ridge
function drawMountains(ctx, width, height, offset) {
  ctx.fillStyle = '#31103f';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.65);

  const baseH = height * 0.46;
  for (let x = -100; x <= width + 100; x += 120) {
    const peakX = x - (offset % 240);
    const peakY = baseH + Math.sin((x + offset * 0.2) * 0.006) * 50 - ((x % 360 === 0) ? 40 : 0);
    ctx.lineTo(peakX, peakY);
  }
  ctx.lineTo(width, height * 0.7);
  ctx.lineTo(0, height * 0.7);
  ctx.closePath();
  ctx.fill();

  // Second Closer Mountain Ridge
  ctx.fillStyle = '#1e1136';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  const baseH2 = height * 0.52;
  for (let x = -100; x <= width + 100; x += 90) {
    const peakX = x - ((offset * 1.4) % 180);
    const peakY = baseH2 + Math.cos((x + offset * 0.3) * 0.008) * 40;
    ctx.lineTo(peakX, peakY);
  }
  ctx.lineTo(width, height * 0.75);
  ctx.lineTo(0, height * 0.75);
  ctx.closePath();
  ctx.fill();
}

// Rolling Green/Warm Hills
function drawHills(ctx, width, height, offset) {
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.8);
  const hillBase = height * 0.58;
  for (let x = 0; x <= width + 100; x += 60) {
    const hX = x - (offset % 120);
    const hY = hillBase + Math.sin((x + offset) * 0.007) * 25;
    ctx.lineTo(hX, hY);
  }
  ctx.lineTo(width, height * 0.8);
  ctx.lineTo(0, height * 0.8);
  ctx.closePath();
  ctx.fill();
}

// Passing Trees
function drawTrees(ctx, width, height, offset) {
  ctx.fillStyle = '#020617';
  const treeBaseY = height * 0.65;
  const treeSpacing = 160;

  for (let i = -1; i < (width / treeSpacing) + 2; i++) {
    const treeX = (i * treeSpacing) - (offset % treeSpacing);
    const treeH = 65 + (Math.sin(i * 12) * 20);

    ctx.beginPath();
    ctx.moveTo(treeX, treeBaseY - treeH);
    ctx.lineTo(treeX - 25, treeBaseY);
    ctx.lineTo(treeX + 25, treeBaseY);
    ctx.closePath();
    ctx.fill();
  }
}

// Electricity / Telegraph Poles
function drawPowerPoles(ctx, width, height, offset) {
  ctx.strokeStyle = '#020617';
  ctx.lineWidth = 4;
  const poleSpacing = 320;
  const poleBaseY = height * 0.68;

  for (let i = -1; i < (width / poleSpacing) + 2; i++) {
    const poleX = (i * poleSpacing) - (offset % poleSpacing);
    const poleH = 120;

    ctx.beginPath();
    ctx.moveTo(poleX, poleBaseY);
    ctx.lineTo(poleX, poleBaseY - poleH);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(poleX - 25, poleBaseY - poleH + 15);
    ctx.lineTo(poleX + 25, poleBaseY - poleH + 15);
    ctx.stroke();
  }

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(2, 6, 23, 0.8)';
  ctx.beginPath();
  ctx.moveTo(0, poleBaseY - 100);
  ctx.quadraticCurveTo(width * 0.5, poleBaseY - 80, width, poleBaseY - 100);
  ctx.stroke();
}

// Cozy Train Cabin Cross-Section & Study Friends
function drawCozyTrainCabin(ctx, width, height, bounce, isMoving, steamParticles) {
  const cabinTop = height * 0.62 + bounce;

  // Window Frame & Carriage Sill
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, cabinTop, width, height - cabinTop);

  // Wooden Table / Counter
  const tableGrad = ctx.createLinearGradient(0, cabinTop, 0, height);
  tableGrad.addColorStop(0, '#1e293b');
  tableGrad.addColorStop(0.1, '#334155');
  tableGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = tableGrad;
  ctx.fillRect(0, cabinTop + 35, width, height - cabinTop);

  // Table Top Rim Highlight
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, cabinTop + 35);
  ctx.lineTo(width, cabinTop + 35);
  ctx.stroke();

  // Warm Cabin Lamp Glow from above
  const lampX = width * 0.5;
  const lampY = cabinTop - 40;
  const lampGlow = ctx.createRadialGradient(lampX, lampY, 10, lampX, lampY, 350);
  lampGlow.addColorStop(0, 'rgba(253, 224, 71, 0.25)');
  lampGlow.addColorStop(0.6, 'rgba(245, 158, 11, 0.08)');
  lampGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = lampGlow;
  ctx.beginPath();
  ctx.arc(lampX, lampY, 350, 0, Math.PI * 2);
  ctx.fill();

  // Glass Window Border / Pillars
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 40, height);
  ctx.fillRect(width - 40, 0, 40, height);
  ctx.fillRect(0, 0, width, 50);

  // Curtains on sides
  ctx.fillStyle = '#831843';
  ctx.beginPath();
  ctx.moveTo(40, 50);
  ctx.quadraticCurveTo(85, height * 0.3, 40, cabinTop + 35);
  ctx.lineTo(40, 50);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(width - 40, 50);
  ctx.quadraticCurveTo(width - 85, height * 0.3, width - 40, cabinTop + 35);
  ctx.lineTo(width - 40, 50);
  ctx.fill();

  // Draw 3 Studying Companion Friends
  const friendBaseY = cabinTop + 30;

  // Friend 1 (Left): Coding / Laptop
  drawFriendLaptop(ctx, width * 0.28, friendBaseY, bounce);

  // Friend 2 (Center): Reading Book & Highlighting
  drawFriendBook(ctx, width * 0.5, friendBaseY, bounce);

  // Friend 3 (Right): Listening with Headphones & Steaming Tea Mug
  drawFriendTea(ctx, width * 0.72, friendBaseY, bounce, steamParticles);
}

// Friend 1: Typing on Laptop
function drawFriendLaptop(ctx, x, y, bounce) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.roundRect(-22, -45, 44, 45, [14, 14, 0, 0]);
  ctx.fill();

  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, -58, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(0, -62, 15, Math.PI, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-18, -4, 36, 4);

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(-16, -4);
  ctx.lineTo(-14, -28);
  ctx.lineTo(14, -28);
  ctx.lineTo(16, -4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-12, -26, 24, 20);

  const screenGlow = ctx.createRadialGradient(0, -18, 5, 0, -50, 40);
  screenGlow.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
  screenGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = screenGlow;
  ctx.beginPath();
  ctx.arc(0, -50, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Friend 2: Reading Book
function drawFriendBook(ctx, x, y, bounce) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.roundRect(-22, -48, 44, 48, [14, 14, 0, 0]);
  ctx.fill();

  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, -58, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(0, -63, 15, Math.PI * 0.9, Math.PI * 2.1);
  ctx.fill();

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(-4, -56, 3, 0, Math.PI * 2);
  ctx.arc(4, -56, 3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(-20, 0);
  ctx.lineTo(-18, -12);
  ctx.lineTo(0, -8);
  ctx.lineTo(18, -12);
  ctx.lineTo(20, 0);
  ctx.lineTo(0, -2);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

// Friend 3: Headphones & Steaming Mug
function drawFriendTea(ctx, x, y, bounce, steamParticles) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#8b5cf6';
  ctx.beginPath();
  ctx.roundRect(-22, -45, 44, 45, [14, 14, 0, 0]);
  ctx.fill();

  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, -58, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.arc(0, -60, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(0, -61, 16, Math.PI * 0.8, Math.PI * 2.2);
  ctx.stroke();

  ctx.fillStyle = '#f43f5e';
  ctx.fillRect(-18, -62, 5, 10);
  ctx.fillRect(13, -62, 5, 10);

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(25, -16, 14, 16);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(39, -8, 4, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.stroke();

  if (Math.random() > 0.6) {
    steamParticles.push({
      x: x + 32,
      y: y - 16,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.8 + 0.5),
      size: Math.random() * 3 + 2,
      alpha: 0.6
    });
  }

  ctx.restore();

  for (let i = steamParticles.length - 1; i >= 0; i--) {
    const sp = steamParticles[i];
    sp.x += sp.vx;
    sp.y += sp.vy;
    sp.alpha -= 0.015;
    sp.size += 0.08;

    if (sp.alpha <= 0) {
      steamParticles.splice(i, 1);
      continue;
    }

    ctx.fillStyle = `rgba(255, 255, 255, ${sp.alpha})`;
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
