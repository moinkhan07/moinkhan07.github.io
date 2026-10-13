"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { startJourney } from "@/lib/journey";
import Atmosphere from "./Atmosphere";
import Cursor from "./Cursor";
import Hud from "./Hud";
import Loader from "./Loader";
import Train from "./train/Train";
import Track from "./train/Track";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Playground from "./sections/Playground";
import Contact from "./sections/Contact";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * The whole site is one journey. Every scroll-linked animation is created
 * centrally in lib/journey.ts (in page order, inside one gsap.matchMedia),
 * so pins, coach couplings and reveals never fight each other.
 */
export default function Journey() {
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    if (!root.current) return;
    return startJourney(root.current);
  }, []);

  return (
    <div ref={root} className="journey">
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <Loader />
      <Atmosphere />
      <Hud />
      <Train />
      <main className="journey-main">
        <Track />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Playground />
        <Contact />
      </main>
      <Cursor />
    </div>
  );
}
