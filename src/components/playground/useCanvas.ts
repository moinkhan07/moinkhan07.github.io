"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export type CanvasApi = {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  pointer: { x: number; y: number; inside: boolean; down: boolean };
  t: number;
};

type Hooks = {
  setup?: (api: CanvasApi) => void;
  frame: (api: CanvasApi) => void;
  click?: (api: CanvasApi) => void;
};

/**
 * Shared plumbing for the lab experiments: DPR-capped sizing, pointer tracking
 * (mouse + touch), and a ticker that only runs while the canvas is on screen.
 */
export function useCanvas(hooks: Hooks) {
  const ref = useRef<HTMLCanvasElement>(null);
  const hooksRef = useRef(hooks);
  hooksRef.current = hooks;

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const api: CanvasApi = { ctx, w: 0, h: 0, pointer: { x: -9999, y: -9999, inside: false, down: false }, t: 0 };
    let running = false;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      api.w = r.width;
      api.h = r.height;
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hooksRef.current.setup?.(api);
      if (!running) hooksRef.current.frame(api);
    };

    const tick = () => {
      api.t += 1 / 60;
      hooksRef.current.frame(api);
    };

    const ro = new ResizeObserver(size);
    // re-run setup once web fonts are in (text-sampling experiments depend on them)
    document.fonts?.ready.then(() => cv.isConnected && size());
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      const vis = e.isIntersecting && !reduced;
      if (vis && !running) gsap.ticker.add(tick);
      if (!vis && running) gsap.ticker.remove(tick);
      running = vis;
    });
    io.observe(cv);

    const local = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      api.pointer.x = e.clientX - r.left;
      api.pointer.y = e.clientY - r.top;
    };
    const move = (e: PointerEvent) => {
      local(e);
      api.pointer.inside = true;
      if (reduced) hooksRef.current.frame(api);
    };
    const leave = () => {
      api.pointer.inside = false;
      api.pointer.down = false;
    };
    const down = (e: PointerEvent) => {
      local(e);
      api.pointer.down = true;
      api.pointer.inside = true;
      hooksRef.current.click?.(api);
    };
    const up = () => (api.pointer.down = false);

    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerleave", leave);
    cv.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      ro.disconnect();
      io.disconnect();
      if (running) gsap.ticker.remove(tick);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerleave", leave);
      cv.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return ref;
}
