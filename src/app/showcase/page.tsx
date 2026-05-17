"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { HeroSection } from "@/components/landing/hero-section";
import { ProvidersSection } from "@/components/landing/providers-section";
import { DevelopersSection } from "@/components/landing/developers-section";

const STEPS = [
  { key: "hero", Component: HeroSection, holdMs: 8500 },
  { key: "providers", Component: ProvidersSection, holdMs: 7500 },
  { key: "developers", Component: DevelopersSection, holdMs: 7500 },
] as const;

export default function ShowcasePage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % STEPS.length);
    }, STEPS[index].holdMs);
    return () => clearTimeout(t);
  }, [index]);

  const { key, Component } = STEPS[index];

  return (
    <div className="relative flex h-dvh items-center justify-center overflow-hidden bg-white p-6 sm:p-10 md:p-14">
      <div className="dark relative flex h-full w-full max-w-7xl items-stretch [&_section>div]:!bg-background [&_section>div]:!max-w-none [&_section]:!h-full [&_section]:!w-full [&_section]:!px-0 [&_section]:!pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: [0.21, 0.68, 0.35, 1] }}
            className="flex w-full"
          >
            <Component />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
