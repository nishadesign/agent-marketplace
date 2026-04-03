"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Shield,
  ShieldCheck,
  UserCheck,
  Check,
} from "lucide-react";

import type { Provider, TrustBadge as TrustBadgeType } from "@/types";
import { cn } from "@/lib/utils";

export interface BookingSlotInfo {
  dayLabel: string;
  date: string;
  start: string;
  end: string;
}

interface ProviderDetailSheetProps {
  provider: Provider;
  coverImage: string;
  portfolioImages?: string[];
  onClose: () => void;
  onBook: (provider: Provider, slot: BookingSlotInfo) => void;
}

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

const categoryGradients: Record<string, string> = {
  plumbing: "from-blue-100 to-sky-200",
  cleaning: "from-emerald-100 to-green-200",
  electrical: "from-amber-100 to-yellow-200",
  handyman: "from-orange-100 to-amber-200",
  "tv-mounting": "from-violet-100 to-purple-200",
  painting: "from-pink-100 to-rose-200",
  "pest-control": "from-lime-100 to-emerald-200",
  "appliance-repair": "from-slate-100 to-gray-200",
};

const badgeConfig: Record<TrustBadgeType, { icon: typeof Shield; label: string; desc: string }> = {
  licensed: { icon: Shield, label: "Licensed professional", desc: "State-verified license on file" },
  insured: { icon: ShieldCheck, label: "Fully insured", desc: "Liability coverage for your property" },
  "background-checked": { icon: UserCheck, label: "Background checked", desc: "Identity and history verified" },
};

export function ProviderDetailSheet({ provider, coverImage, portfolioImages, onClose, onBook }: ProviderDetailSheetProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const hasCarousel = portfolioImages && portfolioImages.length > 1;

  const paginateImage = (direction: number) => {
    if (!portfolioImages) return;
    setCurrentImage((prev) => {
      const next = prev + direction;
      if (next < 0) return 0;
      if (next >= portfolioImages.length) return portfolioImages.length - 1;
      return next;
    });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const currentDay = provider.availability[selectedDay];

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 10 && !expanded) setExpanded(true);
    if (scrollTop <= 0 && expanded) setExpanded(false);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[70] bg-black/40"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "fixed inset-x-0 bottom-0 z-[80] flex w-full flex-col bg-background shadow-2xl transition-[height,border-radius] duration-300 ease-out",
          expanded ? "h-[100dvh] rounded-none" : "h-[92dvh] rounded-t-3xl"
        )}
      >
        <div
          className="no-scrollbar flex-1 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
          onScroll={handleScroll}
        >
          {/* Hero */}
          <div className="relative">
            <div className={cn(
              "relative h-56 w-full overflow-hidden transition-[border-radius] duration-300",
              expanded ? "rounded-none" : "rounded-t-3xl"
            )}>
              {hasCarousel ? (
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
                          i === currentImage ? "w-4 bg-white" : "w-1.5 bg-white/50"
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
              onClick={onClose}
              className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
            >
              <ArrowLeft size={16} />
            </button>
          </div>

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
              <span className="text-base font-semibold">{provider.yearsExperience}</span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">Years exp.</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-1 flex-col items-center">
              <span className="text-base font-semibold">{provider.reviewCount}</span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">Reviews</span>
            </div>
          </div>

          <div className="mx-6 mt-5 border-t border-border" />

          {/* Available slots */}
          <div className="px-6 py-5">
            <h3 className="text-base font-semibold">Available slots</h3>

            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {provider.availability.map((day, i) => {
                const available = day.slots.filter((s) => s.available).length;
                return (
                  <button
                    key={day.date}
                    onClick={() => {
                      setSelectedDay(i);
                      setSelectedSlotId(null);
                    }}
                    className={cn(
                      "flex shrink-0 flex-col items-center rounded-xl border px-4 py-2.5 transition-colors",
                      selectedDay === i
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-foreground hover:bg-accent/50"
                    )}
                  >
                    <span className="text-xs font-medium">{day.dayLabel}</span>
                    <span
                      className={cn(
                        "mt-0.5 text-[11px]",
                        selectedDay === i ? "text-background/70" : "text-muted-foreground"
                      )}
                    >
                      {available} {available === 1 ? "slot" : "slots"}
                    </span>
                  </button>
                );
              })}
            </div>

            {currentDay && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {currentDay.slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlotId(isSelected ? null : slot.id)}
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
          </div>

          <div className="mx-6 border-t border-border" />

          {/* Feature highlights */}
          <div className="space-y-5 px-6 py-5">
            <div className="flex items-start gap-3.5">
              <MapPin size={22} strokeWidth={1.5} className="mt-0.5 shrink-0 text-foreground" />
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
                  <Icon size={22} strokeWidth={1.5} className="mt-0.5 shrink-0 text-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{config.label}</p>
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
                    i < provider.pricingStructure.length - 1 && "border-b border-border/50"
                  )}
                >
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-6 border-t border-border" />

          {/* Top review */}
          {provider.reviews.length > 0 && (
            <div className="px-6 py-5 pb-8">
              <h3 className="text-base font-semibold">What customers say</h3>
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: provider.reviews[0].rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-foreground text-foreground" />
                    ))}
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

        {/* Sticky bottom bar */}
        <div className="shrink-0 border-t border-border bg-background px-6 py-3 pb-[max(env(safe-area-inset-bottom),12px)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {provider.priceRange}
              </p>
              {selectedSlotId && currentDay ? (
                <p className="text-[11px] text-muted-foreground">
                  {currentDay.dayLabel} · {currentDay.slots.find((s) => s.id === selectedSlotId)?.start}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Select a time slot
                </p>
              )}
            </div>
            <button
              onClick={() => {
                if (!selectedSlotId || !currentDay) return;
                const slot = currentDay.slots.find(
                  (s) => s.id === selectedSlotId
                );
                if (!slot) return;
                onBook(provider, {
                  dayLabel: currentDay.dayLabel,
                  date: currentDay.date,
                  start: slot.start,
                  end: slot.end,
                });
              }}
              disabled={!selectedSlotId}
              className={cn(
                "flex h-11 items-center rounded-xl px-6 text-sm font-semibold transition-opacity",
                selectedSlotId
                  ? "bg-foreground text-background hover:opacity-90"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              )}
            >
              Book now
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
