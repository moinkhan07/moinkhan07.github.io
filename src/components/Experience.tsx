import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { certificates, education, experience } from "../data/portfolio";

export default function Experience() {
  return (
    <section id="experience" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader
          eyebrow="Journey"
          title={
            <>
              Experience, <span className="text-gradient">education</span> & wins.
            </>
          }
        />

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Experience timeline */}
          <div className="lg:col-span-7 glass rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 text-amber-300">
              <Briefcase size={16} />
              <span className="font-display font-semibold">Experience</span>
            </div>

            <ol className="relative border-l border-white/10 ml-2">
              {experience.map((e, i) => (
                <motion.li
                  key={e.role}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="ml-6 pb-8 last:pb-0"
                >
                  <span className="absolute -left-[7px] mt-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 ring-4 ring-[#07070b]" />
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="font-display font-semibold text-lg">{e.role}</h3>
                    <span className="text-amber-300 text-sm">@ {e.company}</span>
                  </div>
                  <div className="text-xs text-white/45 mt-1 font-mono">
                    {e.period} · {e.location}
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {e.points.map((p) => (
                      <li
                        key={p}
                        className="text-sm text-white/65 flex gap-2 leading-relaxed"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Education + Certs */}
          <div className="lg:col-span-5 grid gap-6">
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 text-amber-300">
                <GraduationCap size={16} />
                <span className="font-display font-semibold">Education</span>
              </div>
              <div className="space-y-5">
                {education.map((ed, i) => (
                  <motion.div
                    key={ed.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="border-l-2 border-white/10 pl-4 hover:border-amber-400/60 transition-colors"
                  >
                    <h4 className="font-medium text-white/90">{ed.title}</h4>
                    <p className="text-sm text-white/55">{ed.org}</p>
                    <p className="text-xs text-white/40 mt-0.5 font-mono">
                      {ed.period} · {ed.location}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5 text-amber-300">
                <Award size={16} />
                <span className="font-display font-semibold">Certificates</span>
              </div>
              <ul className="space-y-2">
                {certificates.map((c) => (
                  <li
                    key={c}
                    className="text-sm text-white/70 flex items-start gap-2"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                    {c}
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap gap-3">
                <div>
                  <div className="text-xs text-white/45">Languages</div>
                  <div className="text-sm text-white/80 mt-1">
                    English <span className="text-white/40">· Conversational</span>
                  </div>
                  <div className="text-sm text-white/80">
                    Hindi <span className="text-white/40">· Native</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
