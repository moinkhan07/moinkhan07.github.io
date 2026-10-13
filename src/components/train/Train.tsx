"use client";

import { stations } from "@/data/portfolio";
import { travelTo } from "@/lib/scroll";
import { CoachArt, EngineArt, Wheels } from "./TrainParts";

/**
 * The train is fixed to the viewport while the track scrolls underneath it,
 * so it is always "travelling" down the page. Coaches are real, connected
 * DOM nodes stacked behind the engine; journey.ts couples them on scroll.
 *
 * Transform layers (never fight each other):
 *   .train-body      -> jolts / arrival shudder
 *   .unit            -> coupling animation (scroll-scrubbed)
 *   .coach-phys      -> momentum physics (slack / sway, per frame)
 */
export default function Train() {
  return (
    <div className="train" data-train>
      <div className="train-headlight" data-headlight aria-hidden="true" />
      <nav className="train-body" data-train-body aria-label="Journey — jump to a coach">
        <div className="unit unit--engine" data-engine>
          <div className="engine-inner" data-engine-inner>
            <Wheels engine />
            <EngineArt />
            <span className="steam" data-steam aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="puff" />
              ))}
            </span>
          </div>
        </div>

        {stations.map((s, i) => (
          <div
            key={s.id}
            className="unit coach"
            data-coach={i}
            style={{ "--line": s.color, "--i": i } as React.CSSProperties}
          >
            <div className="coach-phys">
              <span className="coupler" aria-hidden="true">
                <span className="coupler-spark" />
              </span>
              <button
                type="button"
                className="coach-shell"
                data-cursor="Go"
                aria-label={`Coach ${s.no}: ${s.name} — go to ${s.short}`}
                onClick={() => travelTo(`#${s.id}`)}
              >
                <Wheels />
                <CoachArt no={s.no} color={s.color} />
              </button>
              <span className="coach-label" aria-hidden="true">
                <b>{s.no}</b> {s.short}
              </span>
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}
