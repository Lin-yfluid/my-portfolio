/** Canvas 星空背景 —— 关键性能组件
 * - 粒子数移动端降级，DPR ≤ 2 采样
 * - 闪烁用 globalAlpha 正弦，禁止 shadowBlur（性能杀手）
 * - prefers-reduced-motion 只渲染静态一帧
 * - 鼠标/触摸视差
 */
import { useEffect, useRef } from 'react';
import { useReduceMotion } from '@/hooks/useReduceMotion';

interface Particle {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  speed: number;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReduceMotion();

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext('2d');
    if (!context) return;
    // 非空别名，供嵌套函数闭包使用（TS 严格模式）
    const cv: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    let particles: Particle[] = [];
    let rafId = 0;
    let width = 0;
    let height = 0;
    const mouse = { tx: 0, ty: 0 };

    function initParticles(): void {
      const isMobile = width < 768;
      const count = isMobile ? 60 : 160;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.002 + 0.0005,
      }));
    }

    function resize(): void {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      cv.width = width * dpr;
      cv.height = height * dpr;
      cv.style.width = width + 'px';
      cv.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function draw(timestamp: number): void {
      ctx.clearRect(0, 0, width, height);
      const px = mouse.tx * 0.03;
      const py = mouse.ty * 0.03;

      for (const p of particles) {
        // 闪烁：正弦调制 globalAlpha（不用 shadowBlur）
        ctx.globalAlpha = p.baseAlpha * (0.3 + 0.7 * Math.abs(Math.sin(timestamp * p.speed + p.phase)));
        ctx.fillStyle = '#3B5BA9';
        ctx.beginPath();
        ctx.arc(p.x + px, p.y + py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function loop(timestamp: number): void {
      draw(timestamp);
      rafId = requestAnimationFrame(loop);
    }

    function onMouseMove(e: MouseEvent): void {
      mouse.tx = (e.clientX - width / 2) * 0.02;
      mouse.ty = (e.clientY - height / 2) * 0.02;
    }

    function onTouchMove(e: TouchEvent): void {
      const t = e.touches[0];
      if (t) {
        mouse.tx = (t.clientX - width / 2) * 0.02;
        mouse.ty = (t.clientY - height / 2) * 0.02;
      }
    }

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    if (reducedMotion) {
      draw(0); // 只渲染静态一帧
    } else {
      rafId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
