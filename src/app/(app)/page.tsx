"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  Square,
  SquarePen,
  ChevronRight,
  ChevronDown,
  Check,
  Clock,
  CalendarCheck,
  CalendarPlus,
  MessageSquare,
  MapPin,
  Star,
  Shield,
  BadgeCheck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PatchLogo } from "@/components/patch-logo";
import { useBookings } from "@/components/bookings-context";
import { getSearchResults } from "@/data/providers";
import { getConversationByProviderId } from "@/data/messages";
import type { Provider, Booking } from "@/types";
import { cn } from "@/lib/utils";

type ConversationStep =
  | "idle"
  | "searching"
  | "ask-issue"
  | "thinking"
  | "ask-budget"
  | "ask-timing"
  | "finding-match"
  | "best-match"
  | "booking"
  | "confirmed";

interface FlowConfig {
  searchingMessage: string;
  askIssue?: boolean;
  issuePrompt?: string;
  skipBudget: boolean;
  skipTiming?: boolean;
  budgetPreset?: string;
  budgetPresetLabel?: string;
  timingPreset?: string;
  timingPresetLabel?: string;
  budgetOptions: { id: string; label: string }[];
  timingOptions: { id: string; label: string }[];
  providerCategory: string;
  cardVariant: "default" | "gallery";
  matchSummary: (budget: string, timing: string) => string;
}

const SAMPLE_PROMPTS = [
  "Need plumber tomorrow at 9AM",
  "Deep clean my 2BR apartment this weekend",
];

const DEFAULT_BUDGET_OPTIONS = [
  { id: "under-200", label: "Under $200" },
  { id: "200-500", label: "$200 – $500" },
  { id: "insurance", label: "Covered by insurance" },
];

const DEFAULT_TIMING_OPTIONS = [
  { id: "instantly", label: "Instantly" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "earliest", label: "Earliest available" },
];

const FLOW_CONFIGS: Record<string, FlowConfig> = {
  "Need plumber tomorrow at 9AM": {
    searchingMessage: "Finding plumbers available tomorrow at 9 AM…",
    askIssue: true,
    issuePrompt:
      "Can you describe the issue you're looking for a plumber to fix?",
    skipBudget: true,
    skipTiming: true,
    timingPreset: "9am",
    timingPresetLabel: "9 AM",
    budgetOptions: DEFAULT_BUDGET_OPTIONS,
    timingOptions: [
      { id: "8am", label: "8 AM" },
      { id: "9am", label: "9 AM" },
      { id: "earliest", label: "Earliest available" },
    ],
    providerCategory: "plumbing",
    cardVariant: "gallery",
    matchSummary: () => `Here's your best match for tomorrow at 9 AM:`,
  },
  "Deep clean my 2BR apartment this weekend": {
    searchingMessage: "Finding top-rated cleaners near you…",
    skipBudget: false,
    budgetOptions: DEFAULT_BUDGET_OPTIONS,
    timingOptions: [
      { id: "morning", label: "Morning" },
      { id: "afternoon", label: "Afternoon" },
      { id: "evening", label: "Evening" },
      { id: "anytime", label: "Anytime" },
    ],
    providerCategory: "cleaning",
    cardVariant: "default",
    matchSummary: (budget, timing) =>
      `Based on your budget (${budget}) and preferred time (${timing}), here's your best match:`,
  },
};

const DEFAULT_FLOW: FlowConfig = {
  searchingMessage: "Searching service providers near you…",
  skipBudget: false,
  budgetOptions: DEFAULT_BUDGET_OPTIONS,
  timingOptions: DEFAULT_TIMING_OPTIONS,
  providerCategory: "plumbing",
  cardVariant: "default",
  matchSummary: (budget, timing) =>
    `Based on your budget (${budget}) and timing (${timing}), here's your best match:`,
};

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

const PORTFOLIO_IMAGES = [
  "/providers/portfolio/plumber-sink.png",
  "/providers/portfolio/sink.png",
  "/providers/portfolio/pipes.png",
];

