"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock,
  ChevronRight,
  Search,
  CircleCheck,
} from "lucide-react";

import { useBookings } from "@/components/bookings-context";
import type { Booking, StatusTimelineEntry } from "@/types";
import { cn } from "@/lib/utils";

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <Link href={`/booking/${booking.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4"
      >
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
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock size={12} strokeWidth={1.5} className="shrink-0" />
            <span>
              {booking.date} · {booking.time}
            </span>
          </div>
        </div>

        <ChevronRight
          size={16}
          strokeWidth={1.5}
          className="shrink-0 text-muted-foreground/50"
        />
      </motion.div>
    </Link>
  );
}

function ServiceTracker({ booking }: { booking: Booking }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border bg-background"
    >
      {/* Provider header */}
      <div className="flex items-center gap-3 border-b border-border p-4">
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
        {booking.eta && (
          <span className="shrink-0 rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background">
            ETA {booking.eta}
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="relative p-4 pl-5">
        {booking.statusTimeline.map((step, i) => (
          <TimelineStep
            key={step.label}
            step={step}
            isLast={i === booking.statusTimeline.length - 1}
          />
        ))}
      </div>
    </motion.div>
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
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {/* Vertical line */}
      {!isLast && (
        <div
          className={cn(
            "absolute left-[5px] top-[14px] w-[1.5px] bottom-0",
            isCompleted || isActive ? "bg-foreground/15" : "bg-border"
          )}
        />
      )}

      {/* Dot */}
      <div className="relative z-10 flex shrink-0 pt-[2px]">
        {isActive ? (
          <div className="flex h-[11px] w-[11px] items-center justify-center rounded-full bg-foreground" />
        ) : isCompleted ? (
          <div className="flex h-[11px] w-[11px] items-center justify-center rounded-full bg-emerald-500/80">
            <div className="h-[5px] w-[5px] rounded-full bg-emerald-500" />
          </div>
        ) : (
          <div className="flex h-[11px] w-[11px] items-center justify-center rounded-full border-[1.5px] border-muted-foreground/25 bg-background" />
        )}
      </div>

      {/* Content */}
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
            isFuture && "text-muted-foreground/50 uppercase text-[11px] font-medium tracking-wide mt-0.5"
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
  const { getUpcoming, getActive, getPast } = useBookings();

  const active = getActive();
  const upcoming = getUpcoming();
  const past = getPast();

  return (
    <div className="flex flex-1 flex-col px-5 pt-14 pb-20">
      <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your upcoming and past services.
      </p>

      {/* Active — service tracker */}
      {active.length > 0 && (
        <div className="mt-8">
          <SectionHeader title="Active" count={active.length} />
          <div className="mt-3 space-y-3">
            {active.map((booking) => (
              <ServiceTracker key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      <div className={active.length > 0 ? "mt-10" : "mt-8"}>
        <SectionHeader title="Upcoming" count={upcoming.length} />
        <div className="mt-3 space-y-3">
          {upcoming.length === 0 ? (
            <EmptyUpcoming />
          ) : (
            upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </div>
      </div>

      {/* Past Bookings */}
      <div className="mt-10">
        <SectionHeader title="Past Bookings" count={past.length} />
        <div className="mt-3 space-y-6">
          {past.length === 0 ? (
            <EmptyPast />
          ) : (
            past.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
