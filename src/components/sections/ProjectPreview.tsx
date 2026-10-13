"use client";

import { useEffect, useRef } from "react";
import type { PreviewKind } from "@/data/portfolio";

/**
 * Live, code-built product previews (no screenshots → crisp at any size,
 * zero image weight). Ambient loops only run while the preview is on screen.
 */
export default function ProjectPreview({ kind, title }: { kind: PreviewKind; title: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-live", e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`pv pv--${kind}`} role="img" aria-label={`Animated interface preview of ${title}`}>
      {kind === "erp" && <Erp />}
      {kind === "spaces" && <Spaces />}
      {kind === "commerce" && <Commerce />}
      {kind === "crm" && <Crm />}
      {kind === "services" && <Services />}
    </div>
  );
}

function Browser({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="pv-browser">
      <div className="pv-bar">
        <i />
        <i />
        <i />
        <span className="pv-url">{url}</span>
      </div>
      <div className="pv-body">{children}</div>
    </div>
  );
}

function Erp() {
  return (
    <Browser url="app.studyified.com/dashboard">
      <div className="erp">
        <aside className="erp-side">
          <b>S</b>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className={i === 1 ? "is-on" : ""} />
          ))}
        </aside>
        <div className="erp-main">
          <p className="erp-hello">
            Good morning, <b>Class 8-B</b>
          </p>
          <div className="erp-kpis">
            <div className="erp-kpi">
              <svg viewBox="0 0 36 36" className="erp-ring">
                <circle cx="18" cy="18" r="15" />
                <circle cx="18" cy="18" r="15" className="erp-ring-fill" />
              </svg>
              <div>
                <small>Attendance</small>
                <b>96%</b>
              </div>
            </div>
            <div className="erp-kpi">
              <div>
                <small>Fees collected</small>
                <b>₹4.2L</b>
              </div>
            </div>
            <div className="erp-kpi">
              <div>
                <small>Assignments</small>
                <b>18</b>
              </div>
            </div>
          </div>
          <div className="erp-chart">
            {[62, 80, 54, 92, 70, 86, 76].map((h, i) => (
              <span key={i} style={{ "--h": `${h}%`, "--d": `${i * 0.12}s` } as React.CSSProperties} />
            ))}
          </div>
          <ul className="erp-list">
            <li>
              <i style={{ background: "#5ab4ff" }} />
              Maths unit test · 10:30
            </li>
            <li>
              <i style={{ background: "#4fd1a5" }} />
              Parent–teacher meet · 15:00
            </li>
            <li className="erp-ping">
              <i style={{ background: "#ffb23f" }} />
              New message from Ms. Shah
            </li>
          </ul>
        </div>
      </div>
    </Browser>
  );
}

function Spaces() {
  const spaces = [
    ["Ellora House", "BKC", "₹9,500"],
    ["Mill No. 4", "Lower Parel", "₹8,200"],
    ["Kanjur Works", "Powai", "₹6,900"],
  ];
  return (
    <Browser url="searchspaces.in/mumbai/coworking">
      <div className="sp">
        <div className="sp-list">
          <div className="sp-chips">
            <span className="is-on">Coworking</span>
            <span>Managed</span>
            <span>Meeting rooms</span>
          </div>
          {spaces.map(([n, a, p], i) => (
            <div key={n} className="sp-card" style={{ "--d": `${i * 0.15}s` } as React.CSSProperties}>
              <span className="sp-img" />
              <div>
                <b>{n}</b>
                <small>{a}, Mumbai</small>
              </div>
              <em>
                {p}
                <small>/seat</small>
              </em>
            </div>
          ))}
        </div>
        <div className="sp-map">
          <svg viewBox="0 0 200 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path d="M-10 60 C40 80 70 40 120 70 S190 120 220 100" className="sp-road" />
            <path d="M60 -10 C70 60 50 120 90 230" className="sp-road" />
            <path d="M-10 170 C50 150 120 190 220 160" className="sp-water" />
          </svg>
          {[
            [28, 34],
            [62, 48],
            [44, 70],
            [74, 24],
          ].map(([x, y], i) => (
            <span key={i} className={`sp-pin ${i === 1 ? "is-on" : ""}`} style={{ left: `${x}%`, top: `${y}%`, "--d": `${i * 0.4}s` } as React.CSSProperties} />
          ))}
          <div className="sp-pop">
            <b>Mill No. 4</b>
            <small>32 desks · open now</small>
          </div>
        </div>
      </div>
    </Browser>
  );
}

