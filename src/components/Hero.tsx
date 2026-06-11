import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowDown, MessageCircle, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import { profile } from "../data/portfolio";

const ROLES = [
  "Full-Stack Engineer",
  "React & Next.js Specialist",
  "React Native Developer",
  "Node.js & Java Backend",
];

export default function Hero() {
  // Mouse parallax for the avatar
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const rotateX = useTransform(sy, [-50, 50], [10, -10]);
  const rotateY = useTransform(sx, [-50, 50], [-10, 10]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      mx.set(((e.clientX - cx) / r.width) * 100);
      my.set(((e.clientY - cy) / r.height) * 100);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section
      id="home"
      className="relative min-h-[100svh] pt-28 pb-20 overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 bg-grid" />
      <div className="absolute -z-10 -top-32 -left-32 h-[520px] w-[520px] aurora opacity-70" />
      <div className="absolute -z-10 bottom-0 right-0 h-[560px] w-[560px] aurora opacity-60" />

      <div className="mx-auto max-w-6xl px-5 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left text */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-white/70 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for new opportunities
            <Sparkles size={12} className="text-amber-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="font-display font-bold tracking-tight text-5xl md:text-7xl lg:text-8xl leading-[0.95]"
          >
            Hey, I'm <span className="text-gradient">Moin</span>
            <br />
            <span className="text-white/90">I build</span>{" "}
            <span className="relative inline-block">
              <span className="text-gradient">apps & web</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M0 4 Q 50 0 100 4 T 200 4"
                  stroke="url(#g1)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, delay: 0.6 }}
                />
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#ffa640" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            that ship.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-7 max-w-xl text-base md:text-lg text-white/60 leading-relaxed"
          >
            {profile.bio}
          </motion.p>

          {/* Rotating roles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex items-center gap-2 text-sm text-white/50 font-mono"
          >
            <span className="text-amber-400">$</span>
            <span>focus =</span>
            <RotatingText />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#work"
              className="group relative inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-medium bg-gradient-to-br from-amber-400 to-rose-500 text-black overflow-hidden shine"
            >
              View my work
              <ArrowDown
                size={16}
                className="group-hover:translate-y-0.5 transition-transform"
              />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-medium border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
            >
              Contact me
            </a>

            <div className="flex items-center gap-2 ml-2">
              <SocialIcon href={profile.github} label="GitHub">
                <GithubIcon size={16} />
              </SocialIcon>
              <SocialIcon href={profile.linkedin} label="LinkedIn">
                <LinkedinIcon size={16} />
              </SocialIcon>
              <SocialIcon href={profile.whatsapp} label="WhatsApp">
                <MessageCircle size={16} />
              </SocialIcon>
            </div>
          </motion.div>
        </div>

        {/* Right visual */}
        <div className="lg:col-span-5 relative" ref={ref}>
          <motion.div
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="relative mx-auto aspect-square max-w-md"
          >
            {/* Blob */}
            <div className="absolute inset-0 blob bg-gradient-to-br from-amber-400/40 via-rose-500/40 to-violet-500/40 blur-2xl" />
            {/* Card */}
            <div className="relative h-full w-full rounded-[2.5rem] glass glow-ring p-6 overflow-hidden">
              <div className="absolute inset-0 bg-dotted opacity-40" />
              {/* Floating chips */}
              <FloatingChip className="top-4 left-4" delay={0}>
                ⚛️ React
              </FloatingChip>
              <FloatingChip className="top-8 right-4" delay={0.4}>
                📱 React Native
              </FloatingChip>
              <FloatingChip className="bottom-24 left-6" delay={0.8}>
                ▲ Next.js
              </FloatingChip>
              <FloatingChip className="bottom-10 right-8" delay={1.2}>
                🟢 Node.js
              </FloatingChip>
              <FloatingChip className="top-1/2 -left-4" delay={1.6}>
                ☕ Java
              </FloatingChip>
              <FloatingChip className="top-1/2 -right-4" delay={2}>
                🐬 MySQL
              </FloatingChip>

              {/* Center bust */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/50 to-rose-500/50 blur-2xl" />
                  <div className="relative h-44 w-44 rounded-full bg-gradient-to-br from-[#1a1a26] to-[#0d0d14] border border-white/10 flex items-center justify-center font-display text-6xl font-bold">
                    <span className="text-gradient">M</span>
                    <span className="text-white">K</span>
                  </div>
                </motion.div>
              </div>

              {/* Code line */}
              <div className="absolute bottom-4 left-4 right-4 font-mono text-[11px] text-white/40 glass rounded-xl px-3 py-2">
                <span className="text-emerald-400">const</span>{" "}
                <span className="text-amber-300">dev</span>{" "}
                <span className="text-white/60">=</span>{" "}
                <span className="text-rose-300">"shipping daily"</span>;
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs"
      >
        <span>scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="inline-block"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}

function FloatingChip({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 + delay }}
      className={`absolute z-10 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="glass rounded-full px-3 py-1.5 text-xs font-medium text-white/90 shadow-xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/10 hover:border-amber-400/50 transition-all"
    >
      {children}
    </a>
  );
}

function RotatingText() {
  return (
    <span className="relative inline-block h-5 overflow-hidden w-[260px]">
      <motion.span
        className="absolute inset-0 flex flex-col"
        animate={{ y: ROLES.map((_, i) => -i * 20).concat(0) }}
        transition={{
          duration: ROLES.length * 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [...ROLES.map((_, i) => i / ROLES.length), 1],
        }}
      >
        {ROLES.concat([ROLES[0]]).map((r, i) => (
          <span key={i} className="h-5 leading-5 text-white/80">
            "{r}"
          </span>
        ))}
      </motion.span>
    </span>
  );
}
