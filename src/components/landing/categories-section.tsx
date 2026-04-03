"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Wrench,
  Sparkles,
  Zap,
  Hammer,
  Tv,
  Paintbrush,
  Bug,
  Settings,
} from "lucide-react";

const CATEGORIES = [
  { name: "Plumbing", icon: Wrench },
  { name: "Cleaning", icon: Sparkles },
  { name: "Electrical", icon: Zap },
  { name: "Handyman", icon: Hammer },
  { name: "TV Mounting", icon: Tv },
  { name: "Painting", icon: Paintbrush },
  { name: "Pest Control", icon: Bug },
  { name: "Appliance Repair", icon: Settings },
];

export function CategoriesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative bg-background px-5 py-20 sm:px-6 md:py-40" ref={ref}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Every home service.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground md:text-lg">
            Starting with home services in San Francisco. Expanding to more
            cities and verticals soon.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 md:mt-20">
          {CATEGORIES.map((category, i) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  delay: 0.2 + i * 0.06,
                  duration: 0.4,
                  type: "spring",
                  damping: 20,
                }}
                className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-accent/30 p-4 transition-colors hover:border-foreground/15 hover:bg-accent sm:gap-3 sm:p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background transition-colors group-hover:bg-accent">
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className="text-muted-foreground transition-colors group-hover:text-foreground"
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {category.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
