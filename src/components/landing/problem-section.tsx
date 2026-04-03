"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { X, Check } from "lucide-react";

import { cn } from "@/lib/utils";

const OLD_WAY_LINES = [
  "browser.goto('thumbtack.com/plumbing')",
  "await page.waitForSelector('.results')",
  "// scrape HTML, parse inconsistent data",
  "const providers = extractFromDOM(html)",
  "// no availability data, no pricing",
  "// captcha blocked after 3 requests",
  "throw new Error('rate limited')",
];

const NEW_WAY_LINES = [
  'const results = await patch.search({',
  '  category: "plumbing",',
  '  location: "San Francisco",',
  '  budget: { max: 200 },',
  "});",
  "",
  "// 5 providers, structured, instant",
];

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative bg-background px-5 py-20 sm:px-6 md:py-40" ref={ref}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Built for agents,
            <br />
            <span className="text-muted-foreground/60">not browsers.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
            Other marketplaces were designed for humans clicking through a website.
            Agents deserve structured data, not scraped HTML.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:mt-24 md:grid-cols-2 md:gap-8">
          {/* Old way — dark code block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground p-5 sm:p-6 md:p-8"
          >
            <div className="mb-4 flex items-center gap-2 sm:mb-6">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/15">
                <X size={14} className="text-red-400" />
              </div>
              <span className="text-xs font-medium text-white/50 sm:text-sm">
                How agents use other marketplaces
              </span>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <div className="space-y-0 font-mono text-[11px] leading-6 sm:text-[13px] sm:leading-7">
                {OLD_WAY_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className={cn(
                      "whitespace-nowrap",
                      line.startsWith("//") || line.startsWith("throw")
                        ? "text-red-400/70"
                        : "text-white/35"
                    )}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          </motion.div>

          {/* New way — dark code block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground p-5 sm:p-6 md:p-8"
          >
            <div className="mb-4 flex items-center gap-2 sm:mb-6">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15">
                <Check size={14} className="text-emerald-400" />
              </div>
              <span className="text-xs font-medium text-white/60 sm:text-sm">
                How agents use Patch
              </span>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <div className="space-y-0 font-mono text-[11px] leading-6 sm:text-[13px] sm:leading-7">
                {NEW_WAY_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className={cn(
                      "whitespace-nowrap",
                      line.startsWith("//")
                        ? "text-emerald-400/70"
                        : line === ""
                          ? "h-6 sm:h-7"
                          : "text-white/70"
                    )}
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
