"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Star, CheckCircle2, Send } from "lucide-react";

import { PatchLogo } from "@/components/patch-logo";

const STEP_TIMINGS = [600, 1800, 3600, 4800];
const CYCLE_DURATION = 7800;

function stepAnim(visible: boolean) {
  return {
    animate: {
      opacity: visible ? 1 : 0,
      y: visible ? 0 : 6,
    },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  };
}

export function ChatAnimation() {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const clearAllTimeouts = () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };

    const runCycle = () => {
      clearAllTimeouts();
      setVisibleSteps(0);

      STEP_TIMINGS.forEach((delay, i) => {
        const t = setTimeout(() => setVisibleSteps(i + 1), delay);
        timeoutsRef.current.push(t);
      });

      const resetT = setTimeout(runCycle, CYCLE_DURATION);
      timeoutsRef.current.push(resetT);
    };

    runCycle();
    return clearAllTimeouts;
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      {/* Background glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-[280px] w-[280px] rounded-full bg-purple-500/[0.15] blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-[280px] w-[280px] rounded-full bg-lime-400/[0.12] blur-[80px]" />

      {/* Rotating border wrapper — 2px gap reveals the spinning gradient */}
      <div className="relative rounded-2xl p-[2px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div
            className="landing-border-travel absolute inset-[-80%]"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, transparent 30%, rgba(168,85,247,0.7) 38%, rgba(132,204,22,0.6) 50%, rgba(168,85,247,0.7) 62%, transparent 70%, transparent 100%)",
            }}
          />
          <div className="absolute inset-[2px] rounded-[14px] bg-background" />
        </div>

      <div className="relative overflow-hidden rounded-[14px] bg-background">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="relative">
            <PatchLogo size={28} variant="dark" className="text-foreground" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-[1.5px] border-background bg-emerald-500" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-foreground">
              Patch Agent
            </p>
            <p className="text-[10px] text-emerald-600">Online</p>
          </div>
        </div>

        {/* Chat area — fixed height */}
        <div className="flex h-[460px] flex-col gap-4 p-5">
          {/* Step 1: User Request */}
          <motion.div
            {...stepAnim(visibleSteps >= 1)}
            className="flex flex-col items-end gap-0.5"
          >
            <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
              User Request
            </span>
            <div className="rounded-2xl rounded-tr-sm bg-foreground px-3.5 py-2.5 text-[13px] leading-relaxed text-background">
              Book a plumber for tomorrow morning
            </div>
          </motion.div>

          {/* Step 2: Agent Action */}
          <motion.div
            {...stepAnim(visibleSteps >= 2)}
            className="flex flex-col gap-0.5"
          >
            <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
              Agent Action
            </span>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-border bg-accent/50 px-3.5 py-2.5">
              <Search size={13} className="shrink-0 text-purple-500" />
              <span className="text-[13px] text-foreground">
                {visibleSteps >= 3
                  ? "Searched 10 providers"
                  : "Searching providers…"}
              </span>
              {visibleSteps >= 2 && visibleSteps < 3 && (
                <span className="relative ml-auto flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-purple-500" />
                </span>
              )}
              {visibleSteps >= 3 && (
                <CheckCircle2
                  size={13}
                  className="ml-auto shrink-0 text-emerald-500"
                />
              )}
            </div>
          </motion.div>

          {/* Step 3: Marketplace Result */}
          <motion.div
            {...stepAnim(visibleSteps >= 3)}
            className="flex flex-col gap-0.5"
          >
            <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
              Marketplace Result
            </span>
            <div className="overflow-hidden rounded-2xl rounded-tl-sm border border-border">
              <div className="bg-accent/40 px-3.5 py-2">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span className="text-[13px] font-medium text-foreground">
                    Found the best match
                  </span>
                </div>
              </div>
              <div className="bg-background px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20">
                    <span className="text-[10px] font-bold text-purple-400">
                      M
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-foreground">
                      Mike&apos;s Plumbing
                    </p>
                    <div className="flex items-center gap-1">
                      <Star
                        size={10}
                        className="shrink-0 fill-yellow-400 text-yellow-400"
                      />
                      <span className="text-[10px] text-muted-foreground">
                        4.8 · 9 AM · From $89
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 4: Booking Status */}
          <motion.div
            animate={{
              opacity: visibleSteps >= 4 ? 1 : 0,
              scale: visibleSteps >= 4 ? 1 : 0.92,
            }}
            transition={{
              duration: 0.35,
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
            className="flex flex-col items-center gap-0.5 pt-0.5"
          >
            <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/60">
              Booking Status
            </span>
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              <span className="text-[13px] font-semibold text-emerald-400">
                Confirmed
              </span>
            </div>
          </motion.div>
        </div>

        {/* Input bar */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-accent/30 px-3.5 py-2.5">
            <span className="flex-1 text-[13px] text-muted-foreground/50">
              Ask Patch anything…
            </span>
            <Send size={14} className="shrink-0 text-muted-foreground/30" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
