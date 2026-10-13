/* Top-down train artwork. Pure SVG, no state — shared by the live train and decorative uses. */

export function EngineArt() {
  return (
    <svg viewBox="0 0 50 108" className="block h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="eng-body" x1="0" x2="1">
          <stop offset="0" stopColor="#14171c" />
          <stop offset=".5" stopColor="#2a2f37" />
          <stop offset="1" stopColor="#14171c" />
        </linearGradient>
        <linearGradient id="eng-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1a26" />
          <stop offset=".55" stopColor="#24435f" />
          <stop offset="1" stopColor="#ffcf7a" stopOpacity=".85" />
        </linearGradient>
        <radialGradient id="eng-lamp">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset=".45" stopColor="#ffe2a8" />
          <stop offset="1" stopColor="#ffb23f" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* body with tapered nose pointing down (direction of travel) */}
      <path
        d="M3 12 Q3 2 13 2 H37 Q47 2 47 12 V78 Q47 95 35 103 Q25 108 15 103 Q3 95 3 78 Z"
        fill="url(#eng-body)"
        stroke="rgba(237,230,214,.16)"
        strokeWidth=".8"
      />
      {/* brass trim */}
      <path d="M6 12 Q6 5 13 5 H37 Q44 5 44 12" fill="none" stroke="#c9a86a" strokeOpacity=".6" strokeWidth=".7" />
      {/* roof vents */}
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x="14" y={12 + i * 4.2} width="22" height="1.6" rx=".8" fill="#0b0d10" opacity=".9" />
      ))}
      {/* number plate */}
      <rect x="15" y="52" width="20" height="9" rx="2" fill="#0b0d10" stroke="#ffb23f" strokeOpacity=".7" strokeWidth=".6" />
      <text x="25" y="58.6" textAnchor="middle" fontSize="5.2" style={{ fontFamily: "var(--font-mono)" }} fill="#ffb23f" letterSpacing=".4">
        MK·07
      </text>
      {/* chevrons */}
      <path d="M8 68 L25 76 L42 68" fill="none" stroke="#ffb23f" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M8 73 L25 81 L42 73" fill="none" stroke="#ffb23f" strokeOpacity=".45" strokeWidth="1.4" strokeLinejoin="round" />
      {/* windscreen */}
      <path d="M8 84 Q25 79 42 84 Q40 95 25 98 Q10 95 8 84 Z" fill="url(#eng-glass)" stroke="rgba(255,255,255,.2)" strokeWidth=".5" />
      <path d="M13 86 Q20 84 25 84" stroke="rgba(255,255,255,.55)" strokeWidth=".6" fill="none" />
      {/* headlamps */}
      <circle cx="16.5" cy="101" r="5" fill="url(#eng-lamp)" className="eng-lamp" />
      <circle cx="33.5" cy="101" r="5" fill="url(#eng-lamp)" className="eng-lamp" />
      <circle cx="16.5" cy="101" r="1.5" fill="#fff" />
      <circle cx="33.5" cy="101" r="1.5" fill="#fff" />
    </svg>
  );
}

export function CoachArt({ no, color }: { no: string; color: string }) {
  return (
    <svg viewBox="0 0 50 72" className="block h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`coach-body-${no}`} x1="0" x2="1">
          <stop offset="0" stopColor="#15181d" />
          <stop offset=".5" stopColor="#262b33" />
          <stop offset="1" stopColor="#15181d" />
        </linearGradient>
      </defs>
      {/* gangway connectors */}
      <rect x="17" y="0" width="16" height="4" rx="1.5" fill="#0d0f13" stroke="rgba(255,255,255,.08)" strokeWidth=".5" />
      <rect x="17" y="68" width="16" height="4" rx="1.5" fill="#0d0f13" stroke="rgba(255,255,255,.08)" strokeWidth=".5" />
      {/* body */}
      <rect x="3" y="3" width="44" height="66" rx="7" fill={`url(#coach-body-${no})`} stroke="rgba(237,230,214,.14)" strokeWidth=".8" />
      {/* side window strips (lit when coupled — see .coach.is-coupled) */}
      <line className="coach-win" x1="6.6" y1="10" x2="6.6" y2="62" strokeWidth="2.6" strokeDasharray="5 2.6" stroke={color} />
      <line className="coach-win" x1="43.4" y1="10" x2="43.4" y2="62" strokeWidth="2.6" strokeDasharray="5 2.6" stroke={color} />
      {/* roof */}
      <rect x="12" y="8" width="26" height="56" rx="5" fill="#101317" />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x="14" y={11 + i * 6.6} width="22" height="1" fill="rgba(237,230,214,.06)" />
      ))}
      {/* line-colour band */}
      <rect x="12" y="29" width="26" height="14" rx="2" fill={color} className="coach-band" />
      <text
        x="25"
        y="39.6"
        textAnchor="middle"
        fontSize="8.4"
        fontWeight="700"
        style={{ fontFamily: "var(--font-mono)" }}
        fill="#0a0c0f"
      >
        {no}
      </text>
    </svg>
  );
}

/** Wheel sets peeking out under the body; their tread scrolls with --roll. */
export function Wheels({ engine = false }: { engine?: boolean }) {
  const rows = engine ? ["14%", "44%", "70%"] : ["12%", "70%"];
  return (
    <span className="wheels" aria-hidden="true">
      {rows.map((top) => (
        <span key={top} style={{ top }} className="wheel-row">
          <span className="wheel wheel--l" />
          <span className="wheel wheel--r" />
        </span>
      ))}
    </span>
  );
}
