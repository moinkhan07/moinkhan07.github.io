const items = [
  "React", "Next.js", "React Native", "Node.js", "Express", "Spring Boot",
  "Java", "TypeScript", "MySQL", "MongoDB", "AWS", "OpenAI", "Tailwind", "Git",
];

export default function Marquee() {
  const row = [...items, ...items];
  return (
    <section
      aria-hidden
      className="relative py-10 border-y border-white/5 bg-white/[0.015] overflow-hidden"
    >
      <div className="flex marquee-track gap-12 whitespace-nowrap">
        {row.map((it, i) => (
          <div key={i} className="flex items-center gap-12 text-white/40">
            <span className="font-display font-semibold text-2xl md:text-3xl tracking-tight">
              {it}
            </span>
            <span className="text-amber-400 text-xl">✦</span>
          </div>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#07070b] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#07070b] to-transparent" />
    </section>
  );
}
