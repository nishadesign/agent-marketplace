"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { CalendarCheck, Clock, MapPin } from "lucide-react";

import { getConversationById } from "@/data/messages";
import { PatchLogo } from "@/components/patch-logo";
import type { Message, BookingSummary } from "@/types";
import { cn } from "@/lib/utils";

function BookingSummaryCard({ message }: { message: Message }) {
  const summary = message.bookingSummary!;
  return (
    <div className="flex gap-2.5 py-1">
      <PatchLogo size={24} className="mt-0.5 shrink-0 text-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-muted-foreground">
          {message.timestamp}
        </p>
        <div className="mt-1.5 rounded-2xl border border-border bg-background">
          <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <CalendarCheck size={14} strokeWidth={1.5} className="text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
                Booking confirmed
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                {summary.service}
              </p>
            </div>
          </div>
          <div className="space-y-1.5 border-t border-border px-3.5 py-2.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={12} strokeWidth={1.5} className="shrink-0" />
              <span>{summary.date} · {summary.time}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin size={12} strokeWidth={1.5} className="shrink-0" />
              <span>{summary.address}</span>
            </div>
            <p className="mt-1 text-xs font-medium text-foreground">
              {summary.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: Message }) {
  if (message.sender === "system" && message.bookingSummary) {
    return <BookingSummaryCard message={message} />;
  }

  if (message.sender === "system") {
    return (
      <div className="flex justify-center py-2">
        <p className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
          {message.text}
        </p>
      </div>
    );
  }

  const isUser = message.sender === "user";

  return (
    <div
      className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2.5",
          isUser
            ? "rounded-br-md bg-blue-50 text-blue-900"
            : "rounded-bl-md bg-muted text-foreground"
        )}
      >
        <p className="text-[13px] leading-relaxed">{message.text}</p>
      </div>
      <span className="px-1 text-[10px] text-muted-foreground/60">
        {message.timestamp}
      </span>
    </div>
  );
}

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  const isNew = params.id === "new";
  const conversation = isNew ? null : getConversationById(params.id as string);
  const providerName =
    conversation?.providerName ?? searchParams.get("providerName") ?? "";
  const isClosed = conversation?.closed ?? false;
  const draft = searchParams.get("draft");
  const bookingParam = searchParams.get("booking");

  let parsedBooking: BookingSummary | null = null;
  if (bookingParam) {
    try {
      parsedBooking = JSON.parse(decodeURIComponent(bookingParam));
    } catch {
      /* ignore malformed param */
    }
  }

  const bookingMessage: Message | null = parsedBooking
    ? {
        id: "booking-summary",
        sender: "system",
        text: "Booking confirmed",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        bookingSummary: parsedBooking,
      }
    : null;

  const baseMessages = conversation?.messages ?? [];
  const messages = [
    ...(bookingMessage ? [bookingMessage] : []),
    ...baseMessages,
    ...localMessages,
  ];

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    const newMsg: Message = {
      id: `local-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  useEffect(() => {
    if (draft) {
      setInputValue(decodeURIComponent(draft));
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [draft]);

  if (!isNew && !conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Conversation not found.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 pb-3 pt-20">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-muted"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
          {providerName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-foreground">
            {providerName}
          </h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ChatBubble message={msg} />
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-20">
            <p className="text-xs text-muted-foreground">
              Send your first message to {providerName}.
            </p>
          </div>
        )}
      </div>

      {/* Input or closed state */}
      {isClosed ? (
        <div className="border-t border-border px-4 py-4 pb-8">
          <p className="text-center text-xs text-muted-foreground">
            Service has ended
          </p>
        </div>
      ) : (
        <div className="border-t border-border px-4 py-3 pb-8">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="h-10 flex-1 rounded-full border border-border bg-muted/50 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                inputValue.trim()
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Send size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
