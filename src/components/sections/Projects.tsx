import { alsoShipped, projects } from "@/data/portfolio";
import { SectionHead, StationMarker } from "../ui/SectionHead";
import { ArrowIcon, ExternalIcon } from "../ui/Icons";
import ProjectPreview from "./ProjectPreview";

/**
 * Desktop: the stage pins and the projects slide past a train window
 * horizontally while the page (and the train) keeps travelling.
 * Mobile/tablet: the same panels stack vertically, each in its own frame.
 */
export default function Projects() {
  return (
    <section id="projects" data-station="projects" className="station-section projects">
      <StationMarker id="projects" />

      <div className="reel-stage" data-reel-stage>
        <div className="wrap reel-head">
          <SectionHead
            id="projects"
            title={
              <>
                Views from the <em>window seat</em>
              </>
            }
          />
          <div className="reel-meta" aria-hidden="true">
            <span className="reel-count">
              <b data-reel-index>01</b> / {String(projects.length).padStart(2, "0")}
            </span>
            <span className="reel-bar">
              <i data-reel-bar />
            </span>
            <span className="reel-hint">Keep scrolling — the view moves</span>
          </div>
        </div>

        <div className="window" data-window>
          <div className="window-scenery" data-scenery aria-hidden="true">
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i} className="pole" style={{ left: `${i * 140}px`, "--h": `${40 + ((i * 37) % 50)}%` } as React.CSSProperties} />
            ))}
          </div>

          <div className="reel" data-reel>
            {projects.map((p, i) => (
              <article
                key={p.slug}
                className="panel"
                data-panel
                aria-labelledby={`p-${p.slug}`}
                style={{ "--c": p.color } as React.CSSProperties}
              >
                <div className="panel-text" data-panel-text>
                  <p className="panel-no">
                    <span>04.{i + 1}</span> {p.kind}
                  </p>
                  <h3 id={`p-${p.slug}`} className="panel-title">
                    {p.title}
                  </h3>
                  <p className="panel-tag">{p.tagline}</p>
                  <p className="panel-desc">{p.description}</p>
                  <ul className="panel-hl">
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <ul className="panel-stack" aria-label="Tech stack">
                    {p.stack.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div className="panel-links">
                    {p.links.length ? (
                      p.links.map((l) => (
                        <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn btn--line" data-cursor="Open">
                          <span>{l.label}</span>
                          <ExternalIcon />
                        </a>
                      ))
                    ) : (
                      <span className="panel-private">Client build · walkthrough on request</span>
                    )}
                  </div>
                </div>
                <div className="panel-preview" data-panel-preview data-cursor="View">
                  <ProjectPreview kind={p.preview} title={p.title} />
                </div>
              </article>
            ))}
          </div>

          <div className="window-glass" data-glass aria-hidden="true" />
        </div>
      </div>

      <div className="wrap shipped">
        <p className="shipped-k" data-reveal>
          Also shipped along the line
        </p>
        <ul className="shipped-list">
          {alsoShipped.map((s, i) => (
            <li key={s.title} data-reveal style={{ "--i": i } as React.CSSProperties}>
              <a href={s.url} target="_blank" rel="noreferrer" className="ticket" data-cursor="Visit">
                <span className="ticket-no">#{String(i + 1).padStart(2, "0")}</span>
                <span className="ticket-title">{s.title}</span>
                <span className="ticket-note">{s.note}</span>
                <ArrowIcon className="ticket-arrow -rotate-45" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
