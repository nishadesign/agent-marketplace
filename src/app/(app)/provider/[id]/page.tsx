"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  Shield,
  ShieldCheck,
  UserCheck,
  Check,
  X,
  CalendarCheck,
  Clock,
} from "lucide-react";

import { getProviderById } from "@/data/providers";
import { COVER_IMAGES } from "@/components/home/provider-card";
import { useBookings } from "@/components/bookings-context";
import type { TrustBadge as TrustBadgeType } from "@/types";
import { cn } from "@/lib/utils";

const PORTFOLIO_IMAGES = [
  "/providers/portfolio/plumber-sink.png",
  "/providers/portfolio/sink.png",
  "/providers/portfolio/pipes.png",
];

const categoryLabels: Record<string, string> = {
  plumbing: "Plumber",
  cleaning: "Cleaning Service",
  electrical: "Electrician",
  handyman: "Handyman",
  "tv-mounting": "TV & AV Mounting",
  painting: "Painter",
  "pest-control": "Pest Control",
  "appliance-repair": "Appliance Repair",
};

const badgeConfig: Record<
  TrustBadgeType,
  { icon: typeof Shield; label: string; desc: string }
> = {
  licensed: {
    icon: Shield,
    label: "Licensed professional",
    desc: "State-verified license on file",
  },
  insured: {
    icon: ShieldCheck,
    label: "Fully insured",
    desc: "Liability coverage for your property",
  },
  "background-checked": {
    icon: UserCheck,
    label: "Background checked",
    desc: "Identity and history verified",
  },
};

