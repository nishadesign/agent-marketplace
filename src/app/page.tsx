"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Pencil, ChevronDown, ChevronRight } from "lucide-react";
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

/* ── Win2000 Title-bar close/min/max buttons ── */
function WinTitleButtons({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center gap-0.5 ml-1">
      <button
        onClick={onClose}
        className="win-button flex items-center justify-center"
        style={{ width: 16, height: 14, padding: 0, fontSize: 10, fontWeight: "bold" }}
        title="Close"
      >
        ✕
      </button>
    </div>
  );
}

/* ── Win2000 Window wrapper ── */
function WinWindow({
  title,
  icon,
  children,
  onClose,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("win-window flex flex-col", className)}>
      {/* Title bar */}
      <div className="win-titlebar">
        {icon && <span className="text-sm">{icon}</span>}
        <span className="flex-1 text-xs font-bold leading-none">{title}</span>
        {/* min/max/close */}
        <div className="flex gap-0.5">
          <button className="win-button" style={{ width: 16, height: 14, padding: 0, fontSize: 9 }}>_</button>
          <button className="win-button" style={{ width: 16, height: 14, padding: 0, fontSize: 9 }}>□</button>
          <button className="win-button" style={{ width: 16, height: 14, padding: 0, fontSize: 9, fontWeight: "bold" }} onClick={onClose}>✕</button>
        </div>
      </div>
      {/* Menu bar */}
      <div
        style={{
          background: "#d4d0c8",
          borderBottom: "1px solid #808080",
          padding: "2px 4px",
          display: "flex",
          gap: 8,
        }}
      >
        {["File", "Edit", "View", "Help"].map((m) => (
          <span
            key={m}
            style={{ fontSize: 11, cursor: "default", padding: "1px 4px" }}
            className="hover:bg-[#000080] hover:text-white"
          >
            {m}
          </span>
        ))}
      </div>
      {/* Body */}
      <div className="flex-1 overflow-hidden p-3">{children}</div>
    </div>
  );
}

/* ── Win2000 Status Bar ── */
function StatusBar({ text }: { text: string }) {
  return (
    <div
      style={{
        background: "#d4d0c8",
        borderTop: "1px solid #808080",
        display: "flex",
        alignItems: "center",
        padding: "2px 6px",
        fontSize: 11,
        gap: 4,
      }}
    >
      <span
        style={{
          flex: 1,
          borderRight: "1px solid #808080",
          paddingRight: 8,
        }}
      >
        {text}
      </span>
      <span>🌐 Internet zone</span>
    </div>
  );
}

