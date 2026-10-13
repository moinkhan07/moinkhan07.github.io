"use client";

import Lenis from "lenis";
import { stations } from "@/data/portfolio";
import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { emitStation, motionState, setLenis } from "./scroll";

/* =====================================================================
 * THE JOURNEY — central choreography for the whole site.
 *
 *  1. geometry      viewport-locked train position (--nose) + track end
 *  2. Lenis         smooth scroll, driven by the GSAP ticker
 *  3. physics       per-frame momentum: slack between coaches, sway, wheel roll
 *  4. intro         departure board → doors open → engine arrives → coach 01 couples
 *  5. scenes        one gsap.matchMedia, built strictly in page order:
 *                   for each station: couple coach → section scene → reveals → tracker
 *  6. arrival       terminus sequence at the very end of the page
 *
 * Everything is created inside gsap contexts and fully reverted on cleanup
 * (React Strict Mode safe, breakpoint changes rebuild cleanly).
 * ===================================================================== */

type Conds = { desktop?: boolean; mobile?: boolean; reduce?: boolean };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const pad = (n: number) => String(n).padStart(2, "0");

export function startJourney(root: HTMLElement) {
  const html = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  motionState.reduced = reduced;
  let killed = false;
  const disposers: Array<() => void> = [];

  // Always depart from the first station.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  /* 1 — geometry ------------------------------------------------------ */
  disposers.push(createGeometry());

  /* 2 — smooth scroll ------------------------------------------------- */
  let lenis: Lenis | null = null;
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.15 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    disposers.push(() => {
      gsap.ticker.remove(raf);
      lenis?.destroy();
      setLenis(null);
    });
  }

  /* 3 — physics -------------------------------------------------------- */
  if (!reduced) disposers.push(createTrainPhysics(root));

  /* 4 + 5 — intro, then scenes --------------------------------------- */
  html.classList.add("is-intro");
  lenis?.stop();
  const introCtx = gsap.context(() => {}, root);
  let mm: gsap.MatchMedia | null = null;

  Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(2500)]).then(() => {
    if (killed) return;
    introCtx.add(() =>
      playIntro(root, reduced, () => {
        if (killed) return;
        motionState.introDone = true;
        html.classList.remove("is-intro");
        lenis?.start();
        mm = gsap.matchMedia();
        mm.add(
          {
            desktop: "(min-width: 1024px)",
            mobile: "(max-width: 1023.98px)",
            reduce: "(prefers-reduced-motion: reduce)",
          },
          (ctx) => buildScenes(root, ctx.conditions as Conds),
        );
        ScrollTrigger.refresh();
      }),
    );
  });

  return () => {
    killed = true;
    mm?.revert();
    introCtx.revert();
    disposers.forEach((d) => d());
    html.classList.remove("is-intro");
    motionState.introDone = false;
  };
}

/* =====================================================================
 * 1. Geometry — where the engine's nose sits in the viewport
 * ===================================================================== */
function createGeometry() {
  const html = document.documentElement;
  let lastW = 0;
  let lastH = 0;
  const apply = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Ignore small height-only changes (mobile URL bar) to avoid jumps.
    if (w === lastW && Math.abs(h - lastH) < 120) return;
    lastW = w;
    lastH = h;
    const nose = Math.round(h * (w < 768 ? 0.885 : 0.86));
    html.style.setProperty("--nose", `${nose}px`);
    html.style.setProperty("--vh-px", `${h}px`);
  };
  apply();
  window.addEventListener("resize", apply);
  return () => window.removeEventListener("resize", apply);
}

/** y that parks a coach just above the top of the viewport (fully detached). */
function detachedY(unit: HTMLElement) {
  const body = unit.parentElement as HTMLElement;
  return -(body.offsetTop + unit.offsetTop + unit.offsetHeight + 70);
}

/* =====================================================================
 * 3. Physics — momentum, slack and sway, written straight to transforms
 * ===================================================================== */
