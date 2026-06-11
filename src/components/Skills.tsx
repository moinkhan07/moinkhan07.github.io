import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { skills } from "../data/portfolio";

export default function Skills() {
  return (
    <section id="skills" className="relative py-28 md:py-36">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 h-96 w-96 aurora opacity-40" />
      </div>
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader
          eyebrow="Tech Stack"
          title={
            <>
              The <span className="text-gradient">tools</span> behind the work.
            </>
          }
          description="A pragmatic stack — chosen for shipping speed, scale and developer joy."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(skills).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl glass p-6"
            >
              <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gradient-to-br from-amber-400/20 to-rose-500/10 blur-2xl opacity-50 group-hover:opacity-100 transition" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-lg">{category}</h3>
                  <span className="text-xs font-mono text-white/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {items.map((s, j) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * j, duration: 0.35 }}
                      className="rounded-xl px-3 py-1.5 text-sm bg-white/[0.04] border border-white/10 text-white/80 hover:border-amber-400/40 hover:text-white transition-colors"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
