import { stations, type StationId } from "@/data/portfolio";

/** Trackside signal + platform sign. Signal turns green when this section's coach couples. */
export function StationMarker({ id }: { id: StationId }) {
  const s = stations.find((x) => x.id === id)!;
  return (
    <div className="station-marker" aria-hidden="true" style={{ "--line": s.color } as React.CSSProperties}>
      <span className="signal" data-signal>
        <i className="signal-lamp signal-lamp--red" />
        <i className="signal-lamp signal-lamp--green" />
      </span>
      <span className="station-sign">
        STN {s.no} · {s.name}
      </span>
    </div>
  );
}

/** Eyebrow + split-text title used by every coach. */
export function SectionHead({
  id,
  title,
  kicker,
  className = "",
}: {
  id: StationId;
  title: React.ReactNode;
  kicker?: React.ReactNode;
  className?: string;
}) {
  const s = stations.find((x) => x.id === id)!;
  return (
    <header className={`sec-head ${className}`} style={{ "--line": s.color } as React.CSSProperties}>
      <p className="eyebrow" data-reveal>
        <span className="eyebrow-dot" />
        Coach {s.no} <span className="eyebrow-sep">/</span> {s.name}
      </p>
      <h2 className="sec-title" data-split>
        {title}
      </h2>
      {kicker ? (
        <p className="sec-kicker" data-reveal>
          {kicker}
        </p>
      ) : null}
    </header>
  );
}
