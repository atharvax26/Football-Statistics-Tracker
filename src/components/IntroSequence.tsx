import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import heroBlue from "@/assets/hero-blue.jpg";
import heroRed from "@/assets/hero-red.jpg";
import heroYellow from "@/assets/hero-yellow.jpg";

const EASE = [0.22, 1, 0.36, 1] as const;
const TITLE = "CHAURANGE FC";

export function IntroSequence({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 700);
    }, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  const skip = () => {
    setVisible(false);
    setTimeout(onDone, 400);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background overflow-hidden flex items-center justify-center cursor-pointer"
          onClick={skip}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* vignette pulse */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "var(--gradient-glow)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.5] }}
            transition={{ duration: 1.6, times: [0, 0.4, 1], ease: EASE }}
          />

          {/* parallax player collage */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[
              { src: heroBlue, x: "-58%", delay: 0.5 },
              { src: heroRed, x: "0%", delay: 0.35 },
              { src: heroYellow, x: "58%", delay: 0.5 },
            ].map((p, i) => (
              <motion.img
                key={i}
                src={p.src}
                alt=""
                aria-hidden
                className="absolute h-[88vh] object-contain opacity-0"
                style={{ filter: "grayscale(0.3) brightness(0.55)" }}
                initial={{ x: p.x === "0%" ? 0 : p.x, y: 80, opacity: 0, scale: 1.05 }}
                animate={{
                  x: p.x,
                  y: 0,
                  opacity: i === 1 ? 0.55 : 0.35,
                  scale: 1,
                }}
                transition={{ duration: 1.4, ease: EASE, delay: p.delay }}
              />
            ))}
          </div>

          {/* dark gradient over images */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/80 pointer-events-none" />

          {/* sweeping amber line */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--color-primary), transparent)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1.6, times: [0, 0.5, 1], ease: EASE, delay: 0.2 }}
          />

          {/* title */}
          <div className="relative z-10 text-center px-6">
            <div className="overflow-hidden">
              <motion.div
                className="font-display text-[clamp(3.5rem,12vw,9rem)] leading-[0.9] tracking-[0.08em] text-foreground flex justify-center"
                aria-label={TITLE}
              >
                {TITLE.split("").map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "110%", opacity: 0, filter: "blur(8px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.9,
                      ease: EASE,
                      delay: 0.55 + i * 0.045,
                    }}
                    className="inline-block"
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                ))}
              </motion.div>
            </div>
            <motion.div
              className="mt-6 flex items-center justify-center gap-4 text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
            >
              <span className="h-px w-10 bg-border" />
              <span className="text-xs uppercase tracking-[0.4em]">
                Est. 2026 · Private League
              </span>
              <span className="h-px w-10 bg-border" />
            </motion.div>
            <motion.div
              className="mt-12 text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 0.6 }}
            >
              tap anywhere to enter
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
