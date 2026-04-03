"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Code2, Store } from "lucide-react";

export function CtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative bg-background px-5 py-20 sm:px-6 md:py-40" ref={ref}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Ready to connect?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground md:text-lg">
            Whether you run a service business or build AI agents, Patch is
            where both sides meet.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-2">
          {/* Providers card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.21, 0.68, 0.35, 1],
            }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-accent/30 p-6 sm:p-8 md:p-10"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/50 blur-[80px] transition-all duration-700 group-hover:bg-accent" />

            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background sm:mb-6 sm:h-14 sm:w-14">
                <Store size={22} strokeWidth={1.5} className="text-muted-foreground" />
              </div>

              <h3 className="text-lg font-bold text-foreground sm:text-xl md:text-2xl">
                For service providers
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                List your business on Patch and get discovered by AI agents
                searching for services like yours. Set your own availability,
                pricing, and service area.
              </p>

              <ul className="mt-6 space-y-2.5">
                {[
                  "Free to list — no monthly fees",
                  "Set your own rates and availability",
                  "Accept or decline every booking",
                  "Get paid on job completion",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1 w-1 rounded-full bg-foreground/30" />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:mt-8 sm:h-12 sm:px-8">
                List your business
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          {/* Developers card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: [0.21, 0.68, 0.35, 1],
            }}
            className="group relative overflow-hidden rounded-3xl border border-border bg-accent/30 p-6 sm:p-8 md:p-10"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/50 blur-[80px] transition-all duration-700 group-hover:bg-accent" />

            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background sm:mb-6 sm:h-14 sm:w-14">
                <Code2 size={22} strokeWidth={1.5} className="text-muted-foreground" />
              </div>

              <h3 className="text-lg font-bold text-foreground sm:text-xl md:text-2xl">
                For developers & agent builders
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Connect your agent to Patch&apos;s API and give your users
                access to real-world service providers. Search, book, and track
                — all programmatically.
              </p>

              <ul className="mt-6 space-y-2.5">
                {[
                  "RESTful API with typed responses",
                  "Real-time availability and pricing",
                  "Booking, rescheduling, cancellation",
                  "Webhooks for status updates",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1 w-1 rounded-full bg-foreground/30" />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:mt-8 sm:h-12 sm:px-8">
                Get API access
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
