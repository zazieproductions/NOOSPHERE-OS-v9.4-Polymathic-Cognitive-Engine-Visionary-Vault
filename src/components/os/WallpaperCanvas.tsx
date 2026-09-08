import React, { useEffect, useRef } from 'react';
import { WallpaperMode } from '../../types';

interface WallpaperCanvasProps {
  mode: WallpaperMode;
}

export const WallpaperCanvas: React.FC<WallpaperCanvasProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for interactive field
    const mouse = { x: width / 2, y: height / 2, radius: 160 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particles for Neural Mode
    const particleCount = Math.min(85, Math.floor((width * height) / 18000));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.5 + 0.2,
      color: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)]
    }));

    // Matrix Rain drops
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
    const chars = '01アイウエオカキクケコサシスセソタチツテト0123456789ABCDEFΣΨΩΦ∇λπ';

    let gridOffset = 0;
    let time = 0;

    const render = () => {
      time += 0.015;

      if (mode === 'neural') {
        // Deep background
        ctx.fillStyle = '#050608';
        ctx.fillRect(0, 0, width, height);

        // Subtle gradient ambient orbs
        const grad = ctx.createRadialGradient(width * 0.3, height * 0.4, 10, width * 0.3, height * 0.4, 600);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.04)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        const grad2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 10, width * 0.8, height * 0.7, 500);
        grad2.addColorStop(0, 'rgba(6, 182, 212, 0.04)');
        grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Mouse gentle repel
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 1.5;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }

          // Draw node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.baseAlpha;
          ctx.fill();

          // Connect nearby particles
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const djx = p.x - p2.x;
            const djy = p.y - p2.y;
            const d = Math.sqrt(djx * djx + djy * djy);
            if (d < 110) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - d / 110) * 0.22;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1.0;
      } else if (mode === 'matrixRain') {
        ctx.fillStyle = 'rgba(5, 6, 8, 0.18)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Head character is glowing white/bright green
          ctx.fillStyle = '#a7f3d0';
          ctx.fillText(text, x, y);

          ctx.fillStyle = '#10b981';
          ctx.fillText(chars.charAt(Math.floor(Math.random() * chars.length)), x, y - fontSize);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      } else if (mode === 'cyberGrid') {
        ctx.fillStyle = '#050608';
        ctx.fillRect(0, 0, width, height);

        gridOffset = (gridOffset + 0.6) % 40;

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x < width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Horizontal flowing lines
        for (let y = gridOffset; y < height; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Ambient Horizon glow
        const horizon = ctx.createLinearGradient(0, height * 0.7, 0, height);
        horizon.addColorStop(0, 'rgba(6, 182, 212, 0)');
        horizon.addColorStop(1, 'rgba(6, 182, 212, 0.08)');
        ctx.fillStyle = horizon;
        ctx.fillRect(0, height * 0.7, width, height * 0.3);
      } else if (mode === 'topological') {
        ctx.fillStyle = '#06080d';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.lineWidth = 1;

        const numRings = 16;
        for (let r = 1; r <= numRings; r++) {
          ctx.beginPath();
          const baseRadius = r * 35 + Math.sin(time + r) * 12;
          for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
            const rad = baseRadius + Math.sin(angle * 5 + time * 0.5 + r) * 14;
            const x = width / 2 + Math.cos(angle) * rad * (width / height);
            const y = height / 2 + Math.sin(angle) * rad;
            if (angle === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        }
      } else {
        // Deep Void Minimal
        ctx.fillStyle = '#040507';
        ctx.fillRect(0, 0, width, height);

        // Very subtle stardust
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 40; i++) {
          const sx = (Math.sin(i * 99 + time * 0.01) * 0.5 + 0.5) * width;
          const sy = (Math.cos(i * 77 + time * 0.01) * 0.5 + 0.5) * height;
          ctx.fillRect(sx, sy, 1.2, 1.2);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mode]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