function createTrainPhysics(root: HTMLElement) {
  const train = $("[data-train]", root)!;
  const engineInner = $("[data-engine-inner]", root)!;
  const phys = $$("[data-coach] .coach-phys", root);
  const speedEl = $("[data-speed]", root);
  let last = window.scrollY;
  let vel = 0;
  let roll = 0;
  let t = 0;
  let frame = 0;
  let settled = false;

  const tick = () => {
    const y = window.scrollY;
    const dv = y - last;
    last = y;
    vel += (dv - vel) * 0.12;
    motionState.velocity = vel;
    t += 1 / 60;
    if (dv === 0 && Math.abs(vel) < 0.02) {
      if (settled) return;
      settled = true;
      vel = 0;
    } else settled = false;

    roll = (roll + dv * 0.9) % 400;
    train.style.setProperty("--roll", `${roll.toFixed(1)}px`);

    // Slack: travelling down stretches the couplings, reversing compresses them.
    const slack = gsap.utils.clamp(-4.5, 7, vel * 0.32);
    const moving = Math.min(1, Math.abs(vel) / 10);
    for (let i = 0; i < phys.length; i++) {
      const off = -slack * (i + 1);
      const sway = Math.sin(t * 2.4 + i * 0.85) * 0.7 * moving;
      phys[i].style.transform = `translate3d(0,${off.toFixed(2)}px,0) rotate(${sway.toFixed(3)}deg)`;
    }
    engineInner.style.transform = `translate3d(${((Math.random() - 0.5) * 0.8 * moving).toFixed(2)}px,0,0)`;
    if (speedEl && ++frame % 6 === 0) speedEl.textContent = String(Math.min(999, Math.round(Math.abs(vel) * 6))).padStart(3, "0");
  };

  gsap.ticker.add(tick);
  return () => {
    gsap.ticker.remove(tick);
    motionState.velocity = 0;
  };
}

/* =====================================================================
 * Coupling helpers
 * ===================================================================== */