export default function ProviderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { addBooking } = useBookings();

  const provider = useMemo(
    () => getProviderById(params.id),
    [params.id]
  );

  const [currentImage, setCurrentImage] = useState(0);
  const [confirmed, setConfirmed] = useState<{
    dayLabel: string;
    date: string;
    start: string;
    end: string;
  } | null>(null);

  const showGallery = searchParams.get("gallery") === "1";
  const portfolioImages = showGallery ? PORTFOLIO_IMAGES : null;
  const coverImage = COVER_IMAGES[0];

  useEffect(() => {
    if (!provider) router.replace("/");
  }, [provider, router]);

  if (!provider) return null;

  const paginateImage = (direction: number) => {
    if (!portfolioImages) return;
    setCurrentImage((prev) => {
      const next = prev + direction;
      if (next < 0) return 0;
      if (next >= portfolioImages.length) return portfolioImages.length - 1;
      return next;
    });
  };

  const firstAvailable = useMemo(() => {
    for (const day of provider?.availability ?? []) {
      const slot = day.slots.find((s) => s.available);
      if (slot) return { day, slot };
    }
    return null;
  }, [provider]);

  const handleApprove = () => {
    if (!firstAvailable) return;
    addBooking(provider!, {
      dayLabel: firstAvailable.day.dayLabel,
      date: firstAvailable.day.date,
      start: firstAvailable.slot.start,
      end: firstAvailable.slot.end,
    });
    setConfirmed({
      dayLabel: firstAvailable.day.dayLabel,
      date: firstAvailable.day.date,
      start: firstAvailable.slot.start,
      end: firstAvailable.slot.end,
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Hero — bleeds to the very top, behind the status bar / island */}
      <div className="relative">
        <div className="relative h-[340px] w-full overflow-hidden">
          {portfolioImages ? (
            <>
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
                  onDragEnd={(_e, info) => {
                    if (info.offset.x < -50) paginateImage(1);
                    else if (info.offset.x > 50) paginateImage(-1);
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={portfolioImages[currentImage]}
                    alt={`${provider.name} photo ${currentImage + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 512px) 100vw, 512px"
                    priority={currentImage === 0}
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
                {portfolioImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === currentImage
                        ? "w-4 bg-white"
                        : "w-1.5 bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          ) : (
            <Image
              src={coverImage}
              alt={provider.name}
              fill
              className="object-cover"
              sizes="(max-width: 512px) 100vw, 512px"
              priority
            />
          )}
        </div>
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-[max(env(safe-area-inset-top),60px)] z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/60 backdrop-blur-md transition-colors hover:bg-white/80"
        >
          <ArrowLeft size={18} strokeWidth={1.75} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 pb-32">
        {/* Name + avatar */}
        <div className="flex items-center gap-3.5 px-6 pt-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
            {provider.ownerName.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-[22px] font-semibold leading-tight tracking-tight">
              {provider.name}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {categoryLabels[provider.category]} · {provider.serviceArea}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mx-6 mt-5 flex items-center justify-between rounded-xl border border-border py-3">
          <div className="flex flex-1 flex-col items-center">
            <span className="text-base font-semibold">{provider.rating}</span>
            <div className="mt-0.5 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={cn(
                    i < Math.round(provider.rating)
                      ? "fill-foreground text-foreground"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-1 flex-col items-center">
            <span className="text-base font-semibold">
              {provider.yearsExperience}
            </span>
            <span className="mt-0.5 text-[11px] text-muted-foreground">
              Years exp.
            </span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-1 flex-col items-center">
            <span className="text-base font-semibold">
              {provider.reviewCount}
            </span>
            <span className="mt-0.5 text-[11px] text-muted-foreground">
              Reviews
            </span>
          </div>
        </div>

        <div className="mx-6 mt-5 border-t border-border" />

        {/* Feature highlights */}
        <div className="space-y-5 px-6 py-5">
          <div className="flex items-start gap-3.5">
            <MapPin
              size={22}
              strokeWidth={1.5}
              className="mt-0.5 shrink-0 text-foreground"
            />
            <div>
              <p className="text-sm font-medium text-foreground">
                Serves {provider.serviceArea}
              </p>
              <p className="text-xs text-muted-foreground">
                {provider.distance} from your location
              </p>
            </div>
          </div>
          {provider.badges.map((badge) => {
            const config = badgeConfig[badge];
            const Icon = config.icon;
            return (
              <div key={badge} className="flex items-start gap-3.5">
                <Icon
                  size={22}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-foreground"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {config.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{config.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-6 border-t border-border" />

        {/* Bio */}
        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-foreground">
            {provider.bio}
          </p>
        </div>

        <div className="mx-6 border-t border-border" />

        {/* Pricing */}
        <div className="px-6 py-5">
          <h3 className="text-base font-semibold">Pricing</h3>
          <div className="mt-3">
            {provider.pricingStructure.map((item, i) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between py-3",
                  i < provider.pricingStructure.length - 1 &&
                    "border-b border-border/50"
                )}
              >
                <span className="text-sm text-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-6 border-t border-border" />

        {/* Top review */}
        {provider.reviews.length > 0 && (
          <div className="px-6 py-5">
            <h3 className="text-base font-semibold">What customers say</h3>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: provider.reviews[0].rating }).map(
                    (_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className="fill-foreground text-foreground"
                      />
                    )
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {provider.reviews[0].authorName} · {provider.reviews[0].date}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                &ldquo;{provider.reviews[0].text}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom dock — Approve / Cancel */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-lg border-t border-border bg-background px-5 pt-3 pb-[max(env(safe-area-inset-bottom),24px)]">
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-accent/50"
          >
            <X size={15} strokeWidth={1.75} />
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={!firstAvailable}
            className={cn(
              "flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition-opacity",
              firstAvailable
                ? "bg-foreground text-background hover:opacity-90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            )}
          >
            <Check size={15} strokeWidth={2} />
            Approve
          </button>
        </div>
      </div>

      {/* Inline confirmation overlay */}
      <AnimatePresence>
        {confirmed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-[65] mx-auto w-full max-w-lg rounded-t-3xl border-t border-border bg-background px-6 pt-6 pb-[max(env(safe-area-inset-bottom),28px)] shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                  <CalendarCheck
                    size={22}
                    strokeWidth={1.75}
                    className="text-emerald-600"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                    Confirmed
                  </p>
                  <h3 className="mt-0.5 truncate text-base font-semibold text-foreground">
                    {provider.name}
                  </h3>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} strokeWidth={1.5} className="shrink-0" />
                <span>
                  {confirmed.dayLabel} · {confirmed.start} – {confirmed.end}
                </span>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => router.back()}
                  className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-accent/50"
                >
                  Done
                </button>
                <Link
                  href="/bookings"
                  className="flex h-11 flex-1 items-center justify-center rounded-xl bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90"
                >
                  Go to bookings
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
