"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { motionState } from "@/lib/scroll";

type Star = { x: number; y: number; r: number; a: number; tw: number; layer: number };

/**
 * Night sky behind everything: three parallax depths of stars + soft bokeh
 * signal lights, with speed streaks that appear as the train speeds up.
 * One canvas, DPR-capped, idles when the tab is hidden.
 */
export default function Atmosphere() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d", { alpha: true })!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    const depth = [0.04, 0.1, 0.22];
    const bokehColors = ["255,178,63", "90,180,255", "255,111,168", "79,209,165"];
    let bokeh: { x: number; y: number; r: number; c: string; layer: number }[] = [];

    const seed = () => {
      const n = Math.round(Math.min(220, (w * h) / 7000));
      stars = Array.from({ length: n }, () => {
        const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.7 ? 1 : 2;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: (layer + 1) * 0.45 + Math.random() * 0.5,
          a: 0.25 + Math.random() * 0.6,
          tw: Math.random() * Math.PI * 2,
          layer,
        };
      });
      bokeh = Array.from({ length: 7 }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 40 + Math.random() * 90,
        c: bokehColors[i % bokehColors.length],
        layer: 1 + (i % 2),
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    let t = 0;
    const draw = () => {
      t += 0.016;
      const sy = window.scrollY;
      const v = motionState.velocity;
      const streak = Math.min(Math.abs(v) * 1.6, 70);
      ctx.clearRect(0, 0, w, h);

      for (const b of bokeh) {
        const y = (((b.y - sy * depth[b.layer]) % (h + 200)) + h + 200) % (h + 200) - 100;
        const g = ctx.createRadialGradient(b.x, y, 0, b.x, y, b.r);
        g.addColorStop(0, `rgba(${b.c},0.07)`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(b.x - b.r, y - b.r, b.r * 2, b.r * 2);
      }

      for (const s of stars) {
        const y = (((s.y - sy * depth[s.layer]) % h) + h) % h;
        const alpha = reduced ? s.a : s.a * (0.65 + 0.35 * Math.sin(t * 1.4 + s.tw));
        if (streak > 2 && s.layer > 0) {
          ctx.strokeStyle = `rgba(237,230,214,${alpha * 0.55})`;
          ctx.lineWidth = s.r;
          ctx.beginPath();
          ctx.moveTo(s.x, y);
          ctx.lineTo(s.x, y + Math.sign(v) * streak * (s.layer / 2));
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(237,230,214,${alpha})`;
          ctx.fillRect(s.x, y, s.r, s.r);
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduced) {
      draw();
      const onScroll = () => requestAnimationFrame(draw);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
      };
    }
    gsap.ticker.add(draw);
    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="atmosphere" aria-hidden="true">
      <canvas ref={canvas} className="atmosphere-canvas" />
      <div className="fog fog--a" data-fog />
      <div className="fog fog--b" data-fog />
      <div className="grain" />
    </div>
  );
}
