"use client";

import type Lenis from "lenis";
import type { StationId } from "@/data/portfolio";

/**
 * Tiny shared runtime state. Kept outside React on purpose: per-frame values
 * (scroll velocity, the Lenis instance) must never trigger re-renders.
 */
export const motionState = {
  reduced: false,
  /** smoothed scroll velocity in px / frame (positive = travelling down) */
  velocity: 0,
  introDone: false,
};

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

/** Event bus for low-frequency UI updates (current station, arrival). */
export const bus = typeof window !== "undefined" ? new EventTarget() : null;

export type StationEvent = CustomEvent<{ id: StationId; index: number }>;

export function emitStation(id: StationId, index: number) {
  bus?.dispatchEvent(new CustomEvent("station", { detail: { id, index } }));
}

/** Smooth-scroll to a station / element / pixel offset, with or without Lenis. */
export function travelTo(target: string | number | HTMLElement, opts: { offset?: number; immediate?: boolean } = {}) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, {
      offset: opts.offset ?? 0,
      immediate: opts.immediate,
      force: true,
      duration: 1.8,
      easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    });
    return;
  }
  const y = typeof el === "number" ? el : el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
  window.scrollTo({ top: y, behavior: motionState.reduced || opts.immediate ? "auto" : "smooth" });
}
