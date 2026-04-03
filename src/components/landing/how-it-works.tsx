"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";


export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-stone-50 px-5 py-20 sm:px-6 md:py-32"
      ref={ref}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.04)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(234,179,8,0.03)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Intent
            </span>

            <div className="relative flex flex-1 items-center">
              <div className="h-px w-full bg-stone-200" />
              <motion.div
                className="absolute left-0 top-0 h-px origin-left bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ width: "100%" }}
              />
              <motion.div
                className="absolute right-0 h-2 w-2 rounded-full bg-gradient-to-br from-violet-600 to-purple-500"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 1.2 }}
              />
            </div>

            <span className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Booked
            </span>
          </div>

          <motion.p
            className="landing-gradient-text mt-2 text-lg font-semibold sm:text-xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 1.3 }}
          >
            in seconds
          </motion.p>

          <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
            From a user&apos;s request to a confirmed booking — Patch
            handles everything in between.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
