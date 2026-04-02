"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import type { Provider, AiRecommendationTag } from "@/types";
import { cn } from "@/lib/utils";

export const COVER_IMAGES = [
  "/providers/plumber-sink.png",
  "/providers/sink.png",
  "/providers/pipes.png",
];

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

interface ProviderCardProps {
  provider: Provider;
  variant?: "browse" | "search";
  index?: number;
  onClick?: (provider: Provider, index: number) => void;
  onBook?: (provider: Provider) => void;
}

function getEarliestSlot(provider: Provider): string | null {
  for (const day of provider.availability) {
    const slot = day.slots.find((s) => s.available);
    if (slot) {
      return `${day.dayLabel} ${slot.start}`;
    }
  }
  return null;
}

export function ProviderCard({ provider, variant = "browse", index = 0, onClick, onBook }: ProviderCardProps) {
  const earliest = getEarliestSlot(provider);
  const gradient = categoryGradients[provider.category] ?? "from-gray-100 to-gray-200";

  if (variant === "search") {
    return <SearchResultCard provider={provider} earliest={earliest} index={index} onClick={onClick} onBook={onBook} />;
  }

  return (
    <Link
      href={`/provider/${provider.id}`}
      className="group block w-[200px] shrink-0"
    >
      <div
        className={cn(
          "flex h-[100px] items-end rounded-xl bg-gradient-to-br p-3",
          gradient
        )}
      >
        <span className="text-[11px] font-medium uppercase tracking-wider text-foreground/40">
          {provider.category.replace("-", " ")}
        </span>
      </div>

      <div className="mt-2.5 space-y-1">
        <h3 className="text-sm font-semibold leading-tight text-foreground line-clamp-1">
          {provider.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star size={12} className="fill-foreground text-foreground" />
          <span className="font-medium text-foreground">{provider.rating}</span>
          <span>({provider.reviewCount})</span>
          <span className="text-border">·</span>
          <span>{provider.distance}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">
            {provider.priceRange}
          </span>
          {earliest && (
            <span className="text-[11px] text-muted-foreground">
              {earliest}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function SearchResultCard({
  provider,
  earliest,
  index = 0,
  onClick,
  onBook,
}: {
  provider: Provider;
  earliest: string | null;
  index?: number;
  onClick?: (provider: Provider, index: number) => void;
  onBook?: (provider: Provider) => void;
}) {
  const coverImage = COVER_IMAGES[index % COVER_IMAGES.length];

  return (
    <div className="group w-[280px] shrink-0 rounded-2xl border border-border/60 bg-background text-left">
      <div className="relative">
        <div className="relative h-[200px] w-full overflow-hidden rounded-t-2xl">
          <Image
            src={coverImage}
            alt={provider.name}
            fill
            className="object-cover"
            sizes="280px"
          />
        </div>
        {provider.aiTag && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold text-background">
            {provider.aiTag}
          </span>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-[15px] font-semibold leading-snug text-foreground line-clamp-1">
            {provider.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Star size={11} className="fill-foreground text-foreground" />
            <span className="font-medium text-foreground">{provider.rating}</span>
            <span>({provider.reviewCount})</span>
            <span className="text-border">·</span>
            <span>{provider.distance}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onClick?.(provider, index)}
            className="flex h-10 flex-1 items-center justify-center rounded-xl border border-border text-xs font-medium text-foreground transition-colors hover:bg-accent/50"
          >
            View details
          </button>
          <button
            type="button"
            onClick={() => onBook?.(provider)}
            className="flex h-10 flex-1 items-center justify-center rounded-xl bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}
