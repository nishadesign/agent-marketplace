"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Sparkles,
  Square,
  SquarePen,
  ChevronRight,
  ChevronDown,
  Check,
  Clock,
  CalendarCheck,
  MessageSquare,
  X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { ProviderCard, COVER_IMAGES } from "@/components/home/provider-card";
import { ProviderDetailSheet } from "@/components/home/provider-detail-sheet";
import { useBookings } from "@/components/bookings-context";
import { getSearchResults, getMoreResults } from "@/data/providers";
import { getConversationByProviderId } from "@/data/messages";
import type { Provider, AgentInterpretation, Booking } from "@/types";
import { cn } from "@/lib/utils";

type ViewState = "idle" | "loading" | "results";

const ROTATING_PROMPTS = [
  "Need a plumber tomorrow morning under $180",
  "Deep clean my 2BR apartment this weekend",
  "Mount a 65-inch TV, budget around $200",
  "Fix a leaking kitchen faucet ASAP",
  "Paint my living room, need a quote",
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

function getRelativeDay(dateStr: string): string {
  const cleaned = dateStr.replace(/^Tomorrow,\s*/, "");
  const parsed = new Date(cleaned + `, ${new Date().getFullYear()}`);
  if (isNaN(parsed.getTime())) return dateStr;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);
  const diffDays = Math.round((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `in ${diffDays} Days`;
  return dateStr;
}

const DEMO_INTERPRETATION: AgentInterpretation = {
  serviceType: "Plumbing — Leak repair",
  when: `Tomorrow morning (${getTomorrowLabel()})`,
  budget: "Under $200",
  location: "San Francisco (auto-detected)",
};

export default function HomePage() {
  const router = useRouter();
  const { addBooking, getUpcoming } = useBookings();
  const upcomingBookings = getUpcoming();
  const latestBooking = upcomingBookings[0] ?? null;
  const [view, setView] = useState<ViewState>("idle");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [interpretation, setInterpretation] =
    useState<AgentInterpretation | null>(null);
  const [results, setResults] = useState<Provider[]>([]);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [thinkingDuration, setThinkingDuration] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(0);
  const [bookingProvider, setBookingProvider] = useState<Provider | null>(null);
  const [bookingDay, setBookingDay] = useState(0);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [moreResults, setMoreResults] = useState<Provider[]>([]);
  const [promptIndex, setPromptIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setMoreResults([]);
    setShowInterpretation(false);
    setSelectedProvider(null);
    setBookingProvider(null);
    setBookingDay(0);
    setBookingSlotId(null);
    setConfirmedBooking(null);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    setSubmittedQuery(query.trim());
    setQuery("");
    setView("loading");
    setShowInterpretation(false);

    const startTime = Date.now();
    loadingTimerRef.current = setTimeout(() => {
      loadingTimerRef.current = null;
      setThinkingDuration(Math.round((Date.now() - startTime) / 1000));
      setInterpretation(DEMO_INTERPRETATION);
      setResults(getSearchResults());
      setView("results");
    }, 1500);
  }, [query]);

  const handleStop = useCallback(() => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
    setQuery(submittedQuery);
    setView("idle");
  }, [submittedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };


  const handleShowMore = useCallback(() => {
    setMoreResults(getMoreResults());
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  const handleViewDetails = useCallback((provider: Provider, index: number) => {
    setSelectedProvider(provider);
    setSelectedProviderIndex(index);
  }, []);

  const handleBookNow = useCallback((provider: Provider) => {
    setBookingProvider(provider);
    setBookingDay(0);
    setBookingSlotId(null);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  const handleConfirmBooking = useCallback(() => {
    if (!bookingProvider || bookingSlotId === null) return;
    const day = bookingProvider.availability[bookingDay];
    const slot = day?.slots.find((s) => s.id === bookingSlotId);
    if (!day || !slot) return;

    const booking = addBooking(bookingProvider, {
      dayLabel: day.dayLabel,
      date: day.date,
      start: slot.start,
      end: slot.end,
    });
    toast.success("Booking confirmed!", {
      description: `${bookingProvider.name} · ${day.dayLabel} ${slot.start}`,
    });
    setConfirmedBooking(booking);
    setBookingProvider(null);
    setBookingSlotId(null);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [bookingProvider, bookingDay, bookingSlotId, addBooking]);

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

            {/* Latest booking */}
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
                    <CalendarCheck size={18} strokeWidth={1.5} className="text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {latestBooking.providerName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {latestBooking.serviceSummary} · {getRelativeDay(latestBooking.date)}
                    </p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-muted-foreground" />
                </Link>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // ── Loading / Results: full-screen chat ──
  return (
    <div className="fixed inset-0 z-[60] mx-auto flex w-full max-w-lg flex-col bg-background">
      {/* New conversation button — aligned with menu button */}
      <button
        onClick={handleReset}
        className="fixed right-4 top-[max(env(safe-area-inset-top),16px)] z-40 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-background"
      >
        <SquarePen size={18} strokeWidth={1.5} />
      </button>

      {/* Spacer for fixed header */}
      <div className="shrink-0 h-[calc(max(env(safe-area-inset-top),16px)+48px)]" />

      {/* Scrollable chat content */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 pb-4"
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

            <div className="min-w-0 flex-1 space-y-3">
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
                  <button
                    onClick={() => setShowInterpretation(true)}
                    className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Thought for {thinkingDuration || 2}s
                    <ChevronRight size={12} />
                  </button>

                  <p className="text-sm leading-relaxed text-foreground">
                    I found{" "}
                    <span className="font-semibold">
                      {results.length} providers
                    </span>{" "}
                    that match what you&apos;re looking for.
                  </p>

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
                    <div className="-mx-5 mt-3 flex gap-3 overflow-x-auto px-5 pb-2 no-scrollbar">
                      {results.map((provider, i) => (
                        <ProviderCard
                          key={provider.id}
                          provider={provider}
                          variant="search"
                          index={i}
                          onClick={handleViewDetails}
                          onBook={handleBookNow}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Agent follow-up */}
          {view === "results" && results.length > 0 && !bookingProvider && !confirmedBooking && (
            <>
              {moreResults.length === 0 && (
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
                      Do any of these work for you, or would you like me to
                      search with different criteria?
                    </p>
                    <button
                      onClick={handleShowMore}
                      className="flex h-9 items-center rounded-full border border-border px-4 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      Show more
                    </button>
                  </div>
                </motion.div>
              )}

              {moreResults.length > 0 && (
                <>
                  {/* User message */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5">
                      <p className="text-sm leading-relaxed text-background">
                        Show more
                      </p>
                    </div>
                  </motion.div>

                  {/* Agent response with more providers */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex gap-2.5"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground">
                      <Sparkles size={12} className="text-background" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-4">
                      <p className="text-sm leading-relaxed text-foreground">
                        Here are {moreResults.length} more providers that might help.
                      </p>

                      <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 no-scrollbar">
                        {moreResults.map((provider, i) => (
                          <ProviderCard
                            key={provider.id}
                            provider={provider}
                            variant="search"
                            index={i}
                            onClick={handleViewDetails}
                            onBook={handleBookNow}
                          />
                        ))}
                      </div>

                      <p className="text-sm leading-relaxed text-foreground">
                        Tell me more about the problem to find the right provider for you.
                      </p>
                    </div>
                  </motion.div>
                </>
              )}
            </>
          )}

          {/* Booking slot picker — shown when user taps "Book now" on a card */}
          {bookingProvider && (
            <>
              {/* User message */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5">
                  <p className="text-sm leading-relaxed text-background">
                    Book {bookingProvider.name}
                  </p>
                </div>
              </motion.div>

              {/* Agent slot picker message */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex gap-2.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground">
                  <Sparkles size={12} className="text-background" />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <p className="text-sm leading-relaxed text-foreground">
                    Here are{" "}
                    <span className="font-semibold">
                      {bookingProvider.name}&apos;s
                    </span>{" "}
                    available slots. Pick a time that works for you.
                  </p>

                  {/* Day selector */}
                  <div className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar">
                    {bookingProvider.availability.map((day, i) => {
                      const available = day.slots.filter((s) => s.available).length;
                      return (
                        <button
                          key={day.date}
                          onClick={() => {
                            setBookingDay(i);
                            setBookingSlotId(null);
                          }}
                          className={cn(
                            "flex shrink-0 flex-col items-center rounded-xl border px-4 py-2.5 transition-colors",
                            bookingDay === i
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-background text-foreground hover:bg-accent/50"
                          )}
                        >
                          <span className="text-xs font-medium">{day.dayLabel}</span>
                          <span
                            className={cn(
                              "mt-0.5 text-[11px]",
                              bookingDay === i ? "text-background/70" : "text-muted-foreground"
                            )}
                          >
                            {available} {available === 1 ? "slot" : "slots"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Time slots grid */}
                  {bookingProvider.availability[bookingDay] && (
                    <div className="grid grid-cols-2 gap-2">
                      {bookingProvider.availability[bookingDay].slots.map((slot) => {
                        const isSelected = bookingSlotId === slot.id;
                        return (
                          <button
                            key={slot.id}
                            disabled={!slot.available}
                            onClick={() => setBookingSlotId(isSelected ? null : slot.id)}
                            className={cn(
                              "relative flex items-center justify-center rounded-xl border px-3 py-3 text-sm transition-colors",
                              !slot.available && "cursor-not-allowed border-border/50 bg-muted/30 text-muted-foreground/40 line-through",
                              slot.available && !isSelected && "border-border text-foreground hover:border-foreground/40 hover:bg-accent/50",
                              isSelected && "border-foreground bg-foreground text-background"
                            )}
                          >
                            {slot.start} – {slot.end}
                            {isSelected && (
                              <Check size={14} className="absolute right-2.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Confirm booking button */}
                  <button
                    onClick={handleConfirmBooking}
                    disabled={!bookingSlotId}
                    className={cn(
                      "flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition-opacity",
                      bookingSlotId
                        ? "bg-foreground text-background hover:opacity-90"
                        : "cursor-not-allowed bg-muted text-muted-foreground"
                    )}
                  >
                    {bookingSlotId
                      ? `Confirm booking · ${bookingProvider.availability[bookingDay]?.dayLabel} ${bookingProvider.availability[bookingDay]?.slots.find((s) => s.id === bookingSlotId)?.start}`
                      : "Select a time slot"}
                  </button>
                </div>
              </motion.div>
            </>
          )}

          {/* Confirmed booking card */}
          {confirmedBooking && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground">
                <Sparkles size={12} className="text-background" />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <p className="text-sm leading-relaxed text-foreground">
                  You&apos;re all set! Here&apos;s your upcoming booking.
                </p>

                <div className="rounded-2xl border border-border bg-background">
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <CalendarCheck size={18} strokeWidth={1.5} className="text-emerald-600" />
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

                  <div className="border-t border-border px-4 py-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={13} strokeWidth={1.5} className="shrink-0" />
                      <span>{confirmedBooking.date} · {confirmedBooking.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {confirmedBooking.serviceSummary}
                    </p>
                    <p className="text-xs font-medium text-foreground">
                      {confirmedBooking.priceEstimate}
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
                        const name = encodeURIComponent(confirmedBooking.providerName);
                        router.push(`/messages/new?providerName=${name}&draft=${draft}`);
                      }
                    }}
                    className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-accent/40"
                  >
                    <MessageSquare size={14} strokeWidth={1.5} />
                    Message provider
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Bottom input bar — visible during loading and results */}
      <div className="shrink-0 bg-background px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-2">
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-accent/30 px-3 py-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={view === "loading" ? undefined : handleKeyDown}
            placeholder={
              view === "loading"
                ? "Searching..."
                : "Ask a follow-up..."
            }
            rows={1}
            disabled={view === "loading"}
            className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />
          {view === "loading" ? (
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

      {/* Thinking details bottom sheet */}
      <AnimatePresence>
        {showInterpretation && interpretation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex flex-col justify-end"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowInterpretation(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setShowInterpretation(false);
                }
              }}
              className="relative mx-auto w-full max-w-lg rounded-t-2xl bg-background pb-[max(env(safe-area-inset-bottom),24px)]"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="h-1 w-8 rounded-full bg-muted-foreground/20" />
              </div>

              <div className="flex items-center justify-between px-5 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Thought for {thinkingDuration || 2}s
                  </h3>
                </div>
                <button
                  onClick={() => setShowInterpretation(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              <div className="border-t border-border mx-5">
                {Object.entries(interpretation).map(([key, value], i, arr) => (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center justify-between py-3.5",
                      i < arr.length - 1 && "border-b border-border"
                    )}
                  >
                    <span className="text-xs text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Provider detail bottom sheet */}
      <AnimatePresence>
        {selectedProvider && (
          <ProviderDetailSheet
            provider={selectedProvider}
            coverImage={COVER_IMAGES[selectedProviderIndex % COVER_IMAGES.length]}
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
