"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const VALUE_TAGS = [
  { text: "Structured Service Metadata", className: "-top-5 left-[8%]" },
  { text: "Secure booking flow", className: "top-[35%] -right-2" },
  { text: "Sync in real-time", className: "-bottom-5 left-1/2 -translate-x-1/2" },
];

export function DevelopersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="developers"
      className="relative overflow-hidden px-5 py-16 sm:px-8 md:py-20"
      ref={ref}
    >
      <div className="landing-dot-grid-light absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-lime-500/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-green-400/[0.04] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="landing-heading whitespace-nowrap text-3xl font-normal tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            For developers and AI products
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/50 md:text-lg">
            Give your agents access to real-world services through a
            structured, bookable marketplace layer.
          </p>
          <a
            href="#"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-lime-400 transition-colors hover:text-lime-300"
          >
            Explore developer access
            <ArrowRight size={14} />
          </a>
        </motion.div>

        {/* Stacked code blocks + floating value tags */}
        <div className="relative mx-auto mt-16 md:mt-24">
          {/* Floating value tags — md+ */}
          {VALUE_TAGS.map((tag, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
              className={`absolute z-30 hidden items-center gap-2.5 rounded-full border border-lime-400/20 bg-white/[0.05] px-5 py-2.5 text-sm font-medium text-white/70 shadow-[0_0_12px_rgba(132,204,22,0.15),0_0_4px_rgba(132,204,22,0.1)] backdrop-blur-sm md:flex ${tag.className}`}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
              </span>
              {tag.text}
            </motion.div>
          ))}

          {/* Horizontally overlapping code cards */}
          <div className="relative mx-auto flex max-w-4xl items-center justify-center">
            {/* Left card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 0.8, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="z-0 -mr-[5%] w-[32%] min-w-0 scale-[0.88] origin-center"
            >
              <CodeCard
                filename="create-booking.ts"
                label="Book"
                lines={SNIPPET_BOOK}
              />
            </motion.div>

            {/* Center card — elevated */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="z-20 w-[48%] min-w-0"
            >
              <CodeCard
                filename="search-providers.ts"
                label="Search"
                lines={SNIPPET_SEARCH}
                glow
              />
            </motion.div>

            {/* Right card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 0.8, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="z-10 -ml-[5%] w-[32%] min-w-0 scale-[0.88] origin-center"
            >
              <CodeCard
                filename="get-estimate.ts"
                label="Pricing"
                lines={SNIPPET_PRICING}
              />
            </motion.div>
          </div>

          {/* Mobile: value tags as wrapped pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2.5 md:hidden">
            {VALUE_TAGS.map((tag, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-[13px] font-medium text-white/60"
              >
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime-400" />
                {tag.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Code card component ─── */

function CodeCard({
  filename,
  label,
  lines,
  glow,
}: {
  filename: string;
  label: string;
  lines: Array<{ text: string; color?: string }>;
  glow?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a] ${glow ? "landing-code-glow" : ""}`}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/40" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/40" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/40" />
          </div>
          <span className="ml-2 text-[10px] text-white/20">{filename}</span>
        </div>
        <span className="rounded-full bg-lime-500/15 px-2.5 py-0.5 text-[10px] font-medium text-lime-400">
          {label}
        </span>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-[11px] leading-5 sm:text-[12px] sm:leading-[22px]">
          {lines.map((line, i) => (
            <div key={i} className={line.color ?? "text-white/55"}>
              {line.text || "\u00A0"}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

/* ─── Code snippet data ─── */

const C = {
  kw: "text-lime-400/80",
  str: "text-lime-400/90",
  var: "text-white/70",
  dim: "text-white/55",
  cmt: "text-white/30",
  ok: "text-emerald-400/70",
};

const SNIPPET_SEARCH = [
  { text: "// Find providers by service + location", color: C.cmt },
  { text: "" },
  { text: 'const results = await patch.providers.search({', color: C.dim },
  { text: '  category: "plumbing",', color: C.dim },
  { text: '  location: "San Francisco",', color: C.dim },
  { text: '  available: "tomorrow morning"', color: C.dim },
  { text: "});", color: C.dim },
  { text: "" },
  { text: "// → 5 providers, sorted by relevance", color: C.cmt },
  { text: "// → avg rating: 4.7 ★ | avg distance: 2.1 mi", color: C.cmt },
];

const SNIPPET_PRICING = [
  { text: "// Get a structured price estimate", color: C.cmt },
  { text: "" },
  { text: 'const estimate = await patch.pricing.estimate({', color: C.dim },
  { text: '  provider: "prov_sf_mike",', color: C.dim },
  { text: '  service: "leak_repair",', color: C.dim },
  { text: '  urgency: "standard"', color: C.dim },
  { text: "});", color: C.dim },
  { text: "" },
  { text: '// → { callout: "$89", parts: "varies",', color: C.cmt },
  { text: '//     range: "$120–$200", currency: "USD" }', color: C.cmt },
];

const SNIPPET_BOOK = [
  { text: "// Book in one call — no redirects", color: C.cmt },
  { text: "" },
  { text: "const booking = await patch.bookings.create({", color: C.dim },
  { text: '  provider: "prov_sf_mike",', color: C.dim },
  { text: '  slot: "2026-04-04T09:00",', color: C.dim },
  { text: '  service: "leak_repair",', color: C.dim },
  { text: '  address: "742 Hayes St, SF"', color: C.dim },
  { text: "});", color: C.dim },
  { text: "" },
  { text: "// ✓ Confirmed — booking.id: bk_3f8a9c", color: C.ok },
];