function couple(root: HTMLElement, i: number, on: boolean) {
  const unit = $(`[data-coach="${i}"]`, root);
  const section = $$("[data-station]", root)[i];
  const body = $("[data-train-body]", root);
  if (!unit) return;
  unit.classList.toggle("is-coupled", on);
  section?.querySelector("[data-signal]")?.classList.toggle("is-go", on);
  if (on) {
    unit.classList.remove("spark");
    void unit.offsetWidth; // restart the spark animation
    unit.classList.add("spark");
    gsap.fromTo(body, { y: 0 }, { y: 6, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.out", overwrite: true });
  } else {
    gsap.fromTo(body, { y: 0 }, { y: -4, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.out", overwrite: true });
  }
}

function setActive(root: HTMLElement, i: number) {
  $$("[data-coach]", root).forEach((u, k) => u.classList.toggle("is-active", k === i));
  emitStation(stations[i].id, i);
}

/* =====================================================================
 * 4. Intro — the departure
 * ===================================================================== */
function playIntro(root: HTMLElement, reduced: boolean, done: () => void) {
  const loader = $("[data-loader]", root)!;
  const engine = $("[data-engine]", root)!;
  const units = $$("[data-coach]", root);
  const track = $("[data-track]", root)!;
  const hud = $("[data-hud]", root)!;
  const headlight = $("[data-headlight]", root)!;

  units.forEach((u) => gsap.set(u, { y: detachedY(u) }));

  if (reduced) {
    gsap.set([engine, ...units], { y: 0 });
    units.forEach((u) => u.classList.add("is-coupled"));
    gsap.to(loader, { autoAlpha: 0, duration: 0.3, onComplete: done });
    return;
  }

  gsap.set(engine, { y: -(window.innerHeight + 240) });
  const count = $("[data-loader-count]", root)!;
  const split = SplitText.create($$("[data-hero-chars]", root), { type: "chars", mask: "chars" });

  const counter = { v: 0 };
  const tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: cleanupAndDone });

  tl.to(counter, {
    v: 100,
    duration: 1.5,
    ease: "power2.inOut",
    onUpdate: () => (count.textContent = String(Math.round(counter.v)).padStart(3, "0")),
  })
    .fromTo("[data-loader-bar]", { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
    .to("[data-loader-status]", { duration: 0.8, scrambleText: { text: "Cleared for departure", chars: "upperCase", speed: 0.6 } }, 0.7)
    .to("[data-loader-board]", { autoAlpha: 0, y: -24, duration: 0.45, ease: "power2.in" }, "+=0.15")
    .to("[data-door='top']", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "<0.1")
    .to("[data-door='bottom']", { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, "<")
    .set(loader, { display: "none" })
    .fromTo(track, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power2.inOut", clearProps: "clipPath" }, "-=1.05")
    .to(engine, { y: 0, duration: 1.7, ease: "power4.out" }, "-=1.35")
    .fromTo(headlight, { opacity: 0 }, { opacity: 1, duration: 0.12, repeat: 3, yoyo: true, ease: "steps(1)" }, "<0.45")
    .to(units[0], { y: 0, duration: 0.95, ease: "power3.inOut" }, "-=0.85")
    .add(() => couple(root, 0, true))
    .from(split.chars, { yPercent: 118, rotate: 8, duration: 1.2, stagger: 0.05, ease: "expo.out" }, "-=1.25")
    .from("[data-hero-fade]", { y: 34, autoAlpha: 0, duration: 1, stagger: 0.08 }, "-=0.95")
    .from("[data-hero-pass]", { y: 90, rotationX: -55, autoAlpha: 0, duration: 1.3, ease: "expo.out" }, "<0.1")
    .from(hud, { yPercent: -130, duration: 0.9 }, "<")
    .from("[data-skyline] .skyline-layer", { yPercent: 35, duration: 1.6, stagger: 0.12, ease: "expo.out" }, "<");

  // Impatient passengers can hurry the departure.
  const hurry = () => tl.timeScale(4);
  const evs = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
  evs.forEach((e) => window.addEventListener(e, hurry, { passive: true, once: true }));
  function cleanupAndDone() {
    evs.forEach((e) => window.removeEventListener(e, hurry));
    done();
  }
}

/* =====================================================================
 * 5. Scenes — built in page order
 * ===================================================================== */
function buildScenes(root: HTMLElement, { desktop, reduce }: Conds) {
  const sections = $$<HTMLElement>("[data-station]", root);
  const units = $$("[data-coach]", root);

  if (reduce) {
    // Reduced motion: everything coupled, all content in its final state, no scrubbing.
    units.forEach((u) => {
      gsap.set(u, { y: 0 });
      u.classList.add("is-coupled");
    });
    sections.forEach((s, i) => {
      s.querySelector("[data-signal]")?.classList.add("is-go");
      stationTracker(root, s, i);
    });
    $$("[data-gauge]", root).forEach((g, i) => gaugeTo(g, i, 1, true));
    gsap.set("[data-stamp]", { opacity: 1, scale: 1, rotation: -12 });
    return;
  }

  sections.forEach((section, i) => {
    if (i > 0) coachAttach(root, section, i);
    const scene = scenes[section.dataset.station as keyof typeof scenes];
    const cleanup = scene?.(section, { desktop: !!desktop, root });
    reveals(section);
    stationTracker(root, section, i);
    if (cleanup) extraCleanups.push(cleanup);
  });

  arrival(root);

  return () => {
    extraCleanups.splice(0).forEach((c) => c());
    units.forEach((u) => u.classList.remove("is-arrived"));
  };
}
const extraCleanups: Array<() => void> = [];

/** Scroll-scrubbed coupling: the coach drops in from above, the hook extends, then it snaps on. */
function coachAttach(root: HTMLElement, section: HTMLElement, i: number) {
  const unit = $$("[data-coach]", root)[i];
  const coupler = unit.querySelector(".coupler");
  const dir = i % 2 ? 1 : -1;

  gsap
    .timeline({
      scrollTrigger: { trigger: section, start: "top 95%", end: "top 42%", scrub: 0.6, invalidateOnRefresh: true },
    })
    .fromTo(unit, { y: () => detachedY(unit), x: 14 * dir, rotation: 8 * dir }, { y: -20, x: 0, rotation: 0, ease: "power2.out", duration: 0.8 })
    .fromTo(coupler, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 0.1 })
    .to(unit, { y: 0, ease: "power2.in", duration: 0.1 });

  ScrollTrigger.create({
    trigger: section,
    start: "top 42%",
    onEnter: () => couple(root, i, true),
    onLeaveBack: () => couple(root, i, false),
  });
}

function stationTracker(root: HTMLElement, section: HTMLElement, i: number) {
  ScrollTrigger.create({
    trigger: section,
    start: "top 55%",
    end: "bottom 55%",
    onToggle: (self) => self.isActive && setActive(root, i),
  });
}

/** Generic heading splits + fade-ups. Fully reversible on the way back up. */
function reveals(section: HTMLElement) {
  $$("[data-split]", section).forEach((el) => {
    const split = SplitText.create(el, { type: "words,chars", mask: "words" });
    gsap.from(split.chars, {
      yPercent: 115,
      duration: 1.1,
      stagger: 0.018,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none reverse" },
    });
  });
  $$("[data-reveal]", section).forEach((el) => {
    gsap.from(el, {
      y: 44,
      autoAlpha: 0,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
    });
  });
}

const GAUGE_RATIOS = [0.72, 0.86, 0.5, 0.94];
function gaugeTo(g: HTMLElement, i: number, p: number, instant = false) {
  const fill = g.querySelector("[data-gauge-fill]")!;
  const needle = g.querySelector("[data-gauge-needle]")!;
  const num = g.querySelector<HTMLElement>("[data-count]")!;
  const arc = parseFloat(fill.getAttribute("stroke-dasharray") || "0");
  const ratio = GAUGE_RATIOS[i % GAUGE_RATIOS.length] * p;
  const target = Number(num.dataset.count) * p;
  const opts = { duration: instant ? 0 : 1.6, ease: "expo.out" };
  gsap.to(fill, { strokeDashoffset: arc * (1 - ratio), ...opts });
  gsap.to(needle, { rotation: -135 + 270 * ratio, svgOrigin: "70 70", ...opts, ease: instant ? "none" : "elastic.out(1, 0.5)" });
  const o = { v: Number(num.textContent) || 0 };
  gsap.to(o, { v: target, ...opts, onUpdate: () => (num.textContent = String(Math.round(o.v))) });
}

type SceneCtx = { desktop: boolean; root: HTMLElement };
const scenes: Record<string, (s: HTMLElement, c: SceneCtx) => void | (() => void)> = {
  /* 01 — Hero: name splits apart, skyline sinks, boarding pass tips away */
  departure(s) {
    const st = { trigger: s, start: "top top", end: "bottom top", scrub: true };
    const lines = $$("[data-hero-line]", s);
    gsap.to(lines[0], { xPercent: -14, ease: "none", scrollTrigger: st });
    gsap.to(lines[1], { xPercent: 16, ease: "none", scrollTrigger: st });
    gsap.to("[data-hero-name]", { autoAlpha: 0.12, ease: "none", scrollTrigger: st });
    gsap.to("[data-hero-pass]", { y: -140, rotationX: 28, autoAlpha: 0.15, ease: "none", scrollTrigger: st });
    $$(".skyline-layer", s).forEach((l, d) =>
      gsap.to(l, { yPercent: 12 + d * 14, ease: "none", scrollTrigger: st }),
    );
    gsap.to(".hero-cue", { autoAlpha: 0, ease: "none", scrollTrigger: { trigger: s, start: "top top", end: "+=220", scrub: true } });
    gsap.to("[data-fog]", { yPercent: -30, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true } });
  },

  /* 02 — About: statement lights word by word, gauges spin up */
  about(s) {
    const statement = $("[data-statement]", s)!;
    const split = SplitText.create(statement, { type: "words" });
    gsap.fromTo(
      split.words,
      { opacity: 0.13 },
      { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: statement, start: "top 82%", end: "bottom 48%", scrub: true } },
    );
    $$("[data-gauge]", s).forEach((g, i) => {
      gaugeTo(g, i, 0, true);
      ScrollTrigger.create({
        trigger: g,
        start: "top 88%",
        onEnter: () => gaugeTo(g, i, 1),
        onLeaveBack: () => gaugeTo(g, i, 0),
      });
    });
  },

  /* 03 — Skills: departure board rows flap into place */
  skills(s) {
    $$("[data-board-row]", s).forEach((row) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%", toggleActions: "play none none reverse" } });
      tl.from(row, { rotationX: -92, transformOrigin: "50% 0%", autoAlpha: 0, duration: 0.9, ease: "back.out(1.5)" });
      $$("[data-flap]", row).forEach((f, k) => {
        const text = f.textContent ?? "";
        tl.to(f, { duration: 0.9, scrambleText: { text, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", revealDelay: 0.25, speed: 0.9 } }, 0.08 + k * 0.05);
      });
    });
  },

  /* 04 — Projects: the window-seat reel */
  projects(s, { desktop }) {
    const panels = $$("[data-panel]", s);
    if (!desktop) {
      panels.forEach((p) => {
        gsap.from(p, { y: 80, autoAlpha: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 88%", toggleActions: "play none none reverse" } });
        const pv = p.querySelector("[data-panel-preview]");
        gsap.fromTo(
          pv,
          { clipPath: "inset(14% 10% 14% 10% round 18px)" },
          { clipPath: "inset(0% 0% 0% 0% round 18px)", ease: "none", scrollTrigger: { trigger: p, start: "top 90%", end: "top 40%", scrub: true } },
        );
      });
      return;
    }

    const stage = $("[data-reel-stage]", s)!;
    const win = $("[data-window]", s)!;
    const reel = $("[data-reel]", s)!;
    const bar = $("[data-reel-bar]", s)!;
    const idx = $("[data-reel-index]", s)!;
    const dist = () => Math.max(0, reel.scrollWidth - win.clientWidth);
    let lastN = 0;

    const tween = gsap.to(reel, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: () => `+=${dist()}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          bar.style.transform = `scaleX(${self.progress})`;
          const n = Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1)));
          if (n !== lastN) {
            lastN = n;
            gsap.to(idx, { duration: 0.5, scrambleText: { text: pad(n + 1), chars: "0123456789" } });
          }
        },
      },
    });

    gsap.to("[data-scenery]", {
      x: () => -dist() * 0.35,
      ease: "none",
      scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${dist()}`, scrub: 0.8, invalidateOnRefresh: true },
    });
    gsap.fromTo(
      "[data-glass]",
      { backgroundPosition: "120% 0%" },
      { backgroundPosition: "-20% 0%", ease: "none", scrollTrigger: { trigger: stage, start: "top top", end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true } },
    );

    panels.forEach((p, i) => {
      const pv = p.querySelector("[data-panel-preview]");
      gsap.fromTo(
        pv,
        { xPercent: 16, rotationY: -16 },
        {
          xPercent: -10,
          rotationY: 10,
          ease: "none",
          scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        },
      );
      if (i === 0) return;
      const txt = p.querySelector("[data-panel-text]")!;
      gsap.from(txt.children, {
        x: 90,
        autoAlpha: 0,
        stagger: 0.05,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: p, containerAnimation: tween, start: "left 70%", toggleActions: "play none none reverse" },
      });
    });
  },

  /* 05 — Experience: the route line draws itself, stops light up as it passes */
  experience(s, { desktop }) {
    const route = $("[data-route]", s)!;
    const svg = $<SVGSVGElement>("[data-route-svg]", s)!;
    const path = $<SVGPathElement>("[data-route-path]", s)!;
    const ghost = $<SVGPathElement>("[data-route-ghost]", s)!;
    const head = $("[data-route-head]", s)!;
    const stops = $$("[data-stop]", s);
    const nodes = $$("[data-node]", s);
    let nodeY: number[] = [];

    const build = () => {
      const W = route.clientWidth;
      const H = route.clientHeight;
      const r = route.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      svg.setAttribute("width", String(W));
      svg.setAttribute("height", String(H));
      const pts = nodes.map((n) => {
        const b = n.getBoundingClientRect();
        return [b.left - r.left + b.width / 2, b.top - r.top + b.height / 2];
      });
      nodeY = pts.map((p) => p[1]);
      let d = `M ${pts[0][0]} 0 L ${pts[0][0]} ${pts[0][1]}`;
      for (let k = 1; k < pts.length; k++) {
        const [x0, y0] = pts[k - 1];
        const [x1, y1] = pts[k];
        const a = desktop ? (k % 2 ? 90 : -90) : 0;
        const dy = y1 - y0;
        d += ` C ${x0 + a} ${y0 + dy * 0.35}, ${x1 + a} ${y1 - dy * 0.35}, ${x1} ${y1}`;
      }
      d += ` L ${pts[pts.length - 1][0]} ${H}`;
      path.setAttribute("d", d);
      ghost.setAttribute("d", d);
    };
    build();
    ScrollTrigger.addEventListener("refreshInit", build);

    gsap.fromTo(
      path,
      { drawSVG: "0%" },
      {
        drawSVG: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: route,
          start: "top 62%",
          end: "bottom 62%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const L = path.getTotalLength();
            const p = path.getPointAtLength(L * self.progress);
            head.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
            stops.forEach((st, k) => st.classList.toggle("is-passed", p.y >= nodeY[k] - 2));
          },
        },
      },
    );

    stops.forEach((st, k) => {
      gsap.from(st.querySelector(".stop-card"), {
        x: desktop ? (k % 2 ? 70 : -70) : 36,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: st, start: "top 82%", toggleActions: "play none none reverse" },
      });
    });

    return () => ScrollTrigger.removeEventListener("refreshInit", build);
  },

  /* 06 — Playground: the title letters stand up, tiles tilt in */
  playground(s) {
    gsap.from($$("[data-k]", s), {
      yPercent: 100,
      autoAlpha: 0,
      stagger: 0.04,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: s, start: "top 75%", toggleActions: "play none none reverse" },
    });
    gsap.from($$("[data-lab-tile]", s), {
      y: 110,
      rotationX: 24,
      autoAlpha: 0,
      stagger: 0.12,
      duration: 1.2,
      ease: "expo.out",
      transformPerspective: 900,
      scrollTrigger: { trigger: $(".lab-grid", s), start: "top 88%", toggleActions: "play none none reverse" },
    });
  },

  /* 07 — Contact: the train brakes as the terminus approaches */
  contact(s, { root }) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: s, start: "top 45%", end: "bottom bottom", scrub: true } });
    tl.to($("[data-headlight]", root), { opacity: 0.45, ease: "none" }).fromTo(
      $$(".buffer-lamp", root),
      { opacity: 0.15 },
      { opacity: 1, ease: "none" },
      0,
    );
  },
};

