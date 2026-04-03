"use client";

import { motion } from "framer-motion";

import { ChatAnimation } from "@/components/landing/chat-animation";

export function HeroSection() {

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden bg-background px-5 pt-16 sm:px-6">
      {/* Animated gradient orbs */}
      <div className="landing-orb landing-orb-1 absolute -left-32 top-1/4 h-[500px] w-[500px] bg-purple-400/[0.07] sm:h-[600px] sm:w-[600px]" />
      <div className="landing-orb landing-orb-2 absolute -right-32 bottom-1/4 h-[400px] w-[400px] bg-violet-300/[0.06] sm:h-[500px] sm:w-[500px]" />
      <div className="landing-orb landing-orb-1 absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 bg-purple-500/[0.04]" />

      {/* Dot grid texture — above orbs so it's not washed out */}
      <div className="landing-dot-grid-light pointer-events-none absolute inset-0 z-[1]" />


      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06, ease: [0.21, 0.68, 0.35, 1] }}
              className="landing-heading mx-auto max-w-2xl text-6xl font-normal leading-[1.05] tracking-[-0.04em] text-foreground sm:text-7xl lg:mx-0 lg:text-8xl"
            >
              <span className="whitespace-nowrap">Reach consumers</span> in seconds.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground lg:mx-0 lg:text-lg"
            >
          List your business, get discovered by AI. Serve customers. Serve more.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <a
                href="#how-it-works"
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-foreground px-7 text-sm font-semibold text-background transition-all hover:shadow-lg hover:shadow-purple-500/10"
              >
                <span className="relative z-10">List your business</span>
              </a>
              <a
                href="#developers"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border px-7 text-sm font-semibold text-foreground transition-all hover:border-purple-400 hover:bg-purple-500/10 hover:text-purple-400"
              >
                Build with Patch API
              </a>
            </motion.div>
          </div>

          {/* Right: App demo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <ChatAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
