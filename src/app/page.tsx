"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

import { ProviderCard } from "@/components/home/provider-card";
import { ProviderDetailSheet } from "@/components/home/provider-detail-sheet";
import { useBookings } from "@/components/bookings-context";
import { getSearchResults } from "@/data/providers";
import type { Provider, AgentInterpretation } from "@/types";
import { cn } from "@/lib/utils";

type ViewState = "idle" | "loading" | "results";

const ROTATING_PROMPTS = [
  "Need a plumber tomorrow morning under $180",
  "Deep clean my 2BR apartment this weekend",
  "Mount a 65-inch TV, budget around $200",
  "Fix a leaking kitchen faucet ASAP",
  "Paint my living room, need a quote",
];

const SUGGESTION_PROMPTS = [
  "My kitchen sink is leaking, need help ASAP",
  "Need a deep clean for my 2BR apartment this weekend",
  "TV mounting for a 65-inch, budget around $200",
];

function getTomorrowLabel(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

const DEMO_INTERPRETATION: AgentInterpretation = {
  serviceType: "Plumbing — Leak repair",
  when: `Tomorrow morning (${getTomorrowLabel()})`,
  budget: "Under $200",
  location: "San Francisco (auto-detected)",
};

export default function HomePage() {
  const router = useRouter();
  const { addBooking } = useBookings();
  const [view, setView] = useState<ViewState>("idle");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [interpretation, setInterpretation] =
    useState<AgentInterpretation | null>(null);
  const [results, setResults] = useState<Provider[]>([]);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (view !== "idle") return;
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % ROTATING_PROMPTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [view]);

  const handleReset = useCallback(() => {
    setView("idle");
    setQuery("");
    setSubmittedQuery("");
    setInterpretation(null);
    setResults([]);
    setShowInterpretation(false);
    setSelectedProvider(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    setSubmittedQuery(query.trim());
    setQuery("");
    setView("loading");
    setShowInterpretation(false);

    setTimeout(() => {
      setInterpretation(DEMO_INTERPRETATION);
      setResults(getSearchResults());
      setView("results");
    }, 1500);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleEditQuery = useCallback(() => {
    setView("idle");
    setShowInterpretation(false);
  }, []);

  // ── Idle: chat-first home ──
  if (view === "idle") {
    return (
      <div className="flex flex-1 flex-col px-5 pb-20">
        <div className="flex flex-1 flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground">
              <Sparkles size={22} className="text-background" />
            </div>
            <h1 className="mt-4 text-xl font-semibold tracking-tight">
              What do you need help with?
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Patch finds and books trusted home services
            </p>
          </motion.div>

          <div className="mt-8 w-full">
            {/* Input with animated border */}
            <div className="group relative">
              <div className="pointer-events-none absolute -inset-[1.5px] rounded-[18px] opacity-60 blur-[1px] transition-opacity group-focus-within:opacity-100">
                <div
                  className="h-full w-full rounded-[18px]"
                  style={{
                    background:
                      "conic-gradient(from var(--border-angle), #e2e8f0, #6366f1, #a855f7, #ec4899, #6366f1, #e2e8f0)",
                    animation: "border-rotate 4s linear infinite",
                  }}
                />
              </div>
              <div className="relative rounded-2xl bg-background p-3">
                <textarea
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-transparent focus:outline-none"
                  placeholder={ROTATING_PROMPTS[promptIndex]}
                />
                {/* Animated placeholder when empty */}
                {!query && (
                  <div className="pointer-events-none absolute left-3 top-3">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={promptIndex}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-muted-foreground"
                      >
                        {ROTATING_PROMPTS[promptIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={!query.trim()}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                      query.trim()
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <ArrowUp size={16} strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>

            {/* Suggestion prompts */}
            <div className="mt-5 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Try asking
              </p>
              {SUGGESTION_PROMPTS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="block w-full rounded-xl border border-border px-3.5 py-2.5 text-left text-[13px] text-foreground transition-colors hover:bg-accent/50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading / Results: full-screen chat ──
  return (
    <div className="fixed inset-0 z-[60] mx-auto flex w-full max-w-lg flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 px-5 pt-14 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-semibold">Ask Patch</span>
        </div>
      </div>

      {/* Scrollable chat content */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="space-y-4">
          {/* User query bubble */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5">
              <p className="text-sm leading-relaxed text-background">
                {submittedQuery}
              </p>
            </div>
          </div>

          {/* Agent response */}
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground">
              <Sparkles size={12} className="text-background" />
            </div>

            <div className="flex-1 space-y-3">
              {view === "loading" && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                    >
                      <Sparkles
                        size={14}
                        className="text-muted-foreground"
                      />
                    </motion.div>
                    <p className="text-sm font-medium text-foreground">
                      Finding the best matches...
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Checking availability, pricing, and reviews
                  </p>
                  <div className="mt-3 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          delay: i * 0.2,
                        }}
                        className="h-16 rounded-xl bg-accent/60"
                      />
                    ))}
                  </div>
                </div>
              )}

              {view === "results" && interpretation && (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    I found{" "}
                    <span className="font-semibold">
                      {results.length} providers
                    </span>{" "}
                    that match what you&apos;re looking for.
                  </p>

                  {/* Collapsible interpretation */}
                  <div className="rounded-xl border border-border">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        setShowInterpretation(!showInterpretation)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setShowInterpretation(!showInterpretation);
                        }
                      }}
                      className="flex w-full cursor-pointer items-center justify-between px-3.5 py-2.5"
                    >
                      <span className="text-xs font-medium text-muted-foreground">
                        What your agent understood
                      </span>
                      <div className="flex items-center gap-1.5">
                        {!showInterpretation && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditQuery();
                            }}
                            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                          >
                            <Pencil size={10} />
                            Edit
                          </button>
                        )}
                        <motion.div
                          animate={{
                            rotate: showInterpretation ? 90 : 0,
                          }}
                          transition={{ duration: 0.15 }}
                        >
                          <ChevronRight
                            size={14}
                            className="text-muted-foreground"
                          />
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {showInterpretation && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border">
                            {Object.entries(interpretation).map(
                              ([key, value], i, arr) => (
                                <div
                                  key={key}
                                  className={cn(
                                    "flex items-center justify-between px-3.5 py-2.5",
                                    i < arr.length - 1 &&
                                      "border-b border-border"
                                  )}
                                >
                                  <span className="text-xs text-muted-foreground capitalize">
                                    {key
                                      .replace(/([A-Z])/g, " $1")
                                      .trim()}
                                  </span>
                                  <span className="text-xs font-medium text-foreground">
                                    {value}
                                  </span>
                                </div>
                              )
                            )}
                            <div className="border-t border-border px-3.5 py-2">
                              <button
                                onClick={handleEditQuery}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                              >
                                <Pencil size={11} />
                                Edit search
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Results */}
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        {results.length} providers found
                      </p>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                        Sort by: Best match
                        <ChevronDown size={12} />
                      </button>
                    </div>
                    <div className="mt-3 space-y-3">
                      {results.map((provider) => (
                        <ProviderCard
                          key={provider.id}
                          provider={provider}
                          variant="search"
                          onClick={setSelectedProvider}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Agent follow-up */}
          {view === "results" && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex gap-2.5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground">
                <Sparkles size={12} className="text-background" />
              </div>
              <div className="flex-1 space-y-2.5">
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-semibold">
                    {results[0].name}
                  </span>{" "}
                  is your best match — highest rated, fits your budget,
                  and available tomorrow morning. Want me to book them?
                </p>
                <div className="flex gap-2">
                  <a
                    href={`/provider/${results[0].id}`}
                    className="flex h-9 items-center rounded-full bg-foreground px-4 text-xs font-medium text-background transition-opacity hover:opacity-90"
                  >
                    Yes, book now
                  </a>
                  <a
                    href={`/provider/${results[0].id}`}
                    className="flex h-9 items-center rounded-full border border-border px-4 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    View profile first
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Follow-up input */}
      {view === "results" && (
        <div className="shrink-0 bg-background px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-2">
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-accent/30 px-3 py-2">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a follow-up..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={handleSubmit}
              disabled={!query.trim()}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                query.trim()
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <ArrowUp size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {/* Provider detail bottom sheet */}
      <AnimatePresence>
        {selectedProvider && (
          <ProviderDetailSheet
            provider={selectedProvider}
            onClose={() => setSelectedProvider(null)}
            onBook={(provider, slot) => {
              setSelectedProvider(null);
              addBooking(provider, slot);
              toast.success("Booking confirmed!", {
                description: `${provider.name} · ${slot.dayLabel} ${slot.start}`,
              });
              router.push("/bookings");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
