import { profile, stats } from "@/data/portfolio";
import { SectionHead, StationMarker } from "../ui/SectionHead";

const facts = [
  { k: "Based in", v: "Mumbai, India" },
  { k: "Currently", v: "Software Developer @ Webtrixz" },
  { k: "Builds", v: "Web platforms · Mobile apps · APIs" },
  { k: "Studied", v: "BCA — Chandigarh University" },
];

function Gauge({ value, suffix, label, i }: { value: number; suffix: string; label: string; i: number }) {
  // 270° speedometer arc. journey.ts animates the needle + arc when the coach couples.
  const r = 52;
  const c = 2 * Math.PI * r;
  const arc = c * 0.75;
  return (
    <div className="gauge" data-gauge style={{ "--i": i } as React.CSSProperties}>
      <svg viewBox="0 0 140 140" aria-hidden="true">
        <circle cx="70" cy="70" r={r} className="gauge-track" strokeDasharray={`${arc} ${c}`} transform="rotate(135 70 70)" />
        <circle
          cx="70"
          cy="70"
          r={r}
          className="gauge-fill"
          data-gauge-fill
          strokeDasharray={`${arc} ${c}`}
          transform="rotate(135 70 70)"
        />
        {Array.from({ length: 10 }).map((_, k) => (
          <line
            key={k}
            x1="70"
            y1="10"
            x2="70"
            y2={k % 3 === 0 ? 18 : 15}
            className="gauge-tick"
            transform={`rotate(${-135 + k * 30} 70 70)`}
          />
        ))}
        <g data-gauge-needle style={{ transformOrigin: "70px 70px" }}>
          <line x1="70" y1="70" x2="70" y2="30" className="gauge-needle" />
        </g>
        <circle cx="70" cy="70" r="4" className="gauge-hub" />
      </svg>
      <p className="gauge-value">
        <span data-count={value}>{value}</span>
        {suffix}
      </p>
      <p className="gauge-label">{label}</p>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" data-station="about" className="station-section">
      <StationMarker id="about" />
      <div className="wrap">
        <SectionHead
          id="about"
          title={
            <>
              The person <em>behind the controls</em>
            </>
          }
        />

        <p className="statement" data-statement>
          I’m Moin — a full-stack and React Native developer from Mumbai. {profile.bio} I care about the parts users never
          see: clean APIs, fast pages and apps that keep running on time.
        </p>

        <div className="about-grid">
          <dl className="dossier" data-reveal>
            <p className="dossier-head">
              <span>Driver’s log</span>
              <span>ID · MK-07</span>
            </p>
            {facts.map((f) => (
              <div key={f.k} className="dossier-row">
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
            <blockquote className="dossier-quote">
              “Good software should run like a good railway — on time, every time, and nobody notices the engineering.”
            </blockquote>
          </dl>

          <div className="gauges">
            {stats.map((s, i) => (
              <Gauge key={s.label} {...s} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
