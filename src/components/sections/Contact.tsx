"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/data/portfolio";
import { travelTo } from "@/lib/scroll";
import Magnetic from "../ui/Magnetic";
import { SectionHead, StationMarker } from "../ui/SectionHead";
import { ArrowIcon, GithubIcon, LinkedinIcon, MailIcon, PhoneIcon, WhatsappIcon } from "../ui/Icons";

function useMumbaiTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: profile.timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return { h: get("hour") % 24, m: get("minute"), s: get("second") };
}

function StationClock() {
  const t = useMumbaiTime();
  const h = t ? ((t.h % 12) + t.m / 60) * 30 : 0;
  const m = t ? (t.m + t.s / 60) * 6 : 0;
  const s = t ? t.s * 6 : 0;
  return (
    <div className="clock">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="56" className="clock-face" />
        {Array.from({ length: 60 }).map((_, i) => (
          <line
            key={i}
            x1="60"
            y1="8"
            x2="60"
            y2={i % 5 === 0 ? 16 : 11}
            className={i % 5 === 0 ? "clock-tick clock-tick--h" : "clock-tick"}
            transform={`rotate(${i * 6} 60 60)`}
          />
        ))}
        <line x1="60" y1="60" x2="60" y2="32" className="clock-h" transform={`rotate(${h} 60 60)`} />
        <line x1="60" y1="60" x2="60" y2="18" className="clock-m" transform={`rotate(${m} 60 60)`} />
        <g transform={`rotate(${s} 60 60)`} className="clock-s">
          <line x1="60" y1="70" x2="60" y2="22" />
          <circle cx="60" cy="22" r="4" />
        </g>
        <circle cx="60" cy="60" r="3" fill="#ede6d6" />
      </svg>
      <p className="clock-cap">
        Mumbai <b>{t ? `${String(t.h).padStart(2, "0")}:${String(t.m).padStart(2, "0")}` : "--:--"}</b> IST
      </p>
    </div>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const links = [
    { label: "Email", href: `mailto:${profile.email}`, icon: <MailIcon /> },
    { label: "Call", href: profile.phoneHref, icon: <PhoneIcon /> },
    { label: "WhatsApp", href: profile.whatsapp, icon: <WhatsappIcon /> },
    { label: "GitHub", href: profile.github, icon: <GithubIcon /> },
    { label: "LinkedIn", href: profile.linkedin, icon: <LinkedinIcon /> },
  ];

  return (
    <section id="contact" data-station="contact" className="station-section terminus" data-terminus>
      <StationMarker id="contact" />
      <div className="wrap">
        <SectionHead
          id="contact"
          className="terminus-head"
          title={
            <>
              Let’s build <em>what’s next</em>
            </>
          }
          kicker="This is the final station — but the start of the next journey. Open to full-time roles, freelance builds and interesting problems."
        />

        <div className="terminus-grid">
          <div className="terminus-main">
            <div className="mail-wrap" data-reveal>
              <button type="button" className="mail-big" onClick={copy} data-cursor="Copy" aria-label={`Copy email address ${profile.email}`}>
                <span className="mail-text">{profile.email}</span>
                <span className="mail-line" />
              </button>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    className="toast"
                    role="status"
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  >
                    Copied — see you on the platform ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <ul className="contact-links">
              {links.map((l) => (
                <li key={l.label} data-reveal>
                  <Magnetic strength={0.3}>
                    <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="pill" data-cursor={l.label}>
                      {l.icon}
                      <span>{l.label}</span>
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
            <p className="contact-meta" data-reveal>
              {profile.phone} <span>·</span> {profile.location}
            </p>
          </div>

          <aside className="arrival" data-reveal>
            <StationClock />
            <div className="stub">
              <p className="stub-row">
                <span>Service</span>
                <b>MK-07</b>
              </p>
              <p className="stub-row">
                <span>Route</span>
                <b>Idea → Production</b>
              </p>
              <p className="stub-row">
                <span>Coaches</span>
                <b>07 / 07 coupled</b>
              </p>
              <span className="stamp" data-stamp>
                Arrived
                <small>on time</small>
              </span>
            </div>
          </aside>
        </div>
      </div>

      <footer className="foot wrap">
        <p>
          © {new Date().getFullYear()} {profile.name}. End of the line — thanks for riding.
        </p>
        <button type="button" className="foot-top" data-cursor="Reverse" onClick={() => travelTo(0)}>
          Back to departure
          <ArrowIcon className="-rotate-90" />
        </button>
      </footer>
    </section>
  );
}
