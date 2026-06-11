import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { profile } from "../data/portfolio";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "./BrandIcons";

export default function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[700px] aurora opacity-60" />
      </div>

      <div className="mx-auto max-w-5xl px-5">
        <SectionHeader
          align="center"
          eyebrow="Get In Touch"
          title={
            <>
              Let's build <span className="text-gradient">something great</span>.
            </>
          }
          description="I'm currently open to full-time roles, contracts and freelance projects. Drop a message — I usually reply within a few hours."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[2.5rem] glass p-8 md:p-12 glow-ring"
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-400/30 to-rose-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-6">
            <ContactCard
              href={`mailto:${profile.email}`}
              icon={<Mail size={20} />}
              label="Email"
              value={profile.email}
              accent="from-amber-400 to-rose-500"
            />
            <ContactCard
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              icon={<Phone size={20} />}
              label="Phone"
              value={profile.phone}
              accent="from-emerald-400 to-teal-500"
            />
            <ContactCard
              href={profile.whatsapp}
              icon={<WhatsappIcon size={20} />}
              label="WhatsApp"
              value="Chat instantly"
              accent="from-lime-400 to-emerald-500"
            />
            <ContactCard
              href="#"
              icon={<MapPin size={20} />}
              label="Based in"
              value={profile.location}
              accent="from-violet-500 to-fuchsia-500"
              static
            />
          </div>

          <div className="relative mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="font-display text-xl font-semibold">{profile.name}</div>
              <div className="text-sm text-white/55">{profile.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <SocialButton href={profile.github} label="GitHub">
                <GithubIcon size={16} />
              </SocialButton>
              <SocialButton href={profile.linkedin} label="LinkedIn">
                <LinkedinIcon size={16} />
              </SocialButton>
              <SocialButton href={profile.whatsapp} label="WhatsApp">
                <WhatsappIcon size={16} />
              </SocialButton>
              <SocialButton href={`mailto:${profile.email}`} label="Email">
                <Mail size={16} />
              </SocialButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactCard({
  href,
  icon,
  label,
  value,
  accent,
  static: isStatic,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  static?: boolean;
}) {
  const Comp: any = isStatic ? "div" : "a";
  return (
    <Comp
      href={href}
      target={isStatic ? undefined : "_blank"}
      rel="noreferrer"
      className="group relative overflow-hidden rounded-2xl p-5 bg-white/[0.03] border border-white/10 hover:border-white/25 transition-all flex items-center gap-4"
    >
      <div
        className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-black shadow-lg`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-[0.16em] text-white/45">{label}</div>
        <div className="mt-1 font-medium text-white truncate">{value}</div>
      </div>
      {!isStatic && (
        <ArrowUpRight
          size={18}
          className="text-white/40 group-hover:text-white group-hover:rotate-45 transition-all"
        />
      )}
    </Comp>
  );
}

function SocialButton({
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 hover:text-black hover:bg-amber-400 hover:border-amber-400 transition-all"
    >
      {children}
    </a>
  );
}
