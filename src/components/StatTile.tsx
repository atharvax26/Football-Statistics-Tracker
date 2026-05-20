import { animate, useMotionValue, useTransform, motion } from "framer-motion";
import { useEffect } from "react";

export function CountUp({
  value,
  decimals = 0,
  duration = 1.2,
}: {
  value: number;
  decimals?: number;
  duration?: number;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));

  useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [value, duration, mv]);

  return <motion.span>{rounded}</motion.span>;
}

export function StatTile({
  label,
  value,
  decimals = 0,
  accent,
}: {
  label: string;
  value: number;
  decimals?: number;
  accent?: boolean;
}) {
  return (
    <div className="bg-card border border-border p-5 relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-primary), transparent)",
          opacity: accent ? 1 : 0.25,
        }}
      />
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-3 text-stat text-5xl ${accent ? "text-primary" : "text-foreground"}`}
      >
        <CountUp value={value} decimals={decimals} />
      </div>
    </div>
  );
}
