"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { journey, projects, skillGroups } from "@/data/portfolio";
import { gsap } from "@/lib/gsap";
import { motionState } from "@/lib/scroll";
import { SectionHead, StationMarker } from "../ui/SectionHead";

const norm = (s: string) => s.toLowerCase().replace(/\.js$/, "").replace(/[^a-z0-9]/g, "");

/** Where each skill has actually been used — powers the "inspect" line on hover. */
function useUsage() {
  return useMemo(() => {
    const map = new Map<string, string[]>();
    const add = (skill: string, where: string) => {
      const k = norm(skill);
      map.set(k, [...(map.get(k) ?? []), where]);
    };
    projects.forEach((p) => p.stack.forEach((s) => add(s, p.title)));
    journey.forEach((j) => j.tech.forEach((s) => add(s, j.org)));
    return map;
  }, []);
}

function Ticker() {
  const track = useRef<HTMLDivElement>(null);
  const words = skillGroups.flatMap((g) => g.items);

  useEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 0;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const tick = () => {
      if (!visible) return;
      const half = el.scrollWidth / 2;
      const v = motionState.velocity;
      x -= 0.6 + Math.abs(v) * 0.35;
      if (x <= -half) x += half;
      el.style.transform = `translate3d(${x}px,0,0) skewX(${Math.max(-12, Math.min(12, -v * 0.4))}deg)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, []);

  return (
    <div className="ticker" aria-hidden="true">
      <div ref={track} className="ticker-track">
        {[0, 1].map((k) => (
          <span key={k} className="ticker-set">
            {words.map((w) => (
              <span key={w + k}>
                {w}
                <i>✦</i>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const usage = useUsage();
  const [inspect, setInspect] = useState<{ skill: string; where: string[] } | null>(null);

  return (
    <section id="skills" data-station="skills" className="station-section">
      <StationMarker id="skills" />
      <div className="wrap">
        <SectionHead
          id="skills"
          title={
            <>
              Cargo <em>manifest</em>
            </>
          }
          kicker="Everything I load onto a project — checked, tested and cleared for departure. Hover any item to see where it has travelled."
        />

        <div className="board" data-board>
          <div className="board-head" aria-hidden="true">
            <span>Plat.</span>
            <span>Cargo</span>
            <span>Manifest</span>
            <span className="text-right">Status</span>
          </div>

          {skillGroups.map((g) => (
            <div key={g.code} className="board-row" data-board-row>
              <span className="board-plat">{g.platform}</span>
              <h3 className="board-cat">
                <span data-flap>{g.name}</span>
              </h3>
              <ul className="board-items">
                {g.items.map((it) => {
                  const where = usage.get(norm(it)) ?? [];
                  return (
                    <li key={it}>
                      <button
                        type="button"
                        className="chip"
                        data-chip
                        data-cursor={where.length ? `×${where.length}` : "Skill"}
                        onPointerEnter={() => setInspect({ skill: it, where })}
                        onFocus={() => setInspect({ skill: it, where })}
                        onPointerLeave={() => setInspect(null)}
                        onBlur={() => setInspect(null)}
                      >
                        <span data-flap>{it}</span>
                        {where.length > 0 && <sup>×{where.length}</sup>}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <span className="board-status" data-status={g.status}>
                <span data-flap>{g.status}</span>
              </span>
            </div>
          ))}

          <div className="board-foot" aria-live="polite">
            <span className="board-blink" />
            {inspect ? (
              <span>
                <b>{inspect.skill}</b>{" "}
                {inspect.where.length
                  ? `→ used in ${inspect.where.slice(0, 5).join(" · ")}`
                  : "→ in the toolkit, ready for the next project"}
              </span>
            ) : (
              <span>All services running · {skillGroups.reduce((n, g) => n + g.items.length, 0)} items on board</span>
            )}
          </div>
        </div>
      </div>
      <Ticker />
    </section>
  );
}
