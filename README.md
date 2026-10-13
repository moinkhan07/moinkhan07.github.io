# Moin Khan — The Train Journey Portfolio

A scroll-driven portfolio where a train travels down the page. Each section couples a new coach onto the train, and the journey ends at a buffer stop.

**Stack:** Next.js 16 (App Router, static export), React 19, Tailwind CSS 4, GSAP 3.13+ (ScrollTrigger, SplitText, ScrambleText, DrawSVG — all free since 3.13), Lenis, Framer Motion. Three.js was left out on purpose: the train is SVG + transforms, which keeps it sharp, light and 60 fps on phones.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Deploy to moinkhan07.github.io

1. Replace the contents of the `moinkhan07.github.io` repo with this project and push to `main`.
2. In the repo, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and publishes `./out` on every push.

(The old `gh-pages`/`dist` setup is no longer needed.)

## Where things live

| What | File |
| --- | --- |
| **All content** (bio, skills, projects, career, contact) | `src/data/portfolio.ts` |
| Scroll choreography (one central timeline: intro, coupling, pins, arrival) | `src/lib/journey.ts` |
| Train artwork (engine, coaches, wheels) | `src/components/train/` |
| Sections (one per coach) | `src/components/sections/` |
| Live product previews (code-built, no screenshots) | `src/components/sections/ProjectPreview.tsx` |
| Playground experiments (canvas) | `src/components/playground/` |
| Design tokens, train geometry, all styles | `src/app/globals.css` |

## How the train works

- The train is `position: fixed`. The track runs the full height of the page and scrolls underneath it, so the train is always "moving".
- Coach 01 couples during the intro. Coaches 02–07 are scroll-scrubbed. Each one drops in from above, its coupler extends, then it snaps on with a jolt and a spark, its windows light up and the trackside signal turns green. Scrolling up reverses every step.
- A per-frame physics loop reads scroll velocity. It stretches and compresses the gaps between coaches (slack), sways the coaches, vibrates the engine, turns the wheel treads and drives the HUD speedometer.
- Click any coach to travel to its section.
- The track ends exactly at the engine's nose at max scroll. That is where the arrival sequence plays: brake shudder, steam, window chase and the ARRIVED stamp.

## Accessibility & performance

- `prefers-reduced-motion`: no smooth scroll, no scrubbing. The train arrives fully coupled and all content shows in its final state.
- Content is fully server-rendered, so it works without JS (the loader only shows when JS runs).
- Canvases and preview loops pause off-screen. DPR is capped at 2, and every animation uses transform/opacity only.
- Everything is created inside `gsap.context` / `gsap.matchMedia` and reverted on unmount or breakpoint change.

## Before you publish — check these

The descriptions and tech stacks for **SearchSpaces, LekhaLooms, Webtrixz CRM and Ontime** were written from project briefs. Review the wording in `src/data/portfolio.ts` and add live links (`links: []` currently shows "Client build · walkthrough on request").