/* =====================================================================
 * 6. Arrival — the train reaches the buffers at the very end of the page
 * ===================================================================== */
function arrival(root: HTMLElement) {
  const body = $("[data-train-body]", root);
  const units = $$("[data-coach]", root);
  const puffs = $$(".puff", root);
  const stamp = $("[data-stamp]", root);
  const buffer = $("[data-buffer]", root);
  gsap.set(stamp, { opacity: 0 });

  const arrive = () => {
    gsap.timeline()
      .to(body, { y: 12, duration: 0.16, ease: "power2.out" })
      .to(body, { y: 0, duration: 1.3, ease: "elastic.out(1, 0.32)" });
    units.forEach((u) => u.classList.add("is-arrived"));
    buffer?.classList.add("is-hit");
    gsap.fromTo(
      puffs,
      { opacity: 0.75, scale: 0.3, x: 0, y: 0 },
      {
        opacity: 0,
        scale: () => gsap.utils.random(1.8, 3.2),
        x: () => gsap.utils.random(-70, 70),
        y: () => gsap.utils.random(-160, -50),
        duration: () => gsap.utils.random(1.3, 2.2),
        stagger: 0.05,
        ease: "power2.out",
      },
    );
    gsap.fromTo(stamp, { scale: 2.6, rotation: -32, opacity: 0 }, { scale: 1, rotation: -12, opacity: 1, duration: 0.6, delay: 0.35, ease: "back.out(2.4)" });
  };
  const depart = () => {
    units.forEach((u) => u.classList.remove("is-arrived"));
    buffer?.classList.remove("is-hit");
    gsap.to(stamp, { opacity: 0, scale: 1.3, duration: 0.3 });
  };

  ScrollTrigger.create({
    start: () => ScrollTrigger.maxScroll(window) - 8,
    end: () => ScrollTrigger.maxScroll(window) + 10,
    onEnter: arrive,
    onLeaveBack: depart,
  });
}
