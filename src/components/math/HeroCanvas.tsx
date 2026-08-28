import { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const GRID_SIZE = 40;
    const POINT_COUNT = 12;
    const points = Array.from({ length: POINT_COUNT }, (_, i) => ({
      x: Math.random() * 600,
      y: Math.random() * 400,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 3 + 2,
      color: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#3b82f6' : '#f59e0b',
    }));

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    function drawGrid() {
      ctx!.strokeStyle = 'rgba(59,130,246,0.06)';
      ctx!.lineWidth = 0.5;
      for (let x = 0; x < W(); x += GRID_SIZE) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, H());
        ctx!.stroke();
      }
      for (let y = 0; y < H(); y += GRID_SIZE) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(W(), y);
        ctx!.stroke();
      }
    }

    function drawAxes() {
      const cx = W() / 2, cy = H() / 2;
      ctx!.strokeStyle = 'rgba(59,130,246,0.18)';
      ctx!.lineWidth = 1;
      ctx!.beginPath(); ctx!.moveTo(0, cy); ctx!.lineTo(W(), cy); ctx!.stroke();
      ctx!.beginPath(); ctx!.moveTo(cx, 0); ctx!.lineTo(cx, H()); ctx!.stroke();
    }

    function drawSineCurve(t: number) {
      ctx!.beginPath();
      ctx!.strokeStyle = 'rgba(6,182,212,0.3)';
      ctx!.lineWidth = 1.5;
      for (let px = 0; px < W(); px++) {
        const x = (px / W()) * 4 * Math.PI;
        const y = Math.sin(x + t * 0.3) * 60 + H() / 2;
        px === 0 ? ctx!.moveTo(px, y) : ctx!.lineTo(px, y);
      }
      ctx!.stroke();
    }

    function drawParabola(t: number) {
      ctx!.beginPath();
      ctx!.strokeStyle = 'rgba(245,158,11,0.2)';
      ctx!.lineWidth = 1.5;
      const cx = W() / 2, cy = H() / 2;
      const a = 0.003 + Math.sin(t * 0.1) * 0.001;
      for (let px = 0; px < W(); px++) {
        const x = px - cx;
        const y = a * x * x + cy - 80;
        px === 0 ? ctx!.moveTo(px, y) : ctx!.lineTo(px, y);
      }
      ctx!.stroke();
    }

    function drawPoints(t: number) {
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W()) p.vx *= -1;
        if (p.y < 0 || p.y > H()) p.vy *= -1;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = p.color + '99';
        ctx!.fill();
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r + 3 + Math.sin(t * 0.05 + p.x) * 2, 0, Math.PI * 2);
        ctx!.strokeStyle = p.color + '30';
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      });

      // Draw connections between nearby points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(59,130,246,${0.12 * (1 - dist / 150)})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(points[i].x, points[i].y);
            ctx!.lineTo(points[j].x, points[j].y);
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      timeRef.current++;
      const t = timeRef.current;
      ctx!.clearRect(0, 0, W(), H());
      drawGrid();
      drawAxes();
      drawSineCurve(t);
      drawParabola(t);
      drawPoints(t);
      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-hidden="true"
    />
  );
}
