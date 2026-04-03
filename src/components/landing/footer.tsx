"use client";

import { PatchLogo } from "@/components/patch-logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-background px-5 py-10 sm:px-6">
      <div className="landing-dot-grid-light pointer-events-none absolute inset-0" />
      {/* Gradient top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <PatchLogo size={22} variant="dark" className="text-foreground" />
          <span className="text-sm font-semibold text-foreground">Patch</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-purple-500">Docs</a>
          <a href="#" className="transition-colors hover:text-purple-500">Blog</a>
          <a href="#" className="transition-colors hover:text-purple-500">Contact</a>
          <a href="#" className="transition-colors hover:text-purple-500">Terms</a>
        </div>

        <p className="text-xs text-muted-foreground/50">
          &copy; {new Date().getFullYear()} Patch
        </p>
      </div>
    </footer>
  );
}
