import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 28, stiffness: 350, mass: 0.4 });
  const sy = useSpring(y, { damping: 28, stiffness: 350, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setVisible(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      setHovering(
        !!t?.closest('a, button, [role="button"], input, textarea, .cursor-target')
      );
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!visible) return null;

  return (
    <>
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      >
        <motion.div
          animate={{
            scale: hovering ? 2.4 : 1,
            backgroundColor: hovering ? "rgba(255, 166, 64, 0.18)" : "rgba(255,255,255,0)",
            borderColor: hovering ? "rgba(255, 166, 64, 0.7)" : "rgba(255,255,255,0.45)",
          }}
          transition={{ type: "spring", damping: 22, stiffness: 250 }}
          className="h-8 w-8 rounded-full border backdrop-blur-sm"
        />
      </motion.div>
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      >
        <div className="h-1 w-1 rounded-full bg-amber-400" />
      </motion.div>
    </>
  );
}
