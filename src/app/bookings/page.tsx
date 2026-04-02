"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Clock,
  MapPin,
  MessageCircle,
  ChevronRight,
  Search,
  CircleCheck,
} from "lucide-react";

import { useBookings } from "@/components/bookings-context";
import type { Booking, BookingStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  BookingStatus,
  { label: string; color: string; bg: string }
> = {
  confirmed: {
    label: "Confirmed",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  "provider-en-route": {
    label: "En route",
    color: "text-blue-700",
    bg: "bg-blue-50",
  },
  "arriving-soon": {
    label: "Arriving soon",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  "in-progress": {
    label: "In progress",
    color: "text-violet-700",
    bg: "bg-violet-50",
  },
  completed: {
    label: "Completed",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50",
  },
};

function BookingCard({ booking }: { booking: Booking }) {
  const status = statusConfig[booking.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-background p-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
          {booking.providerName.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {booking.providerName}
              </h3>
              <p className="text-xs text-muted-foreground">
                {booking.serviceSummary}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
                status.bg,
                status.color
              )}
            >
              {status.label}
            </span>
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock size={13} strokeWidth={1.5} className="shrink-0" />
              <span>
                {booking.date} · {booking.time}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin size={13} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{booking.address}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <p className="text-xs font-medium text-foreground">
              {booking.priceEstimate}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`/messages/${booking.providerId}`}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <MessageCircle size={13} strokeWidth={1.5} />
                Message
              </Link>
              <Link
                href={`/booking/${booking.id}`}
                className="flex h-8 items-center gap-1 rounded-lg bg-foreground px-3 text-xs font-medium text-background transition-opacity hover:opacity-90"
              >
                Details
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
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
    <div className="flex flex-1 flex-col px-5 pt-14 pb-20">
      <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your upcoming and past services.
      </p>

      {/* Upcoming */}
      <div className="mt-8">
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
        <div className="mt-3 space-y-3">
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