/* ── Loading skeleton (Win2000 progress bar style) ── */
function WinProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 8));
    }, 120);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ background: "#ffffff", border: "2px inset #808080", height: 16, overflow: "hidden" }}>
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "repeating-linear-gradient(90deg,#000080 0px,#000080 8px,#316ac5 8px,#316ac5 16px)",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { addBooking } = useBookings();
  const [view, setView] = useState<ViewState>("idle");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [interpretation, setInterpretation] = useState<AgentInterpretation | null>(null);
  const [results, setResults] = useState<Provider[]>([]);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [time, setTime] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

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
    }, 1800);
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

  /* ── DESKTOP (teal background) wrapper ── */
  return (
    <div
      className="flex flex-1 flex-col"
      style={{ background: "#008080", minHeight: "100vh" }}
    >
      {/* ── Desktop area ── */}
      <div className="flex flex-1 flex-col items-center justify-start pt-4 px-2 pb-10">

        {/* Patch main window */}
        {view === "idle" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <WinWindow title="Patch Home Services — Find &amp; Book" icon="🏠">
              <div className="space-y-3">
                {/* Hero banner */}
                <div
                  style={{
                    background: "linear-gradient(to right, #000080, #1084d0)",
                    padding: "10px 12px",
                    color: "#ffffff",
                    fontSize: 14,
                    letterSpacing: 1,
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: "bold" }}>🔧 PATCH v2.0</div>
                  <div style={{ fontSize: 11, opacity: 0.85 }}>Trusted Home Services · San Francisco</div>
                </div>

                {/* Info bar */}
                <div
                  style={{
                    background: "#ece9d8",
                    border: "2px inset #808080",
                    padding: "4px 8px",
                    fontSize: 11,
                    color: "#000080",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>ℹ️</span>
                  <span>Describe what you need and Patch will find the best providers.</span>
                </div>

                {/* Query input panel */}
                <div>
                  <label style={{ fontSize: 11, display: "block", marginBottom: 3 }}>
                    Search Request:
                  </label>
                  <div style={{ position: "relative" }}>
                    <textarea
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={3}
                      className="win-input w-full"
                      style={{ resize: "none", width: "100%", fontSize: 13 }}
                      placeholder={ROTATING_PROMPTS[promptIndex]}
                    />
                  </div>
                </div>

                {/* Buttons row */}
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button
                    className="win-button"
                    onClick={() => setQuery("")}
                  >
                    Clear
                  </button>
                  <button
                    className="win-button"
                    onClick={handleSubmit}
                    disabled={!query.trim()}
                    style={{ minWidth: 80 }}
                  >
                    🔍 Search
                  </button>
                </div>

                {/* Suggestions group box */}
                <fieldset
                  style={{
                    border: "2px groove #808080",
                    padding: "8px 10px",
                    marginTop: 4,
                  }}
                >
                  <legend style={{ fontSize: 11, padding: "0 4px" }}>💡 Quick Searches</legend>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {SUGGESTION_PROMPTS.map((s) => (
                      <button
                        key={s}
                        className="win-button"
                        style={{ textAlign: "left", width: "100%", padding: "4px 8px" }}
                        onClick={() => {
                          setQuery(s);
                          setTimeout(() => inputRef.current?.focus(), 50);
                        }}
                      >
                        ▶ {s}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            </WinWindow>
            <StatusBar text="Ready" />
          </motion.div>
        )}

        {/* ── Loading / Results window ── */}
        {(view === "loading" || view === "results") && (
          <div className="w-full max-w-md flex flex-col" style={{ minHeight: "80vh" }}>
            <WinWindow
              title={`Patch Search — ${submittedQuery.slice(0, 40)}${submittedQuery.length > 40 ? "…" : ""}`}
              icon="🔍"
              onClose={handleReset}
              className="flex-1"
            >
              <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>

                {/* User query display */}
                <div
                  style={{
                    background: "#ece9d8",
                    border: "2px inset #808080",
                    padding: "6px 8px",
                    fontSize: 11,
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 6,
                  }}
                >
                  <span>👤</span>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: 10, color: "#808080", marginBottom: 2 }}>
                      USER QUERY:
                    </div>
                    <div style={{ color: "#000080" }}>{submittedQuery}</div>
                  </div>
                </div>

                {/* Loading state */}
                {view === "loading" && (
                  <div style={{ padding: "8px 0" }}>
                    <div
                      style={{
                        background: "#d4d0c8",
                        border: "2px inset #808080",
                        padding: 12,
                      }}
                    >
                      <div style={{ fontSize: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            display: "inline-block",
                            animation: "win-blink 1s infinite",
                          }}
                        >
                          ⚙️
                        </span>
                        Searching providers database...
                      </div>
                      <WinProgressBar />
                      <div style={{ fontSize: 10, color: "#808080", marginTop: 6 }}>
                        Checking availability, pricing &amp; reviews...
                      </div>
                    </div>

                    {/* Skeleton placeholders */}
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          height: 60,
                          background: "#c4c0b8",
                          border: "1px solid #808080",
                          marginTop: 6,
                          opacity: 1 - i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Results */}
                {view === "results" && interpretation && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

                    {/* Agent reply */}
                    <div
                      style={{
                        background: "#d4e8ff",
                        border: "2px inset #808080",
                        padding: "6px 10px",
                        fontSize: 12,
                        display: "flex",
                        gap: 6,
                        alignItems: "flex-start",
                      }}
                    >
                      <span>🤖</span>
                      <span>
                        Found <strong>{results.length} providers</strong> matching your request.
                      </span>
                    </div>

                    {/* Interpretation group box */}
                    <fieldset style={{ border: "2px groove #808080", padding: "6px 8px" }}>
                      <legend
                        style={{ fontSize: 11, padding: "0 4px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                        onClick={() => setShowInterpretation(!showInterpretation)}
                      >
                        {showInterpretation ? "▼" : "▶"} Agent Interpretation
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditQuery(); }}
                          className="win-button"
                          style={{ marginLeft: 8, fontSize: 10, padding: "1px 6px" }}
                        >
                          ✏️ Edit
                        </button>
                      </legend>
                      {showInterpretation && (
                        <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                          <tbody>
                            {Object.entries(interpretation).map(([key, value]) => (
                              <tr key={key} style={{ borderBottom: "1px solid #c4c0b8" }}>
                                <td style={{ padding: "3px 6px", color: "#808080", whiteSpace: "nowrap" }}>
                                  {key.replace(/([A-Z])/g, " $1").trim()}:
                                </td>
                                <td style={{ padding: "3px 6px", fontWeight: "bold", color: "#000080" }}>
                                  {value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </fieldset>

                    {/* Sort toolbar */}
                    <div
                      style={{
                        background: "#d4d0c8",
                        borderBottom: "1px solid #808080",
                        padding: "3px 6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: 11,
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>{results.length} Results Found</span>
                      <button className="win-button" style={{ fontSize: 10 }}>
                        Sort: Best Match ▼
                      </button>
                    </div>

                    {/* Provider cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {results.map((provider) => (
                        <Win2kProviderCard
                          key={provider.id}
                          provider={provider}
                          onClick={setSelectedProvider}
                        />
                      ))}
                    </div>

                    {/* Recommendation dialog */}
                    {results.length > 0 && (
                      <div
                        style={{
                          background: "#ece9d8",
                          border: "2px inset #808080",
                          padding: "10px 12px",
                        }}
                      >
                        <div style={{ fontSize: 12, marginBottom: 8, display: "flex", gap: 6 }}>
                          <span>🤖</span>
                          <span>
                            <strong>{results[0].name}</strong> is your best match — highest rated, fits your budget, and available tomorrow morning. Book now?
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <a href={`/provider/${results[0].id}`}>
                            <button
                              className="win-button"
                              style={{ background: "#000080", color: "#ffffff", padding: "4px 16px" }}
                            >
                              ✅ Yes, Book Now
                            </button>
                          </a>
                          <a href={`/provider/${results[0].id}`}>
                            <button className="win-button" style={{ padding: "4px 16px" }}>
                              👤 View Profile
                            </button>
                          </a>
                          <button className="win-button" onClick={handleReset} style={{ padding: "4px 12px" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Follow-up input */}
              {view === "results" && (
                <div
                  style={{
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: "1px solid #808080",
                    display: "flex",
                    gap: 6,
                    alignItems: "flex-end",
                  }}
                >
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a follow-up..."
                    rows={1}
                    className="win-input flex-1"
                    style={{ resize: "none", fontSize: 12 }}
                  />
                  <button
                    className="win-button"
                    onClick={handleSubmit}
                    disabled={!query.trim()}
                  >
                    Send ▶
                  </button>
                </div>
              )}
            </WinWindow>
            <StatusBar
              text={
                view === "loading"
                  ? "Searching..." : `${results.length} providers found`
              }
            />
          </div>
        )}
      </div>

      {/* ── Taskbar ── */}
      <div
        className="win-taskbar fixed bottom-0 left-0 right-0 z-50 flex items-center"
        style={{ height: 28, padding: "0 4px", gap: 4 }}
      >
        {/* Start button */}
        <button
          className="win-raised"
          style={{
            background: "#d4d0c8",
            fontSize: 12,
            fontWeight: "bold",
            padding: "2px 8px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            border: "none",
            boxShadow: "inset -1px -1px 0 #000, inset 1px 1px 0 #fff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf",
            cursor: "default",
          }}
        >
          <span>🪟</span>
          <span>Start</span>
        </button>

        <div style={{ width: 1, height: "80%", background: "#808080", margin: "0 2px" }} />

        {/* Active window button */}
        <button
          style={{
            background: "#d4d0c8",
            fontSize: 11,
            padding: "2px 8px",
            display: "flex",
            alignItems: "center",
            gap: 4,
            boxShadow: "inset 1px 1px 0 #808080, inset -1px -1px 0 #ffffff",
            border: "1px solid #808080",
            cursor: "default",
            minWidth: 120,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          🏠 Patch Home Services
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* System tray */}
        <div
          style={{
            background: "#d4d0c8",
            border: "1px inset #808080",
            padding: "2px 8px",
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>🔊</span>
          <span>🌐</span>
          <span style={{ fontFamily: "monospace" }}>{time}</span>
        </div>
      </div>

      {/* Provider detail sheet */}
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

/* ── Win2000-styled provider card ── */
function Win2kProviderCard({
  provider,
  onClick,
}: {
  provider: Provider;
  onClick?: (p: Provider) => void;
}) {
  const categoryIcons: Record<string, string> = {
    plumbing: "🔧",
    cleaning: "🧹",
    electrical: "⚡",
    handyman: "🛠️",
    "tv-mounting": "📺",
    painting: "🎨",
    "pest-control": "🐛",
    "appliance-repair": "🔌",
  };
  const icon = categoryIcons[provider.category] ?? "🏠";

  const handleClick = () => onClick?.(provider);

  return (
    <button
      onClick={handleClick}
      type="button"
      style={{
        background: "#d4d0c8",
        border: "2px outset #ffffff",
        padding: "6px 8px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        textAlign: "left",
        cursor: "default",
        fontSize: 11,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#000080";
        (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#d4d0c8";
        (e.currentTarget as HTMLButtonElement).style.color = "#000000";
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: "bold", fontSize: 12 }}>{provider.name}</div>
        <div style={{ opacity: 0.7, fontSize: 10 }}>
          {provider.category.replace("-", " ")} · {provider.distance} away
        </div>
        <div style={{ fontSize: 10 }}>
          ⭐ {provider.rating} ({provider.reviewCount} reviews)
        </div>
      </div>
      <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: "bold" }}>{provider.priceRange}</div>
        {provider.aiTag && (
          <div
            style={{
              background: "#000080",
              color: "#ffffff",
              fontSize: 9,
              padding: "1px 4px",
              marginTop: 2,
            }}
          >
            {provider.aiTag}
          </div>
        )}
      </div>
    </button>
  );
}
