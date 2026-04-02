"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Square,
  SquarePen,
  ChevronRight,
  Check,
  Clock,
  CalendarCheck,
  MessageSquare,
  MapPin,
  Star,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { PatchLogo } from "@/components/patch-logo";
import { ProviderDetailSheet } from "@/components/home/provider-detail-sheet";
import { COVER_IMAGES } from "@/components/home/provider-card";
import { useBookings } from "@/components/bookings-context";
import { getSearchResults } from "@/data/providers";
import { getConversationByProviderId } from "@/data/messages";
import type { Provider, Booking } from "@/types";
import { cn } from "@/lib/utils";

type ConversationStep =
  | "idle"
  | "searching"
  | "ask-budget"
  | "ask-timing"
  | "finding-match"
  | "best-match"
  | "booking"
  | "confirmed";

const ROTATING_PROMPTS = [
  "Need a plumber tomorrow morning under $180",
  "Deep clean my 2BR apartment this weekend",
  "Mount a 65-inch TV, budget around $200",
  "Fix a leaking kitchen faucet ASAP",
  "Paint my living room, need a quote",
];

const BUDGET_OPTIONS = [
  { id: "under-200", label: "Under $200" },
  { id: "200-500", label: "$200 – $500" },
  { id: "insurance", label: "Covered by insurance" },
];

const TIMING_OPTIONS = [
  { id: "instantly", label: "Instantly" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "earliest", label: "Earliest available" },
];

