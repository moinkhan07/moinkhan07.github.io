import { journey } from "@/data/portfolio";
import { SectionHead, StationMarker } from "../ui/SectionHead";

/** Career as a route map: a line draws itself between stops as you scroll (built in journey.ts). */
export default function Experience() {
  return (
    <section id="experience" data-station="experience" className="station-section">
      <StationMarker id="experience" />
      <div className="wrap">
        <SectionHead
          id="experience"
          title={
            <>
              The route <em>so far</em>
            </>
          }
          kicker="From first commit to production teams — every stop added another coach of experience."
        />

        <div className="route" data-route>
          <svg className="route-svg" data-route-svg aria-hidden="true">
            <path className="route-path route-path--ghost" data-route-ghost />
            <path className="route-path" data-route-path />
          </svg>
          <span className="route-head" data-route-head aria-hidden="true" />

          <ol className="route-stops">
            {journey.map((j, i) => (
              <li key={j.org} className={`stop stop--${i % 2 ? "r" : "l"} stop--${j.kind}`} data-stop>
                <span className="stop-node" data-node aria-hidden="true" />
                <article className="stop-card">
                  <p className="stop-time">
                    <span>{j.kind === "origin" ? "Origin" : j.kind === "now" ? "Current stop" : `Stop ${String(i).padStart(2, "0")}`}</span>
                    <time>{j.period}</time>
                  </p>
                  <h3 className="stop-title">{j.title}</h3>
                  <p className="stop-org">
                    {j.org} <span>· {j.place}</span>
                  </p>
                  <ul className="stop-points">
                    {j.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                  <ul className="stop-tech" aria-label="Technologies">
                    {j.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
