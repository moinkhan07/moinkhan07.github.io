"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { stations, profile, type StationId } from "@/data/portfolio";
import { bus, getLenis, travelTo, type StationEvent } from "@/lib/scroll";

/** Fixed heads-up display: route badge, current/next station, live speed and the route menu. */
export default function Hud() {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = (e: Event) => setCurrent((e as StationEvent).detail.index);
    bus?.addEventListener("station", on);
    return () => bus?.removeEventListener("station", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
    };
  }, [open]);

  const now = stations[current];
  const next = stations[Math.min(current + 1, stations.length - 1)];

  const go = (id: StationId) => {
    setOpen(false);
    travelTo(`#${id}`);
  };

  return (
    <>
      <header className="hud" data-hud>
        <a href="#departure" className="hud-badge" data-cursor="Top" onClick={(e) => (e.preventDefault(), go("departure"))}>
          <span className="hud-badge-mark">MK</span>
          <span className="hidden sm:inline">Moin Khan</span>
        </a>

        <div className="hud-stations" aria-live="polite">
          <span className="hud-k">Now</span>
          <span className="hud-slot">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={now.id}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-110%", opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="hud-v"
                style={{ color: now.color }}
              >
                {now.no} {now.short}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="hud-k hidden md:inline">Next</span>
          <span className="hud-v hidden md:inline">{current === stations.length - 1 ? "— Terminus" : `${next.no} ${next.short}`}</span>
        </div>

        <div className="hud-right">
          <span className="hud-speed hidden sm:flex" title="Scroll speed">
            <span data-speed>000</span>
            <small>km/h</small>
          </span>
          <button
            type="button"
            className="hud-menu"
            data-cursor="Route"
            aria-expanded={open}
            aria-controls="route-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="hud-menu-lines" data-open={open} />
            <span>{open ? "Close" : "Route"}</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="route-menu"
            className="route-menu"
            role="dialog"
            aria-label="Route map"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <p className="route-menu-k">Route MK-07 · {stations.length} stations</p>
            <ol className="route-menu-list">
              {stations.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button type="button" onClick={() => go(s.id)} data-active={i === current} style={{ "--line": s.color } as React.CSSProperties}>
                    <span className="route-menu-no">{s.no}</span>
                    <span className="route-menu-name">{s.short}</span>
                    <span className="route-menu-sub">{s.name}</span>
                  </button>
                </motion.li>
              ))}
            </ol>
            <p className="route-menu-foot">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>{profile.location}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
