import { motion } from "framer-motion";
import { Code2, Smartphone, Server, Zap } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { stats } from "../data/portfolio";

const pillars = [
  {
    icon: Code2,
    title: "Web Engineering",
    text: "Next.js, React, Tailwind — production websites and dashboards.",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    text: "React Native apps published on Play Store & App Store.",
  },
  {
    icon: Server,
    title: "Backends & APIs",
    text: "Node.js, Express, Spring Boot with MySQL & MongoDB.",
  },
  {
    icon: Zap,
    title: "AI Integrations",
    text: "OpenAI-powered tools — resume scoring, automation, agents.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="absolute inset-0 -z-10 bg-dotted opacity-30" />
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="About"
              title={
                <>
                  Engineer who <span className="text-gradient">ships</span>,
                  <br />
                  not just codes.
                </>
              }
              description="I'm a full-stack developer based in Mumbai. I build clean, fast and reliable products across web and mobile — and obsess over UX details that make users actually love the thing they're using."
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="glass rounded-2xl p-4"
                >
                  <div className="font-display text-2xl md:text-3xl font-bold text-gradient">
                    {s.value}
                  </div>
                  <div className="text-xs md:text-sm text-white/55 mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 content-start">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                className="group relative overflow-hidden rounded-3xl p-6 glass card-tilt"
              >
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-amber-400/20 to-rose-500/10 blur-2xl opacity-60 group-hover:opacity-100 transition" />
                <div className="relative">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-rose-500/20 border border-white/10 text-amber-300">
                    <p.icon size={20} />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-white/55 leading-relaxed">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
