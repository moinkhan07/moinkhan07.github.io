"use client";

import { useEffect, useRef } from "react";
import { stations } from "@/data/portfolio";
import { CouplingChain, ParticleName, SleeperField } from "../playground/Experiments";
import { StationMarker } from "../ui/SectionHead";

/** Variable-weight title: each letter thickens as the pointer approaches. */
function KineticTitle({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-k]"));
    let raf = 0;
    let mx = -9999;
    let my = -9999;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const update = () => {
      raf = 0;
      for (const l of letters) {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        const n = Math.max(0, 1 - d / 420);
        l.style.fontVariationSettings = `"wght" ${Math.round(300 + n * 600)}`;
        l.style.color = n > 0.6 ? "var(--line)" : "";
      }
    };
    const move = (e: PointerEvent) => {
      if (!visible) return;
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span ref={ref} className="kinetic" aria-label={text}>
      {text.split("").map((c, i) => (
        <span key={i} data-k aria-hidden="true">
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}

const experiments = [
  { no: "06.1", name: "Particle Signal", how: "Move to scatter · click to blast", el: <ParticleName /> },
  { no: "06.2", name: "Sleeper Field", how: "Every sleeper turns to face you", el: <SleeperField /> },
  { no: "06.3", name: "Coupling Chain", how: "Lead the train · click to jolt", el: <CouplingChain /> },
];

export default function Playground() {
  const s = stations.find((x) => x.id === "playground")!;
  return (
    <section id="playground" data-station="playground" className="station-section">
      <StationMarker id="playground" />
      <div className="wrap" style={{ "--line": s.color } as React.CSSProperties}>
        <header className="sec-head">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow-dot" />
            Coach {s.no} <span className="eyebrow-sep">/</span> {s.name}
          </p>
          <h2 className="sec-title lab-title">
            <KineticTitle text="Playground" />
          </h2>
          <p className="sec-kicker" data-reveal>
            The observation car — small experiments in motion, physics and type. Everything here is live code; go on, touch it.
          </p>
        </header>

        <div className="lab-grid">
          {experiments.map((x, i) => (
            <figure key={x.no} className={`lab-tile lab-tile--${i}`} data-lab-tile data-cursor="Play">
              {x.el}
              <figcaption className="lab-cap">
                <span>{x.no}</span>
                <b>{x.name}</b>
                <small>{x.how}</small>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
