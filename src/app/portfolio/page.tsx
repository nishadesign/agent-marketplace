"use client";

import { useEffect, useState } from "react";

// iPhone 15 Pro: 393pt × 852pt screen, 55pt screen radius
const PHONE_WIDTH = 393;
const PHONE_HEIGHT = 852;
const BEZEL = 8;
const SCREEN_RADIUS = 55;

const PHONE_FONT =
  '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

function SignalIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden>
      <rect x="0" y="8" width="3" height="4" rx="0.5" />
      <rect x="5" y="5.5" width="3" height="6.5" rx="0.5" />
      <rect x="10" y="3" width="3" height="9" rx="0.5" />
      <rect x="15" y="0" width="3" height="12" rx="0.5" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden>
      <path d="M8.5 2.2c2.8 0 5.4 1.05 7.4 2.95.32.31.32.81.01 1.13l-.85.86c-.3.3-.78.31-1.09.02-1.46-1.39-3.4-2.16-5.47-2.16s-4.01.77-5.47 2.16c-.31.29-.79.28-1.09-.02l-.85-.86c-.31-.32-.31-.82.01-1.13C3.1 3.25 5.7 2.2 8.5 2.2zm0 3.4c1.84 0 3.55.7 4.85 1.95.32.31.33.82.02 1.14l-.85.86c-.3.3-.78.31-1.09.03-.79-.73-1.84-1.18-2.93-1.18s-2.14.45-2.93 1.18c-.31.28-.79.27-1.09-.03l-.85-.86c-.31-.32-.3-.83.02-1.14C4.95 6.3 6.66 5.6 8.5 5.6zm0 3.4c.94 0 1.81.36 2.46 1 .32.32.31.84-.02 1.15l-1.78 1.69c-.36.34-.96.34-1.32 0l-1.78-1.69c-.33-.31-.34-.83-.02-1.15.65-.64 1.52-1 2.46-1z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="12"
        rx="3.2"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <rect x="2" y="2" width="19" height="9" rx="2" fill="currentColor" />
      <path
        d="M24 4.2v4.6c.7-.2 1.2-.85 1.2-1.62v-1.36c0-.77-.5-1.42-1.2-1.62z"
        fill="currentColor"
        fillOpacity="0.4"
      />
    </svg>
  );
}

export default function PortfolioPage() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function compute() {
      const padding = 56;
      const totalWidth = PHONE_WIDTH + BEZEL * 2;
      const totalHeight = PHONE_HEIGHT + BEZEL * 2;
      const maxWidth = window.innerWidth - padding * 2;
      const maxHeight = window.innerHeight - padding * 2;
      const next = Math.min(1, maxWidth / totalWidth, maxHeight / totalHeight);
      setScale(next);
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
      {/* Subtle horizon — grounds the phone without competing */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.025) 100%)",
        }}
      />

      {/* Phone */}
      <div
        className="relative"
        style={{
          width: PHONE_WIDTH + BEZEL * 2,
          height: PHONE_HEIGHT + BEZEL * 2,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Soft cast shadow */}
        <div
          aria-hidden
          className="absolute -inset-x-10 -bottom-12 top-12 rounded-[80px]"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 70%, rgba(0,0,0,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        {/* Tight contact shadow */}
        <div
          aria-hidden
          className="absolute inset-x-12 bottom-0 h-6 rounded-full"
          style={{
            background:
              "radial-gradient(50% 100% at 50% 50%, rgba(0,0,0,0.22) 0%, transparent 80%)",
            filter: "blur(8px)",
          }}
        />

        {/* Bezel */}
        <div
          className="relative h-full w-full overflow-hidden bg-black"
          style={{
            borderRadius: SCREEN_RADIUS + BEZEL,
            padding: BEZEL,
            boxShadow:
              "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 0 0 1px rgba(0,0,0,0.6), 0 24px 60px rgba(0,0,0,0.18), 0 6px 18px rgba(0,0,0,0.12)",
          }}
        >
          {/* Screen */}
          <div
            className="relative h-full w-full overflow-hidden bg-white"
            style={{ borderRadius: SCREEN_RADIUS }}
          >
            <iframe
              src="/"
              title="Patch app preview"
              className="block h-full w-full border-0"
              style={{ width: "100%", height: "100%" }}
            />

            {/* Status bar */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-[54px] items-center justify-between px-[28px] text-black"
              style={{ fontFamily: PHONE_FONT }}
            >
              <span className="text-[17px] font-semibold leading-none tracking-[-0.01em] tabular-nums">
                9:41
              </span>
              <div className="flex items-center gap-[6px]">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </div>
            </div>

            {/* Dynamic Island */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[11px] z-30 h-[37px] w-[125px] -translate-x-1/2 rounded-full bg-black"
            />

            {/* Home indicator */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-[8px] left-1/2 z-30 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
