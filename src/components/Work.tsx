import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { projects, type Project } from "../data/portfolio";
import { GithubIcon } from "./BrandIcons";

const categories = ["All", "Flagship", "Mobile", "Web", "Clone"] as const;
type Category = (typeof categories)[number];

export default function Work() {
  const [cat, setCat] = useState<Category>("All");
  const filtered = cat === "All" ? projects : projects.filter((p) => p.category === cat);

  return (
    <section id="work" className="relative py-28 md:py-36">
      <div className="absolute inset-0 -z-10 bg-grid opacity-60" />
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader
          eyebrow="Selected Work"
          title={
            <>
              Things I've <span className="text-gradient">designed & shipped</span>.
            </>
          }
          description="From flagship products with thousands of users to ambitious side experiments — here's a curated set of projects I'm proud of."
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`relative rounded-full px-4 py-2 text-sm transition ${
                cat === c
                  ? "text-black"
                  : "text-white/60 hover:text-white border border-white/10"
              }`}
            >
              {cat === c && (
                <motion.span
                  layoutId="catpill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-rose-500"
                  transition={{ type: "spring", damping: 22, stiffness: 220 }}
                />
              )}
              <span className="relative font-medium">{c}</span>
            </button>
          ))}
        </div>

        {/* Featured (first 3) */}
        <div className="grid lg:grid-cols-2 gap-5">
          {filtered.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} featured={i < 2 && cat === "All"} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  featured,
}: {
  project: Project;
  index: number;
  featured?: boolean;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06 }}
      className={`group relative overflow-hidden rounded-3xl p-7 md:p-8 glass card-tilt ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      {/* Accent glow */}
      <div
        className={`absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition duration-700 bg-gradient-to-br ${project.accent}`}
      />
      <div className="absolute inset-0 bg-dotted opacity-20" />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              {project.category}
              {project.period && <span className="text-white/30">• {project.period}</span>}
            </div>
            <h3 className="mt-3 font-display font-bold text-2xl md:text-3xl tracking-tight">
              {project.title}
            </h3>
            <p className={`mt-1 text-sm md:text-base font-medium bg-gradient-to-r ${project.accent} bg-clip-text text-transparent`}>
              {project.tagline}
            </p>
          </div>
          <a
            href={project.links[0]?.url}
            target="_blank"
            rel="noreferrer"
            aria-label="Open project"
            className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/70 group-hover:text-white group-hover:bg-white/10 group-hover:rotate-45 transition-all"
          >
            <ArrowUpRight size={18} />
          </a>
        </div>

        <p className="mt-5 text-sm md:text-[15px] text-white/60 leading-relaxed max-w-2xl">
          {project.description}
        </p>

        {featured && (
          <ul className="mt-5 grid sm:grid-cols-2 gap-2">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2 text-sm text-white/65 rounded-xl p-3 bg-white/[0.03] border border-white/5"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {h}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full px-3 py-1 text-xs font-medium text-white/70 bg-white/[0.04] border border-white/10"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 pt-5 border-t border-white/5">
          {project.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition ${
                l.primary
                  ? `bg-gradient-to-r ${project.accent} text-black hover:scale-[1.02]`
                  : "border border-white/10 bg-white/[0.03] hover:bg-white/10 text-white/80"
              }`}
            >
              {l.label.toLowerCase().includes("code") || l.label.toLowerCase().includes("github") ? (
                <GithubIcon size={14} />
              ) : (
                <ExternalLink size={14} />
              )}
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
