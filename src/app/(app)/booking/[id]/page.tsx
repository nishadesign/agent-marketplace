"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  MapPin,
  DollarSign,
  MessageCircle,
  MessageSquareText,
  StickyNote,
  CalendarCheck,
  CalendarPlus,
  RotateCcw,
  X,
  Sparkles,
  Receipt,
  Download,
} from "lucide-react";

import { useBookings } from "@/components/bookings-context";
import type { BookingStatus, StatusTimelineEntry, Receipt as ReceiptType } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-500/10 text-blue-600",
  },
  "provider-en-route": {
    label: "En Route",
    className: "bg-foreground text-background",
  },
  "arriving-soon": {
    label: "Arriving Soon",
    className: "bg-amber-500/10 text-amber-600",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-violet-500/10 text-violet-600",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-600",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive",
  },
};

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
          <div className="flex h-[11px] w-[11px] items-center justify-center rounded-full bg-foreground" />
        ) : isCompleted ? (
          <div className="flex h-[11px] w-[11px] items-center justify-center rounded-full bg-emerald-500/80">
            <div className="h-[5px] w-[5px] rounded-full bg-emerald-500" />
          </div>
        ) : (
          <div className="flex h-[11px] w-[11px] items-center justify-center rounded-full border-[1.5px] border-muted-foreground/25 bg-background" />
        )}
      </div>

      <div className="-mt-[1px] min-w-0 flex-1">
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

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon size={15} strokeWidth={1.5} className="text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

function ReceiptCard({ receipt }: { receipt: ReceiptType }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground">
          <Receipt size={11} strokeWidth={2} className="text-background" />
        </div>
        <h3 className="flex-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Receipt
        </h3>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Download receipt"
        >
          <Download size={16} strokeWidth={1.5} />
        </button>
      </div>

      <div className="space-y-2.5">
        {receipt.items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-sm text-foreground/70">{item.label}</span>
            <span className="text-sm tabular-nums text-foreground/70">
              {item.amount}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Total</span>
          <span className="text-sm font-semibold tabular-nums text-foreground">
            {receipt.total}
          </span>
        </div>
        {receipt.paidAt && (
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Paid {receipt.paidAt}
          </p>
        )}
      </div>
    </div>
  );
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { bookings } = useBookings();

  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-5">
        <p className="text-sm text-muted-foreground">Booking not found.</p>
        <button
          onClick={() => router.push("/bookings")}
          className="mt-4 text-sm font-medium text-foreground underline underline-offset-4"
        >
          Back to bookings
        </button>
      </div>
    );
  }

  const status = statusConfig[booking.status];
  const isActive = ["provider-en-route", "arriving-soon", "in-progress"].includes(
    booking.status
  );
  const isCompleted = booking.status === "completed";
  const isCancelled = booking.status === "cancelled";

  return (
    <div className="flex flex-1 flex-col px-5 pt-20 pb-40">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="fixed left-4 top-[max(env(safe-area-inset-top),16px)] z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/45 shadow-[0_4px_24px_rgba(0,0,0,0.12),0_1px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-2xl transition-all hover:bg-white/60 hover:shadow-[0_6px_28px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]"
      >
        <ArrowLeft size={20} strokeWidth={1.5} />
      </button>

      <h1 className="text-2xl font-semibold tracking-tight">
        Booking Details
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-6 flex flex-col gap-6"
      >
        {/* Provider + Status */}
        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
              {booking.providerName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-semibold text-foreground">
                  {booking.providerName}
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {booking.serviceType} · {booking.serviceSummary}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                status.className
              )}
            >
              {status.label}
            </span>
          </div>

          {/* ETA for active bookings */}
          {isActive && booking.eta && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground">
                <Clock size={12} strokeWidth={2} className="text-background" />
              </div>
              <p className="text-xs font-medium text-foreground">
                Arriving in {booking.eta}
              </p>
            </div>
          )}
        </div>

        {/* Status Timeline — hidden for completed bookings */}
        {!isCompleted && (
          <div className="rounded-2xl border border-border bg-background p-4">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </h3>
            <div className="pl-1">
              {booking.statusTimeline.map((step, i) => (
                <TimelineStep
                  key={step.label}
                  step={step}
                  isLast={i === booking.statusTimeline.length - 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Booking Info — non-completed bookings */}
        {!isCompleted && (
          <div className="rounded-2xl border border-border bg-background p-4">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Details
            </h3>
            <div className="space-y-4">
              {booking.userQuery && (
                <InfoRow
                  icon={MessageSquareText}
                  label="Your Request"
                  value={booking.userQuery}
                />
              )}
              <InfoRow
                icon={CalendarCheck}
                label="Date & Time"
                value={`${booking.date} · ${booking.time}`}
              />
              <InfoRow icon={MapPin} label="Address" value={booking.address} />
              <InfoRow
                icon={DollarSign}
                label="Price Estimate"
                value={booking.priceEstimate}
              />
              {booking.notes && (
                <InfoRow icon={StickyNote} label="Notes" value={booking.notes} />
              )}
            </div>
          </div>
        )}

        {/* Service Summary with date — completed bookings only */}
        {isCompleted && booking.agentSummary && (
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-foreground">
                <Sparkles size={11} strokeWidth={2} className="text-background" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Service Summary
              </h3>
            </div>
            <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarCheck size={13} strokeWidth={1.5} className="shrink-0" />
              {booking.date} · {booking.time}
            </p>
            <p className="text-sm leading-relaxed text-foreground/80">
              {booking.agentSummary}
            </p>
          </div>
        )}

        {/* Receipt — completed bookings only */}
        {isCompleted && booking.receipt && (
          <ReceiptCard receipt={booking.receipt} />
        )}

        {/* Booking ID */}
        <p className="text-center text-[11px] text-muted-foreground/50">
          {booking.id.toUpperCase()}
        </p>

      </motion.div>

      {/* Sticky bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg flex-col gap-2 px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-3">
          <div className="flex gap-2">
            {!isCompleted && !isCancelled && (
              <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <X size={16} strokeWidth={1.5} />
                Cancel
              </button>
            )}

            {!isCompleted && !isCancelled && (
              <Link
                href={`/messages/${booking.providerId}`}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                Message
              </Link>
            )}

            {isCompleted && (
              <Link
                href={`/provider/${booking.providerId}`}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <RotateCcw size={15} strokeWidth={1.5} />
                Book Again
              </Link>
            )}
          </div>

          {!isCompleted && !isCancelled && (
            <button className="flex h-10 w-full items-center justify-center gap-1.5 rounded-2xl border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <CalendarPlus size={14} strokeWidth={1.5} />
              Add to calendar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
