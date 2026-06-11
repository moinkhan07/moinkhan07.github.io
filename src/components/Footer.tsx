export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-8">
      <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/45">
        <p>
          © {new Date().getFullYear()} Moin Khan. Designed & built{" "}
          <span className="text-amber-400">with</span>{" "}
          <span className="text-amber-400">♥</span>{" "}
          <span className="text-amber-400">in Mumbai</span>.
        </p>
        <p className="font-mono text-xs">
          <span className="text-emerald-400">●</span> All systems shipping.
        </p>
      </div>
    </footer>
  );
}
