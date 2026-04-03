"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
  isInView,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  isInView: boolean;
  delay?: number;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      animate(count, value, { duration: 1.5, ease: "easeOut" });
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, value, count, delay]);

  return (
    <span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const STATS = [
  { value: 20, suffix: "K+", prefix: "", label: "Providers" },
  { value: 100, suffix: "K", prefix: "", label: "Services booked" },
  { value: 0, suffix: "", prefix: "$", label: "Extra cost" },
];

export function ImpactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden bg-background px-5 py-20 sm:px-6 md:py-28" ref={ref}>
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-3 sm:gap-8 md:gap-12">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <p className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  isInView={isInView}
                  delay={0.1 + i * 0.15}
                />
              </p>

              <p className="mt-3 text-sm font-semibold text-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
