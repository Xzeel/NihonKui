import { useEffect, useRef } from 'react';

const PETAL_COUNT = 30;
const COLORS = ['#FFB7C5', '#FF69B4', '#FFC0CB', '#FFD1DC', '#F8BBD0'];

export default function SakuraConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petals = Array.from({ length: PETAL_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 10 + 6,
      speedY: Math.random() * 2 + 1,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 4 - 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.5 + 0.5,
    }));

    let animId: number;
    let elapsed = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elapsed++;

      petals.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(elapsed * 0.02 + p.x * 0.01) * 0.5 + p.speedX * 0.3;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 20) {
          p.opacity -= 0.02;
          if (p.opacity <= 0) return;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (elapsed < 300) {
        animId = requestAnimationFrame(draw);
      }
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[90]"
    />
  );
}