function PlumberMatchCard({
  provider,
  onViewDetails,
  onBook,
  approveMode = false,
}: {
  provider: Provider;
  onViewDetails: () => void;
  onBook: () => void;
  approveMode?: boolean;
}) {
  const [currentImage, setCurrentImage] = useState(0);

  const paginate = (direction: number) => {
    setCurrentImage((prev) => {
      const next = prev + direction;
      if (next < 0) return 0;
      if (next >= PORTFOLIO_IMAGES.length) return PORTFOLIO_IMAGES.length - 1;
      return next;
    });
  };

  // Drag-pan vs tap: only treat as a tap when not dragging
  const dragMovedRef = useRef(false);

  return (
    <motion.button
      type="button"
      onClick={() => {
        if (dragMovedRef.current) return;
        onViewDetails();
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={approveMode ? { scale: 0.99 } : undefined}
      className="block w-full overflow-hidden rounded-2xl border border-border bg-background text-left transition-shadow hover:shadow-sm"
    >
      {/* Swipeable image gallery */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={currentImage}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={() => {
              dragMovedRef.current = true;
            }}
            onDragEnd={(_e, info) => {
              if (info.offset.x < -50) paginate(1);
              else if (info.offset.x > 50) paginate(-1);
              setTimeout(() => {
                dragMovedRef.current = false;
              }, 0);
            }}
            className="absolute inset-0"
          >
            <Image
              src={PORTFOLIO_IMAGES[currentImage]}
              alt={`${provider.name} work photo ${currentImage + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 512px) 100vw, 512px"
              priority={currentImage === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {PORTFOLIO_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImage(i);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === currentImage
                  ? "w-4 bg-white"
                  : "w-1.5 bg-white/50"
              )}
            />
          ))}
        </div>
      </div>

      {/* Provider info — minimal: avatar with verified badge, name, reviews */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
              {provider.ownerName.charAt(0)}
            </div>
            <BadgeCheck
              size={16}
              strokeWidth={2}
              className="absolute -bottom-0.5 -right-0.5 fill-blue-500 text-white"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {provider.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Star size={11} className="fill-foreground text-foreground" />
              <span className="font-medium text-foreground">{provider.rating}</span>
              <span>({provider.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Non-approve flows still get inline actions inside the card */}
      {!approveMode && (
        <div className="flex gap-2 border-t border-border p-3">
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:bg-accent/50"
          >
            View details
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
            className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-xl bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Book now
          </span>
        </div>
      )}
    </motion.button>
  );
}

const ROTATING_STATUS_MESSAGES = [
  "Calling plumbers near you",
  "Checking availability for 9 AM",
  "Found available plumbers",
  "Waiting for confirmation",
];

function ServiceRequestCard({
  issueDescription,
  timing,
}: {
  issueDescription: string;
  timing: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border bg-background"
    >
      <div className="px-3.5 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Service request
        </p>
        <div className="mt-2 space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="w-12 shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Issue
            </span>
            <span className="flex-1 text-sm leading-snug text-foreground">
              {issueDescription}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="w-12 shrink-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Time
            </span>
            <span className="flex-1 text-sm leading-snug text-foreground">
              Tomorrow at {timing}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ThinkingStatus({
  isDone,
  duration,
  statusIndex,
  expanded,
  onToggle,
}: {
  isDone: boolean;
  duration: number;
  statusIndex: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const currentStatus =
    ROTATING_STATUS_MESSAGES[
      Math.min(statusIndex, ROTATING_STATUS_MESSAGES.length - 1)
    ];

  // While thinking, just show the rotating line — no "Thinking…" header
  if (!isDone) {
    return (
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStatus}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="shimmer-text text-sm font-medium leading-snug text-muted-foreground"
        >
          {currentStatus}
        </motion.p>
      </AnimatePresence>
    );
  }

  // Done — show summary with chevron and the full list when expanded
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center gap-1.5 text-left"
      >
        <span className="text-sm font-medium text-muted-foreground">
          Thought for {duration}s
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.75}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ul className="mt-2 space-y-1.5">
              {ROTATING_STATUS_MESSAGES.map((msg) => (
                <li
                  key={msg}
                  className="flex items-start gap-2 text-sm leading-snug text-muted-foreground"
                >
                  <Check
                    size={14}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0 text-muted-foreground/70"
                  />
                  <span>{msg}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
  const [issueDescription, setIssueDescription] = useState("");
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedTiming, setSelectedTiming] = useState<string | null>(null);
  const [bestMatch, setBestMatch] = useState<Provider | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(
    null
  );
  const [activeFlow, setActiveFlow] = useState<FlowConfig>(DEFAULT_FLOW);
  const [thinkingStatusIndex, setThinkingStatusIndex] = useState(0);
  const [thinkingDone, setThinkingDone] = useState(false);
  const [thinkingDuration, setThinkingDuration] = useState(0);
  const [thinkingExpanded, setThinkingExpanded] = useState(true);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkingTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);


  const scrollToBottom = useCallback(() => {
    setTimeout(
      () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      120
    );
  }, []);

  const handleReset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    thinkingTimersRef.current.forEach((t) => clearTimeout(t));
    thinkingTimersRef.current = [];
    setStep("idle");
    setQuery("");
    setSubmittedQuery("");
    setIssueDescription("");
    setSelectedBudget(null);
    setSelectedTiming(null);
    setBestMatch(null);
    setConfirmedBooking(null);
    setActiveFlow(DEFAULT_FLOW);
    setThinkingStatusIndex(0);
    setThinkingDone(false);
    setThinkingDuration(0);
    setThinkingExpanded(true);
  }, []);

  const startFlow = useCallback(
    (text: string) => {
      const flow = FLOW_CONFIGS[text] ?? DEFAULT_FLOW;
      setActiveFlow(flow);
      setSubmittedQuery(text);
      setIssueDescription("");
      setQuery("");

      if (flow.budgetPreset) setSelectedBudget(flow.budgetPreset);
      if (flow.timingPreset) setSelectedTiming(flow.timingPreset);

      // Issue-asking flow goes straight to the question — no searching skeleton, no intro line
      if (flow.askIssue) {
        setStep("ask-issue");
        scrollToBottom();
        return;
      }

      setStep("searching");
      timerRef.current = setTimeout(() => {
        if (flow.skipBudget && flow.skipTiming) {
          setStep("finding-match");
          scrollToBottom();
          timerRef.current = setTimeout(() => {
            const results = getSearchResults(flow.providerCategory);
            setBestMatch(results[0] ?? null);
            setStep("best-match");
            scrollToBottom();
          }, 1600);
          return;
        }
        if (flow.skipBudget) {
          setStep("ask-timing");
        } else {
          setStep("ask-budget");
        }
        scrollToBottom();
      }, 1800);
    },
    [scrollToBottom]
  );

  const handleSubmitIssue = useCallback(
    (text: string) => {
      setIssueDescription(text);
      setQuery("");
      setStep("thinking");
      setThinkingStatusIndex(0);
      setThinkingDone(false);
      setThinkingDuration(0);
      setThinkingExpanded(true);
      scrollToBottom();

      // Clear any prior thinking timers
      thinkingTimersRef.current.forEach((t) => clearTimeout(t));
      thinkingTimersRef.current = [];

      // Rotate through 4 status messages, ~3s each, then reveal match
      const stepDuration = 3000;
      const timers: ReturnType<typeof setTimeout>[] = [];
      for (let i = 1; i < 4; i++) {
        timers.push(
          setTimeout(() => {
            setThinkingStatusIndex(i);
          }, i * stepDuration)
        );
      }
      timers.push(
        setTimeout(() => {
          setThinkingDone(true);
          setThinkingExpanded(false);
          const results = getSearchResults(activeFlow.providerCategory);
          setBestMatch(results[0] ?? null);
          setStep("best-match");
          scrollToBottom();
        }, 4 * stepDuration)
      );

      thinkingTimersRef.current = timers;
    },
    [scrollToBottom, activeFlow.providerCategory]
  );

  // Tick a 1s counter while in the thinking step
  useEffect(() => {
    if (step !== "thinking") return;
    const interval = setInterval(() => {
      setThinkingDuration((d) => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Cleanup any pending thinking timers on unmount
  useEffect(() => {
    return () => {
      thinkingTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return;
    if (step === "ask-issue") {
      handleSubmitIssue(query.trim());
      return;
    }
    startFlow(query.trim());
  }, [query, step, startFlow, handleSubmitIssue]);

  const handleStop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setQuery(submittedQuery);
    setStep("idle");
    setActiveFlow(DEFAULT_FLOW);
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
        const results = getSearchResults(activeFlow.providerCategory);
        setBestMatch(results[0] ?? null);
        setStep("best-match");
        scrollToBottom();
      }, 2000);
    },
    [scrollToBottom, activeFlow.providerCategory]
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
    setConfirmedBooking(booking);
    setStep("confirmed");
    scrollToBottom();
  }, [bestMatch, addBooking, scrollToBottom, submittedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const budgetLabel =
    activeFlow.budgetPresetLabel ??
    activeFlow.budgetOptions.find((o) => o.id === selectedBudget)?.label ??
    "";
  const timingLabel =
    activeFlow.timingOptions.find((o) => o.id === selectedTiming)?.label ?? "";

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
              Find a trusted fix with Patch
            </h1>
          </motion.div>

          <div className="mt-8 w-full">
            {/* Sample prompts */}
            <div className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 no-scrollbar">
              {SAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => startFlow(prompt)}
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
                <div className="overflow-hidden rounded-2xl border border-border">
                  <Link
                    href="/bookings"
                    className="flex items-center gap-3 p-3.5 transition-colors hover:bg-accent/40"
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
                  <button className="flex w-full items-center justify-center gap-1.5 border-t border-border py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground">
                    <CalendarPlus size={13} strokeWidth={1.5} />
                    Add to calendar
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Conversation flow ──
  const isSearching = step === "searching";
  const showBudgetQ = !activeFlow.skipBudget && (step === "ask-budget" || (selectedBudget !== null && step !== "searching"));
  const showTimingQ = step === "ask-timing" || (selectedTiming !== null && step !== "searching" && step !== "ask-budget");
  const isFindingMatch = step === "finding-match";
  const showBestMatch = step === "best-match" || step === "booking" || step === "confirmed";
  const showConfirmation = step === "confirmed";

  return (
    <div className="fixed inset-0 z-[60] mx-auto flex w-full max-w-lg flex-col bg-background">
      <button
        onClick={handleReset}
        className="fixed right-4 top-[max(env(safe-area-inset-top),60px)] z-[70] flex h-12 w-12 items-center justify-center rounded-full text-foreground transition-opacity hover:opacity-70"
      >
        <SquarePen size={20} strokeWidth={1.5} />
      </button>

      <div className="shrink-0 h-[calc(max(env(safe-area-inset-top),60px)+56px)]" />

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

          {/* Step 1: Searching — skipped entirely when the flow asks about the issue first */}
          {!activeFlow.askIssue && (
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
                      {activeFlow.searchingMessage}
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
                    {activeFlow.skipBudget && activeFlow.skipTiming
                      ? "I found several options near you. Picking the best match for you."
                      : activeFlow.skipBudget
                      ? "I found several options near you. Let me help you pick a time."
                      : "I found several providers in your area. Let me narrow it down for you."}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Issue question — appears once we move past searching */}
          {activeFlow.askIssue &&
            (step === "ask-issue" ||
              step === "thinking" ||
              step === "finding-match" ||
              step === "best-match" ||
              step === "booking" ||
              step === "confirmed") && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5"
              >
                <PatchLogo size={28} className="shrink-0 text-foreground" />
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-sm leading-relaxed text-foreground">
                    {activeFlow.issuePrompt}
                  </p>
                </div>
              </motion.div>
            )}

          {/* User's issue reply */}
          {activeFlow.askIssue && issueDescription && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-50 px-4 py-2.5">
                <p className="text-sm leading-relaxed text-blue-900">
                  {issueDescription}
                </p>
              </div>
            </motion.div>
          )}

          {/* Service request card + inline thinking text — appear after the user describes the issue */}
          {activeFlow.askIssue &&
            issueDescription &&
            (step === "thinking" || thinkingDone) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5"
              >
                <PatchLogo size={28} className="shrink-0 text-foreground" />
                <div className="min-w-0 flex-1 space-y-3">
                  <ServiceRequestCard
                    issueDescription={issueDescription}
                    timing={activeFlow.timingPresetLabel ?? "Tomorrow"}
                  />
                  <ThinkingStatus
                    isDone={thinkingDone}
                    duration={thinkingDuration}
                    statusIndex={thinkingStatusIndex}
                    expanded={thinkingExpanded}
                    onToggle={() => setThinkingExpanded((v) => !v)}
                  />
                </div>
              </motion.div>
            )}

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
          {showTimingQ && !activeFlow.skipBudget && (
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

          {/* Step 4: Finding match — skipped when the thinking card runs the show */}
          {isFindingMatch && !activeFlow.askIssue && (
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
                  {activeFlow.askIssue
                    ? `${bestMatch.ownerName.split(" ")[0]} confirmed your request. Approve to lock it in.`
                    : activeFlow.matchSummary(budgetLabel, timingLabel)}
                </p>

                {!showConfirmation && activeFlow.cardVariant === "gallery" && (
                  <>
                    <PlumberMatchCard
                      provider={bestMatch}
                      approveMode={activeFlow.askIssue}
                      onViewDetails={() =>
                        router.push(`/provider/${bestMatch.id}?gallery=1`)
                      }
                      onBook={handleBookBestMatch}
                    />
                    {activeFlow.askIssue && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={handleReset}
                          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:bg-accent/50"
                        >
                          <X size={14} strokeWidth={1.75} />
                          Cancel
                        </button>
                        <button
                          onClick={handleBookBestMatch}
                          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90"
                        >
                          <Check size={14} strokeWidth={2} />
                          Approve
                        </button>
                      </div>
                    )}
                  </>
                )}
                {!showConfirmation && activeFlow.cardVariant === "default" && (
                  <BestMatchCard
                    provider={bestMatch}
                    onViewDetails={() => router.push(`/provider/${bestMatch.id}`)}
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
                  <button
                    onClick={() => {
                      const conv = getConversationByProviderId(
                        confirmedBooking.providerId
                      );
                      const draft = encodeURIComponent(
                        `Hi, I just booked ${confirmedBooking.serviceSummary.toLowerCase()} for ${confirmedBooking.date}. Looking forward to it!`
                      );
                      const summary = encodeURIComponent(
                        JSON.stringify({
                          service: confirmedBooking.serviceSummary,
                          provider: confirmedBooking.providerName,
                          date: confirmedBooking.date,
                          time: confirmedBooking.time,
                          address: confirmedBooking.address,
                          price: confirmedBooking.priceEstimate,
                        })
                      );
                      if (conv) {
                        router.push(`/messages/${conv.id}?draft=${draft}&booking=${summary}`);
                      } else {
                        const name = encodeURIComponent(
                          confirmedBooking.providerName
                        );
                        router.push(
                          `/messages/new?providerName=${name}&draft=${draft}&booking=${summary}`
                        );
                      }
                    }}
                    className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-accent/40"
                  >
                    <MessageSquare size={14} strokeWidth={1.5} />
                    Message
                  </button>
                  <Link
                    href="/bookings"
                    className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90"
                  >
                    Go to bookings
                  </Link>
                </div>
                <button className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground">
                  <CalendarPlus size={14} strokeWidth={1.5} />
                  Add to calendar
                </button>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Question bottom sheet */}
      <AnimatePresence>
        {step === "ask-budget" && !selectedBudget && !activeFlow.skipBudget && (
          <motion.div
            key="budget-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[75] bg-black/40"
          />
        )}
        {step === "ask-budget" && !selectedBudget && !activeFlow.skipBudget && (
          <motion.div
            key="budget-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[80] rounded-t-2xl border-t border-border bg-background px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-5"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Select a budget
            </p>
            <div className="mx-auto flex max-w-lg flex-col gap-2">
              {activeFlow.budgetOptions.map((opt) => (
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
            key="timing-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[75] bg-black/40"
          />
        )}
        {step === "ask-timing" && !selectedTiming && (
          <motion.div
            key="timing-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[80] rounded-t-2xl border-t border-border bg-background px-5 pb-[max(env(safe-area-inset-bottom),20px)] pt-5"
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {activeFlow.skipBudget ? "Pick a time" : "What timing works?"}
            </p>
            <div className="mx-auto flex max-w-lg flex-col gap-2">
              {activeFlow.timingOptions.map((opt) => (
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
        <div className="shrink-0 bg-background px-5 pb-[max(env(safe-area-inset-bottom),32px)]">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-accent/30 px-3 py-1.5">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={
                isSearching || step === "thinking" ? undefined : handleKeyDown
              }
              placeholder={
                isSearching
                  ? "Searching..."
                  : step === "ask-issue"
                  ? "Describe the issue…"
                  : step === "thinking"
                  ? "Thinking..."
                  : "Ask a follow-up..."
              }
              rows={1}
              disabled={isSearching || step === "thinking"}
              className="flex-1 resize-none bg-transparent py-0 text-sm leading-7 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
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

    </div>
  );
}
