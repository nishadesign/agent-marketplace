"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, Star, Clock } from "lucide-react";

const BULLETS = [
  "Get discovered by AI-powered products",
  "Surface your availability and pricing",
  "Receive qualified bookings",
  "Reach new customers without extra acquisition work",
  "Plug into the next generation of demand",
];

const PROVIDER_CARDS = [
  {
    initials: "M",
    name: "Mike's Plumbing Co",
    service: "Plumbing",
    rating: 4.8,
    reviews: 156,
    price: "From $89",
    availability: "Available tomorrow",
    color: "bg-purple-500/20 text-purple-400",
  },
  {
    initials: "S",
    name: "Sparkle Home",
    service: "House Cleaning",
    rating: 4.7,
    reviews: 203,
    price: "From $120",
    availability: "Available today",
    color: "bg-sky-500/20 text-sky-400",
  },
  {
    initials: "B",
    name: "Bay Area Electric",
    service: "Electrical",
    rating: 4.9,
    reviews: 89,
    price: "From $95",
    availability: "Next: Friday 9am",
    color: "bg-amber-500/20 text-amber-400",
  },
];


interface ProviderCardData {
  initials: string;
  name: string;
  service: string;
  rating: number;
  reviews: number;
  price: string;
  availability: string;
  color: string;
}

function ProviderCard({
  provider,
  index,
}: {
  provider: ProviderCardData;
  index: number;
}) {
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={cardInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        delay: index * 1.2,
        duration: 0.6,
        type: "spring",
        stiffness: 120,
        damping: 14,
      }}
      className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${provider.color}`}
        >
          <span className="text-xs font-bold">{provider.initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-semibold text-white">
              {provider.name}
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-white/70">
                {provider.rating}
              </span>
              <span className="text-[10px] text-white/30">
                ({provider.reviews})
              </span>
            </div>
          </div>
          <p className="text-xs text-white/35">{provider.service}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
        <span className="text-sm font-semibold text-purple-400">
          {provider.price}
        </span>
        <div className="flex items-center gap-1 text-[11px] text-white/40">
          <Clock size={10} />
          <span>{provider.availability}</span>
        </div>
      </div>
    </motion.div>
  );
}


export function ProvidersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="providers"
      className="relative overflow-hidden px-5 py-16 sm:px-8 md:py-20"
      ref={ref}
    >
      <div className="landing-dot-grid-light pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-purple-500/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-violet-500/[0.04] blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="landing-heading text-center text-4xl font-normal tracking-[-0.04em] text-white sm:text-5xl md:text-6xl"
        >
          For service providers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mx-auto mt-4 max-w-lg text-center text-base leading-relaxed text-white/50 md:text-lg"
        >
          List your business where AI agents can discover, compare, and book
          your services automatically.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-8 text-center"
        >
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-400 transition-colors hover:text-purple-300"
          >
            List your business
            <ArrowRight size={14} />
          </a>
        </motion.div>

        {/* Visual showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] md:mt-16"
        >
          <div className="grid md:grid-cols-2">
            {/* Left: Provider cards */}
            <div className="flex flex-col gap-3 p-5 sm:p-6">
              {PROVIDER_CARDS.map((provider, i) => (
                <ProviderCard
                  key={provider.name}
                  provider={provider}
                  index={i}
                />
              ))}
            </div>

            {/* Right: Bullet list */}
            <div className="flex flex-col justify-center gap-5 border-t border-white/[0.06] p-5 sm:p-6 md:border-l md:border-t-0">
              {BULLETS.map((bullet, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/15">
                    <Check
                      size={12}
                      className="text-purple-400"
                      strokeWidth={2.5}
                    />
                  </span>
                  <span className="text-sm leading-relaxed text-white/60 md:text-base">
                    {bullet}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