function Commerce() {
  return (
    <div className="cm">
      <Browser url="lekhalooms.com/collections/handloom">
        <div className="cm-web">
          <div className="cm-nav">
            <b>LEKHALOOMS</b>
            <span>Sarees</span>
            <span>Dupattas</span>
            <span>Fabrics</span>
            <i className="cm-bag" data-count="2" />
          </div>
          <div className="cm-hero">
            <small>New on the loom</small>
            <b>The Monsoon Edit</b>
          </div>
          <div className="cm-grid">
            {["a", "b", "c", "d"].map((k, i) => (
              <div key={k} className={`cm-prod cm-prod--${k}`}>
                <span />
                <small>₹{["2,490", "3,890", "1,650", "4,200"][i]}</small>
              </div>
            ))}
          </div>
        </div>
      </Browser>
      <div className="pv-phone cm-phone">
        <div className="pv-notch" />
        <span className="cm-prod cm-prod--b cm-phone-img">
          <span />
        </span>
        <b>Ikat Silk Saree</b>
        <small>₹3,890 · Free shipping</small>
        <span className="cm-add">Add to bag</span>
      </div>
    </div>
  );
}

function Crm() {
  const cols = [
    { t: "Leads", c: ["Arora Interiors", "Blue Finch Co."] },
    { t: "Proposal", c: ["Kanak Foods"] },
    { t: "Won", c: ["Nova Clinics", "Pillai & Sons"] },
  ];
  return (
    <Browser url="crm.webtrixz.com/pipeline">
      <div className="crm">
        <div className="crm-top">
          <span className="crm-search">Search clients…</span>
          <span className="crm-btn">⇪ Import .xlsx</span>
        </div>
        <div className="crm-board">
          {cols.map((col) => (
            <div key={col.t} className="crm-col">
              <p>
                {col.t} <small>{col.c.length}</small>
              </p>
              {col.c.map((c) => (
                <div key={c} className="crm-card">
                  <b>{c}</b>
                  <span className="crm-kyc">KYC ✓</span>
                </div>
              ))}
            </div>
          ))}
          <div className="crm-card crm-card--moving">
            <b>Sahyadri Labs</b>
            <span className="crm-kyc">KYC ✓</span>
          </div>
        </div>
      </div>
    </Browser>
  );
}

function Services() {
  const steps = ["Booked", "Docs verified", "Submitted", "Ready"];
  return (
    <div className="svc">
      <div className="pv-phone svc-phone">
        <div className="pv-notch" />
        <p className="svc-brand">
          ontime<i>.</i>
        </p>
        <span className="svc-search">Search a service…</span>
        <div className="svc-tiles">
          {["Certificates", "Licences", "Tax filing", "Property"].map((t, i) => (
            <span key={t} style={{ "--d": `${i * 0.1}s` } as React.CSSProperties}>
              <i />
              {t}
            </span>
          ))}
        </div>
        <div className="svc-track">
          <small>Application #OT-2291</small>
          <ol>
            {steps.map((s, i) => (
              <li key={s} style={{ "--d": `${i * 0.9}s` } as React.CSSProperties}>
                {s}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="svc-slot">
        <small>Next available slot</small>
        <b>Tomorrow · 11:30</b>
        <span>Agent verified ✓</span>
      </div>
    </div>
  );
}
