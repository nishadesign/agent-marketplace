"use client";

import Link from "next/link";
import { Star } from "lucide-react";

import type { Provider, AiRecommendationTag } from "@/types";
import { cn } from "@/lib/utils";

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
  onClick?: (provider: Provider) => void;
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

export function ProviderCard({ provider, variant = "browse", onClick }: ProviderCardProps) {
  const earliest = getEarliestSlot(provider);
  const gradient = categoryGradients[provider.category] ?? "from-gray-100 to-gray-200";

  if (variant === "search") {
    return <SearchResultCard provider={provider} earliest={earliest} onClick={onClick} />;
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
  onClick,
}: {
  provider: Provider;
  earliest: string | null;
  onClick?: (provider: Provider) => void;
}) {
  const sharedClassName =
    "group flex w-full gap-3.5 rounded-2xl bg-background text-left transition-colors";

  const children = (
    <>
      {/* Image with tag overlay */}
      <div className="relative shrink-0">
        <div
          className={cn(
            "flex h-[100px] w-[120px] items-end rounded-xl bg-gradient-to-br",
            categoryGradients[provider.category] ?? "from-gray-100 to-gray-200"
          )}
        />
        {provider.aiTag && (
          <span className="absolute left-2 top-2 rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background">
            {provider.aiTag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-between gap-3 py-0.5">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-snug text-foreground line-clamp-2">
            {provider.name}
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {provider.distance} away
            {earliest && <> · {earliest}</>}
          </p>

          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Star size={11} className="fill-foreground text-foreground" />
            <span className="font-medium text-foreground">{provider.rating}</span>
            <span>{provider.reviewCount} reviews</span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-foreground">
            {provider.priceRange}
          </p>
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(provider)}
        className={sharedClassName}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={`/provider/${provider.id}`} className={sharedClassName}>
      {children}
    </Link>
  );
}
