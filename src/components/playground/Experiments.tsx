"use client";

import { useRef } from "react";
import { useCanvas, type CanvasApi } from "./useCanvas";
import { stations } from "@/data/portfolio";

/* ------------------------------------------------------------------ */
/* 01 — Particle Signal: my name rebuilt from ~1k particles.           */
/* ------------------------------------------------------------------ */
export function ParticleName() {
  const parts = useRef<{ x: number; y: number; hx: number; hy: number; vx: number; vy: number; c: string }[]>([]);

  const ref = useCanvas({
    setup: ({ w, h }) => {
      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.round(w));
      off.height = Math.max(1, Math.round(h));
      const o = off.getContext("2d")!;
      const fs = Math.min(w / 2.6, h * 0.62);
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-display") || "sans-serif";
      o.font = `900 ${fs}px ${family}, Impact, sans-serif`;
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#fff";
      o.fillText("MOIN", w / 2, h / 2 + fs * 0.04);
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const step = Math.max(4, Math.round(Math.sqrt((w * h) / 4200)));
      const colors = ["#ffb23f", "#ede6d6", "#ede6d6", "#ff7a59"];
      const next: typeof parts.current = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (data[(y * off.width + x) * 4 + 3] > 128) {
            const prev = parts.current[next.length];
            next.push({
              x: prev?.x ?? Math.random() * w,
              y: prev?.y ?? Math.random() * h,
              hx: x,
              hy: y,
              vx: 0,
              vy: 0,
              c: colors[(x + y) % colors.length],
            });
          }
        }
      }
      parts.current = next;
    },
    frame: ({ ctx, w, h, pointer }) => {
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.22;
      for (const p of parts.current) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (pointer.inside && d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * 4.2;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx += (p.hx - p.x) * 0.045;
        p.vy += (p.hy - p.y) * 0.045;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, 2.2, 2.2);
      }
    },
    click: ({ pointer }) => {
      for (const p of parts.current) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d = Math.hypot(dx, dy) || 1;
        p.vx += (dx / d) * (40 + Math.random() * 30);
        p.vy += (dy / d) * (40 + Math.random() * 30);
      }
    },
  });
  return <canvas ref={ref} className="lab-canvas" />;
}

/* ------------------------------------------------------------------ */
/* 02 — Sleeper Field: a grid of track sleepers that turn toward you.  */
/* ------------------------------------------------------------------ */
export function SleeperField() {
  const ang = useRef<number[]>([]);
  const ref = useCanvas({
    frame: ({ ctx, w, h, pointer, t }: CanvasApi) => {
      ctx.clearRect(0, 0, w, h);
      const gap = Math.max(22, Math.min(w, h) / 12);
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      const px = pointer.inside ? pointer.x : w / 2 + Math.cos(t * 0.7) * w * 0.3;
      const py = pointer.inside ? pointer.y : h / 2 + Math.sin(t * 0.9) * h * 0.3;
      ctx.lineCap = "round";
      let k = 0;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++, k++) {
          const x = c * gap + (r % 2 ? gap / 2 : 0);
          const y = r * gap;
          const dx = px - x;
          const dy = py - y;
          const d = Math.hypot(dx, dy);
          const target = Math.atan2(dy, dx);
          const prev = ang.current[k] ?? target;
          let diff = target - prev;
          diff = Math.atan2(Math.sin(diff), Math.cos(diff));
          const a = prev + diff * 0.12;
          ang.current[k] = a;
          const near = Math.max(0, 1 - d / (Math.min(w, h) * 0.6));
          const len = gap * (0.18 + near * 0.42);
          ctx.strokeStyle = near > 0.55 ? `rgba(79,209,165,${0.4 + near * 0.6})` : `rgba(237,230,214,${0.14 + near * 0.6})`;
          ctx.lineWidth = 1.2 + near * 2.2;
          ctx.beginPath();
          ctx.moveTo(x - Math.cos(a) * len, y - Math.sin(a) * len);
          ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
          ctx.stroke();
        }
      }
    },
  });
  return <canvas ref={ref} className="lab-canvas" />;
}

/* ------------------------------------------------------------------ */
/* 03 — Coupling Chain: verlet-physics coaches that follow the pointer. */
/* ------------------------------------------------------------------ */
type Node = { x: number; y: number; px: number; py: number };
export function CouplingChain() {
  const nodes = useRef<Node[]>([]);
  const colors = stations.map((s) => s.color);

  const ref = useCanvas({
    setup: ({ w, h }) => {
      if (nodes.current.length) return;
      nodes.current = colors.map((_, i) => ({ x: w / 2, y: h * 0.2 + i * 30, px: w / 2, py: h * 0.2 + i * 30 }));
    },
    frame: ({ ctx, w, h, pointer, t }) => {
      const ns = nodes.current;
      if (!ns.length) return;
      const link = Math.min(46, h / 9);
      const head = ns[0];
      const tx = pointer.inside ? pointer.x : w / 2 + Math.sin(t * 0.8) * w * 0.32;
      const ty = pointer.inside ? pointer.y : h * 0.42 + Math.sin(t * 1.6) * h * 0.18;
      head.x += (tx - head.x) * 0.18;
      head.y += (ty - head.y) * 0.18;
      head.px = head.x;
      head.py = head.y;
      for (let i = 1; i < ns.length; i++) {
        const n = ns[i];
        const vx = (n.x - n.px) * 0.96;
        const vy = (n.y - n.py) * 0.96;
        n.px = n.x;
        n.py = n.y;
        n.x += vx;
        n.y += vy + 0.35; // gravity
      }
      for (let it = 0; it < 6; it++) {
        for (let i = 1; i < ns.length; i++) {
          const a = ns[i - 1];
          const b = ns[i];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1;
          const diff = (d - link) / d;
          if (i === 1) {
            b.x -= dx * diff;
            b.y -= dy * diff;
          } else {
            a.x += dx * diff * 0.5;
            a.y += dy * diff * 0.5;
            b.x -= dx * diff * 0.5;
            b.y -= dy * diff * 0.5;
          }
        }
        for (const n of ns) {
          n.x = Math.max(12, Math.min(w - 12, n.x));
          n.y = Math.max(12, Math.min(h - 12, n.y));
        }
      }
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(237,230,214,.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ns.forEach((n, i) => (i ? ctx.lineTo(n.x, n.y) : ctx.moveTo(n.x, n.y)));
      ctx.stroke();
      const cw = link * 0.5;
      const ch = link * 0.78;
      for (let i = ns.length - 1; i >= 0; i--) {
        const n = ns[i];
        const other = ns[i - 1] ?? ns[1];
        const ang = Math.atan2(other.y - n.y, other.x - n.x) - Math.PI / 2;
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(ang);
        ctx.fillStyle = "#1d2128";
        ctx.strokeStyle = "rgba(237,230,214,.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = colors[i];
        ctx.fillRect(-cw / 2 + 4, -3, cw - 8, 6);
        ctx.restore();
      }
    },
    click: () => {
      for (const n of nodes.current.slice(1)) {
        n.px -= (Math.random() - 0.5) * 40;
        n.py += 30;
      }
    },
  });
  return <canvas ref={ref} className="lab-canvas" />;
}