function getRelativeDay(dateStr: string): string {
  const cleaned = dateStr.replace(/^Tomorrow,\s*/, "");
  const parsed = new Date(cleaned + `, ${new Date().getFullYear()}`);
  if (isNaN(parsed.getTime())) return dateStr;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);
  const diffDays = Math.round(
    (parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `in ${diffDays} Days`;
  return dateStr;
}

function AgentQuestion({
  options,
  selected,
  onSelect,
}: {
  options: { id: string; label: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected === opt.id;
        const isDisabled = selected !== null && !isSelected;
        return (
          <button
            key={opt.id}
            onClick={() => !selected && onSelect(opt.id)}
            disabled={isDisabled}
            className={cn(
              "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
              !selected &&
                "border-border text-foreground hover:border-foreground/40 hover:bg-accent/50",
              isSelected && "border-foreground bg-foreground text-background",
              isDisabled && "border-border/40 text-muted-foreground/30"
            )}
          >
            {isSelected && <Check size={13} className="-ml-0.5 mr-1.5 inline" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function BestMatchCard({
  provider,
  onViewDetails,
  onBook,
}: {
  provider: Provider;
  onViewDetails: () => void;
  onBook: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border bg-background"
    >
      <div className="p-4">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background">
            BEST MATCH
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
            {provider.ownerName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {provider.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <Star size={11} className="fill-foreground text-foreground" />
                {provider.rating}
              </span>
              <span>·</span>
              <span>{provider.reviewCount} reviews</span>
              <span>·</span>
              <span>{provider.distance}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock size={12} strokeWidth={1.5} className="shrink-0" />
            <span>
              Next available: {provider.availability[0]?.dayLabel}{" "}
              {provider.availability[0]?.slots.find((s) => s.available)?.start}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin size={12} strokeWidth={1.5} className="shrink-0" />
            <span>{provider.serviceArea}</span>
          </div>
          {provider.badges.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield size={12} strokeWidth={1.5} className="shrink-0" />
              <span>
                {provider.badges
                  .map((b) =>
                    b === "background-checked"
                      ? "Background checked"
                      : b.charAt(0).toUpperCase() + b.slice(1)
                  )
                  .join(" · ")}
              </span>
            </div>
          )}
        </div>

        <p className="mt-3 text-sm font-semibold text-foreground">
          {provider.priceRange}
        </p>
      </div>

      <div className="flex gap-2 border-t border-border p-3">
        <button
          onClick={onViewDetails}
          className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:bg-accent/50"
        >
          View details
        </button>
        <button
          onClick={onBook}
          className="flex h-11 flex-1 items-center justify-center rounded-xl bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Book now
        </button>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { addBooking, getUpcoming } = useBookings();
  const upcomingBookings = getUpcoming();
  const latestBooking = upcomingBookings[0] ?? null;

  const [step, setStep] = useState<ConversationStep>("idle");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedTiming, setSelectedTiming] = useState<string | null>(null);
  const [bestMatch, setBestMatch] = useState<Provider | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(
    null
  );
  const [promptIndex, setPromptIndex] = useState(0);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (step !== "idle") return;
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % ROTATING_PROMPTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [step]);

  const scrollToBottom = useCallback(() => {
    setTimeout(
      () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      120
    );
  }, []);

  const handleReset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStep("idle");
    setQuery("");
    setSubmittedQuery("");
    setSelectedBudget(null);
    setSelectedTiming(null);
    setBestMatch(null);
    setSelectedProvider(null);
    setConfirmedBooking(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    setSubmittedQuery(query.trim());
    setQuery("");
    setStep("searching");

    timerRef.current = setTimeout(() => {
      setStep("ask-budget");
      scrollToBottom();
    }, 1800);
  }, [query, scrollToBottom]);

  const handleStop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setQuery(submittedQuery);
    setStep("idle");
  }, [submittedQuery]);

  const handleSelectBudget = useCallback(
    (id: string) => {
      setSelectedBudget(id);
      setTimeout(() => {
        setStep("ask-timing");
        scrollToBottom();
      }, 400);
    },
    [scrollToBottom]
  );

  const handleSelectTiming = useCallback(
    (id: string) => {
      setSelectedTiming(id);
      setStep("finding-match");
      scrollToBottom();

      timerRef.current = setTimeout(() => {
        const results = getSearchResults();
        setBestMatch(results[0] ?? null);
        setStep("best-match");
        scrollToBottom();
      }, 2000);
    },
    [scrollToBottom]
  );

  const handleBookBestMatch = useCallback(() => {
    if (!bestMatch) return;
    const day = bestMatch.availability[0];
    const slot = day?.slots.find((s) => s.available);
    if (!day || !slot) return;

    const booking = addBooking(bestMatch, {
      dayLabel: day.dayLabel,
      date: day.date,
      start: slot.start,
      end: slot.end,
    }, submittedQuery);
    toast.success("Booking confirmed!", {
      description: `${bestMatch.name} · ${day.dayLabel} ${slot.start}`,
    });
    setConfirmedBooking(booking);
    setStep("confirmed");
    scrollToBottom();
  }, [bestMatch, addBooking, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const budgetLabel =
    BUDGET_OPTIONS.find((o) => o.id === selectedBudget)?.label ?? "";
  const timingLabel =
    TIMING_OPTIONS.find((o) => o.id === selectedTiming)?.label ?? "";

  // ── Idle ──
  if (step === "idle") {
    return (
      <div className="flex flex-1 flex-col px-5 pb-20">
        <div className="flex flex-1 flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <PatchLogo size={44} className="text-foreground" />
            <h1 className="mt-4 text-xl font-semibold tracking-tight">
              What do you need help with?
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Patch finds and books trusted home services
            </p>
          </motion.div>

          <div className="mt-8 w-full">
            {/* Sample prompts */}
            <div className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 no-scrollbar">
              {ROTATING_PROMPTS.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setQuery(prompt);
                    setSubmittedQuery(prompt);
                    setStep("searching");
                    timerRef.current = setTimeout(() => {
                      setStep("ask-budget");
                      scrollToBottom();
                    }, 1800);
                  }}
                  className="shrink-0 rounded-xl border border-border px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>

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
                  className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
                  placeholder="Find a fix with Patch"
                />

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

            {latestBooking && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-5"
              >
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Bookings
                </p>
                <Link
                  href="/bookings"
                  className="flex items-center gap-3 rounded-2xl border border-border p-3.5 transition-colors hover:bg-accent/40"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                    <CalendarCheck
                      size={18}
                      strokeWidth={1.5}
                      className="text-emerald-600"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {latestBooking.providerName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {latestBooking.serviceSummary} ·{" "}
                      {getRelativeDay(latestBooking.date)}
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-muted-foreground"
                  />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Conversation flow ──
  const isSearching = step === "searching";
  const showBudgetQ = step === "ask-budget" || (selectedBudget !== null && step !== "searching");
  const showTimingQ = step === "ask-timing" || (selectedTiming !== null && step !== "searching" && step !== "ask-budget");
  const isFindingMatch = step === "finding-match";
  const showBestMatch = step === "best-match" || step === "booking" || step === "confirmed";
  const showConfirmation = step === "confirmed";

  return (
    <div className="fixed inset-0 z-[60] mx-auto flex w-full max-w-lg flex-col bg-background">
      <button
        onClick={handleReset}
        className="fixed right-4 top-[max(env(safe-area-inset-top),16px)] z-[70] flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/45 shadow-[0_4px_24px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-2xl transition-all hover:bg-white/60 hover:shadow-[0_6px_28px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]"
      >
        <SquarePen size={18} strokeWidth={1.5} />
      </button>

      <div className="shrink-0 h-[calc(max(env(safe-area-inset-top),16px)+48px)]" />

      <div
        className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 pb-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="space-y-5">
          {/* User query */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-50 px-4 py-2.5">
              <p className="text-sm leading-relaxed text-blue-900">
                {submittedQuery}
              </p>
            </div>
          </div>

          {/* Step 1: Searching */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2.5"
          >
            <PatchLogo size={28} className="shrink-0 text-foreground" />
            <div className="min-w-0 flex-1 space-y-3">
              {isSearching && (
                <div className="space-y-2 pt-1">
                  <p className="shimmer-text text-sm font-medium text-muted-foreground">
                    Searching service providers near you…
                  </p>
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          delay: i * 0.2,
                        }}
                        className="h-12 rounded-xl bg-accent/60"
                      />
                    ))}
                  </div>
                </div>
              )}

              {!isSearching && (
                <p className="text-sm leading-relaxed text-foreground">
                  I found several providers in your area. Let me narrow it down
                  for you.
                </p>
              )}
            </div>
          </motion.div>

          {/* Step 2: Budget question */}
          {showBudgetQ && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5"
            >
              <PatchLogo size={28} className="shrink-0 text-foreground" />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm leading-relaxed text-foreground">
                  Do you have a budget in mind?
                </p>
                {selectedBudget && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1 text-xs font-medium text-foreground">
                    <Check size={12} />
                    {budgetLabel}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Timing question */}
          {showTimingQ && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5"
            >
              <PatchLogo size={28} className="shrink-0 text-foreground" />
              <div className="min-w-0 flex-1 space-y-2">
                <p className="text-sm leading-relaxed text-foreground">
                  What timing works for you?
                </p>
                {selectedTiming && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1 text-xs font-medium text-foreground">
                    <Check size={12} />
                    {timingLabel}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Finding match */}
          {isFindingMatch && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5"
            >
              <PatchLogo size={28} className="shrink-0 text-foreground" />
              <div className="min-w-0 flex-1 space-y-2 pt-1">
                <p className="shimmer-text text-sm font-medium text-muted-foreground">
                  Finding your best match…
                </p>
                <motion.div
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="h-40 rounded-xl bg-accent/60"
                />
              </div>
            </motion.div>
          )}

          {/* Step 5: Best match */}
          {showBestMatch && bestMatch && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5"
            >
              <PatchLogo size={28} className="shrink-0 text-foreground" />
              <div className="min-w-0 flex-1 space-y-3">
                <p className="text-sm leading-relaxed text-foreground">
                  Based on your budget ({budgetLabel}) and timing ({timingLabel}
                  ), here&apos;s your best match:
                </p>

                {!showConfirmation && (
                  <BestMatchCard
                    provider={bestMatch}
                    onViewDetails={() => setSelectedProvider(bestMatch)}
                    onBook={handleBookBestMatch}
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* Step 6: Booking confirmation */}
          {showConfirmation && confirmedBooking && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5"
            >
              <PatchLogo size={28} className="shrink-0 text-foreground" />
              <div className="min-w-0 flex-1 space-y-3">
                <p className="text-sm leading-relaxed text-foreground">
                  You&apos;re all set! Here&apos;s your booking.
                </p>

                <div className="overflow-hidden rounded-2xl border border-border bg-background">
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <CalendarCheck
                        size={18}
                        strokeWidth={1.5}
                        className="text-emerald-600"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-600">
                        Confirmed
                      </p>
                      <h3 className="mt-0.5 truncate text-sm font-semibold text-foreground">
                        {confirmedBooking.providerName}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-border px-4 py-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock
                        size={13}
                        strokeWidth={1.5}
                        className="shrink-0"
                      />
                      <span>
                        {confirmedBooking.date} · {confirmedBooking.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {confirmedBooking.serviceSummary}
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      {confirmedBooking.priceEstimate}
                    </p>
                  </div>

                  <div className="space-y-1.5 border-t border-border bg-muted/30 px-4 py-3">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Your request
                    </p>
                    <p className="text-xs leading-relaxed text-foreground">
                      &ldquo;{submittedQuery}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href="/bookings"
                    className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Go to bookings
                  </Link>
                  <button
                    onClick={() => {
                      const conv = getConversationByProviderId(
                        confirmedBooking.providerId
                      );
                      const draft = encodeURIComponent(
                        `Hi, I just booked ${confirmedBooking.serviceSummary.toLowerCase()} for ${confirmedBooking.date}. Looking forward to it!`
                      );
                      if (conv) {
                        router.push(`/messages/${conv.id}?draft=${draft}`);
                      } else {
                        const name = encodeURIComponent(
                          confirmedBooking.providerName
                        );
                        router.push(
                          `/messages/new?providerName=${name}&draft=${draft}`
                        );
                      }
                    }}
                    className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-accent/40"
                  >
                    <MessageSquare size={14} strokeWidth={1.5} />
                    Message
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Question bottom sheet */}
      <AnimatePresence>
        {step === "ask-budget" && !selectedBudget && (
          <motion.div
            key="budget-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[65] rounded-t-2xl border-t border-border bg-background px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-5"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Select a budget
            </p>
            <div className="mx-auto flex max-w-lg flex-col gap-2">
              {BUDGET_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectBudget(opt.id)}
                  className="flex h-12 items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-accent/50"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step === "ask-timing" && !selectedTiming && (
          <motion.div
            key="timing-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[65] rounded-t-2xl border-t border-border bg-background px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-5"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              What timing works?
            </p>
            <div className="mx-auto flex max-w-lg flex-col gap-2">
              {TIMING_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectTiming(opt.id)}
                  className="flex h-12 items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-accent/50"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom input bar — hidden during questions */}
      {step !== "ask-budget" && step !== "ask-timing" && (
        <div className="shrink-0 bg-background px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-2">
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-accent/30 px-3 py-2">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={isSearching ? undefined : handleKeyDown}
              placeholder={isSearching ? "Searching..." : "Ask a follow-up..."}
              rows={1}
              disabled={isSearching}
              className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
            />
            {isSearching ? (
              <button
                onClick={handleStop}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80"
              >
                <Square size={12} fill="currentColor" />
              </button>
            ) : (
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
            )}
          </div>
        </div>
      )}

      {/* Provider detail sheet */}
      <AnimatePresence>
        {selectedProvider && (
          <ProviderDetailSheet
            provider={selectedProvider}
            coverImage={COVER_IMAGES[0]}
            onClose={() => setSelectedProvider(null)}
            onBook={(provider, slot) => {
              setSelectedProvider(null);
              const booking = addBooking(provider, slot, submittedQuery);
              toast.success("Booking confirmed!", {
                description: `${provider.name} · ${slot.dayLabel} ${slot.start}`,
              });
              setConfirmedBooking(booking);
              setStep("confirmed");
              scrollToBottom();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
