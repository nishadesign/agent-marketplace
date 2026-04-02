"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Search,
  CircleCheck,
} from "lucide-react";

import { useBookings } from "@/components/bookings-context";
import type { Booking, StatusTimelineEntry } from "@/types";
import { cn } from "@/lib/utils";

function getRelativeDay(dateStr: string): string {
  if (dateStr === "Today") return "Today";
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

function BookingCard({
  booking,
  showTimeline = false,
  showDateTag = true,
}: {
  booking: Booking;
  showTimeline?: boolean;
  showDateTag?: boolean;
}) {
  const relativeDay = getRelativeDay(booking.date);

  return (
    <Link href={`/booking/${booking.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-border bg-background"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
            {booking.providerName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {booking.providerName}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {booking.serviceSummary}
            </p>
          </div>
          {showDateTag && (
            <span className="shrink-0 rounded-full bg-foreground/[0.06] px-3 py-1 text-[11px] font-medium text-foreground">
              {relativeDay}
            </span>
          )}
        </div>

        {/* Vertical timeline */}
        {showTimeline &&
          booking.statusTimeline &&
          booking.statusTimeline.length > 0 && (
            <div className="border-t border-border px-4 py-4 pl-5">
              {booking.statusTimeline.map((step, i) => (
                <TimelineStep
                  key={step.label}
                  step={step}
                  isLast={i === booking.statusTimeline.length - 1}
                />
              ))}
            </div>
          )}
      </motion.div>
    </Link>
  );
}

function TimelineStep({
  step,
  isLast,
}: {
  step: StatusTimelineEntry;
  isLast: boolean;
}) {
  const isActive = step.active === true;
  const isCompleted = step.completed && !isActive;
  const isFuture = !step.completed;

  return (
    <div className="relative flex gap-4 pb-5 last:pb-0">
      {!isLast && (
        <div
          className={cn(
            "absolute bottom-0 left-[5px] top-[14px] w-[1.5px]",
            isCompleted || isActive ? "bg-foreground/15" : "bg-border"
          )}
        />
      )}

      <div className="relative z-10 flex shrink-0 pt-[2px]">
        {isActive ? (
          <div className="h-[11px] w-[11px] rounded-full bg-foreground" />
        ) : isCompleted ? (
          <div className="flex h-[11px] w-[11px] items-center justify-center rounded-full bg-emerald-500/80">
            <div className="h-[5px] w-[5px] rounded-full bg-emerald-500" />
          </div>
        ) : (
          <div className="h-[11px] w-[11px] rounded-full border-[1.5px] border-muted-foreground/25 bg-background" />
        )}
      </div>

      <div className="min-w-0 flex-1 -mt-[1px]">
        {step.time && (
          <span className="text-[11px] text-muted-foreground">
            {step.time}
          </span>
        )}
        <p
          className={cn(
            "text-sm leading-snug",
            isActive && "font-semibold text-foreground",
            isCompleted && "text-foreground",
            isFuture &&
              "mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/50"
          )}
        >
          {step.label}
        </p>
        {step.description && (
          <p
            className={cn(
              "mt-0.5 text-xs",
              isFuture ? "text-muted-foreground/40" : "text-muted-foreground"
            )}
          >
            {step.description}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <span className="text-sm text-muted-foreground">({count})</span>
    </div>
  );
}

function EmptyUpcoming() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-8 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <CalendarCheck
          size={22}
          strokeWidth={1.5}
          className="text-muted-foreground"
        />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">
        No upcoming bookings
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Need something fixed?
      </p>
      <Link
        href="/"
        className="mt-4 flex h-9 items-center gap-1.5 rounded-full bg-foreground px-5 text-xs font-medium text-background transition-opacity hover:opacity-90"
      >
        <Search size={13} />
        Find a provider
      </Link>
    </div>
  );
}

function EmptyPast() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border px-8 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <CircleCheck
          size={22}
          strokeWidth={1.5}
          className="text-muted-foreground"
        />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">
        No past bookings yet
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Your completed services will show up here.
      </p>
    </div>
  );
}

export default function BookingsPage() {
  const { getUpcoming, getPast } = useBookings();

  const upcoming = getUpcoming();
  const past = getPast();

  return (
    <div className="flex flex-1 flex-col px-5 pt-20 pb-20">
      <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your upcoming and past services.
      </p>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div className="mt-8 space-y-3">
          {upcoming.map((booking) => (
            <BookingCard key={booking.id} booking={booking} showTimeline />
          ))}
        </div>
      )}

      {/* Past Bookings */}
      <div className="mt-10">
        <SectionHeader title="Past Bookings" count={past.length} />
        <div className="mt-3 space-y-6">
          {past.length === 0 ? (
            <EmptyPast />
          ) : (
            past.map((booking) => (
              <BookingCard key={booking.id} booking={booking} showDateTag={false} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
