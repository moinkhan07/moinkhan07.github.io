"use client";

import { useEffect, useRef } from "react";
import { profile } from "@/data/portfolio";
import { gsap } from "@/lib/gsap";
import { travelTo } from "@/lib/scroll";
import Magnetic from "../ui/Magnetic";
import { StationMarker } from "../ui/SectionHead";
import { GithubIcon, LinkedinIcon, ArrowIcon } from "../ui/Icons";

/** Deterministic PRNG so server and client render identical skylines/barcodes. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function Skyline() {
  const layers = [
    { seed: 7, fill: "#10141b", min: 60, max: 170, gap: 2, windows: false },
    { seed: 19, fill: "#0d1016", min: 40, max: 130, gap: 3, windows: true },
    { seed: 41, fill: "#0a0c0f", min: 20, max: 80, gap: 1, windows: false },
  ];
  return (
    <div className="skyline" data-skyline aria-hidden="true">
      {layers.map((l, li) => {
        const r = rng(l.seed);
        const rects: React.ReactNode[] = [];
        let x = 0;
        let k = 0;
        while (x < 1600) {
          const bw = 28 + r() * 70;
          const bh = l.min + r() * (l.max - l.min);
          rects.push(<rect key={`b${k}`} x={x} y={320 - bh} width={bw} height={bh} fill={l.fill} />);
          if (l.windows) {
            for (let wy = 320 - bh + 10; wy < 312; wy += 12) {
              for (let wx = x + 6; wx < x + bw - 6; wx += 10) {
                if (r() > 0.86) rects.push(<rect key={`w${k}-${wx}-${wy}`} x={wx} y={wy} width="3" height="4" fill="#ffb23f" opacity={0.25 + r() * 0.5} />);
              }
            }
          }
          if (r() > 0.85) rects.push(<rect key={`a${k}`} x={x + bw / 2 - 1} y={320 - bh - 22} width="2" height="22" fill={l.fill} />);
          x += bw + l.gap;
          k++;
        }
        return (
          <svg key={li} className="skyline-layer" data-depth={li} viewBox="0 0 1600 320" preserveAspectRatio="xMidYMax slice">
            {rects}
          </svg>
        );
      })}
    </div>
  );
}

function Barcode() {
  const r = rng(2024);
  const bars: React.ReactNode[] = [];
  let x = 0;
  while (x < 200) {
    const bw = r() > 0.6 ? 3 : 1.4;
    bars.push(<rect key={x} x={x} y="0" width={bw} height="40" fill="currentColor" />);
    x += bw + 1.2 + r() * 2;
  }
  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="pass-barcode" aria-hidden="true">
      {bars}
    </svg>
  );
}

function BoardingPass() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 16);
      rx(-(py - 0.5) * 12);
      el.style.setProperty("--gx", `${px * 100}%`);
      el.style.setProperty("--gy", `${py * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="pass-wrap" data-hero-pass>
      <div ref={ref} className="pass" data-cursor="Ticket">
        <div className="pass-main">
          <div className="pass-top">
            <span>Boarding pass</span>
            <span>Service MK-07</span>
          </div>
          <div className="pass-route">
            <div>
              <small>From</small>
              <b>IDEA</b>
            </div>
            <svg viewBox="0 0 80 16" className="pass-arrow" aria-hidden="true">
              <path d="M0 8 H72" stroke="currentColor" strokeDasharray="3 3" />
              <path d="M66 3 L74 8 L66 13" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div className="text-right">
              <small>To</small>
              <b>PROD</b>
            </div>
          </div>
          <dl className="pass-grid">
            <div>
              <dt>Passenger</dt>
              <dd>You</dd>
            </div>
            <div>
              <dt>Driver</dt>
              <dd>{profile.name}</dd>
            </div>
            <div>
              <dt>Class</dt>
              <dd>Full-Stack</dd>
            </div>
            <div>
              <dt>Coaches</dt>
              <dd>01 — 07</dd>
            </div>
            <div>
              <dt>Departs</dt>
              <dd>Now</dd>
            </div>
            <div>
              <dt>From</dt>
              <dd>Mumbai</dd>
            </div>
          </dl>
        </div>
        <div className="pass-stub">
          <Barcode />
          <span>Admit one journey</span>
        </div>
        <span className="pass-glare" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function Hero() {
  const roleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % profile.roles.length;
      gsap.to(roleRef.current, {
        duration: 1.1,
        scrambleText: { text: profile.roles[i], chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ/_.-", speed: 0.7 },
      });
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="departure" data-station="departure" className="station-section hero" aria-label="Introduction">
      <StationMarker id="departure" />
      <Skyline />
      <div className="hero-glow" aria-hidden="true" />

      <div className="wrap hero-grid">
        <p className="hero-board" data-hero-fade>
          <span className="live-dot" />
          Now boarding <span className="text-[var(--mute)]">·</span> Platform 01{" "}
          <span className="text-[var(--mute)]">·</span> {profile.location}
        </p>

        <h1 className="hero-name" data-hero-name aria-label={profile.name}>
          <span className="hero-line" data-hero-line>
            <span data-hero-chars>{profile.first}</span>
          </span>
          <span className="hero-line hero-line--outline" data-hero-line>
            <span data-hero-chars>{profile.last}</span>
          </span>
        </h1>

        <div className="hero-copy">
          <p className="hero-role" data-hero-fade>
            Full-stack &amp; React Native developer. I design and build <em>web platforms</em> and{" "}
            <em>mobile apps</em> — interface to API — that actually ship.
          </p>
          <p className="hero-focus" data-hero-fade>
            <span className="text-[var(--amber)]">$</span> focus = &quot;
            <span ref={roleRef}>{profile.roles[0]}</span>&quot;
          </p>
          <div className="hero-ctas" data-hero-fade>
            <Magnetic>
              <button type="button" className="btn btn--primary" data-cursor="Board" onClick={() => travelTo("#about")}>
                <span>Board the train</span>
                <ArrowIcon className="rotate-90" />
              </button>
            </Magnetic>
            <Magnetic>
              <button type="button" className="btn btn--ghost" data-cursor="Skip" onClick={() => travelTo("#contact")}>
                <span>Skip to terminus</span>
              </button>
            </Magnetic>
            <div className="flex items-center gap-2">
              <Magnetic strength={0.5}>
                <a href={profile.github} target="_blank" rel="noreferrer" className="icon-btn" aria-label="GitHub">
                  <GithubIcon />
                </a>
              </Magnetic>
              <Magnetic strength={0.5}>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="icon-btn" aria-label="LinkedIn">
                  <LinkedinIcon />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        <BoardingPass />
      </div>

      <div className="hero-cue" data-hero-fade aria-hidden="true">
        <span>Scroll to depart</span>
        <i />
      </div>
    </section>
  );
}
