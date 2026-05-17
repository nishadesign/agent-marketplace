"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  CalendarCheck,
  MessageCircle,
  User,
  SquarePen,
  Briefcase,
  ArrowUpRight,
} from "lucide-react";

import { PatchLogo } from "@/components/patch-logo";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function SideNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  // Hide top triggers on routes that have their own back button or full-screen header
  const hideTopTriggers =
    pathname?.startsWith("/provider/") || pathname?.startsWith("/messages");

  return (
    <>
      {/* Menu trigger */}
      {!hideTopTriggers && (
        <button
          onClick={() => setOpen(true)}
          className="side-nav-menu-trigger fixed left-4 top-[max(env(safe-area-inset-top),60px)] z-[70] flex h-12 w-12 items-center justify-center rounded-full text-foreground transition-opacity hover:opacity-70"
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>
      )}

      {/* New chat button — visible on all pages except home and provider detail */}
      {pathname !== "/" && !hideTopTriggers && (
        <Link
          href="/"
          className="fixed right-4 top-[max(env(safe-area-inset-top),60px)] z-[70] flex h-12 w-12 items-center justify-center rounded-full text-foreground transition-opacity hover:opacity-70"
        >
          <SquarePen size={20} strokeWidth={1.5} />
        </Link>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="side-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/40"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="side-nav-drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-[100] flex w-72 flex-col bg-background shadow-2xl"
          >
              {/* Header — pushed below the Dynamic Island */}
              <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),60px)] pb-2">
                <div className="flex items-center gap-2.5">
                  <PatchLogo size={28} className="text-foreground" />
                  <span className="text-base font-semibold tracking-tight">
                    Patch
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav items */}
              <div className="mt-4 flex-1 px-3">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-accent text-foreground"
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <Icon size={20} strokeWidth={active ? 2 : 1.5} />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Become a provider */}
              <div className="px-3 pb-4">
                <div className="mb-3 border-t border-border" />
                <a
                  href="https://patch-agent-marketplace.vercel.app/landing"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                >
                  <Briefcase size={20} strokeWidth={1.5} />
                  <span className="flex-1">Become a provider</span>
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </a>
              </div>

              {/* Footer */}
              <div className="px-5 pb-[max(env(safe-area-inset-bottom),24px)]">
                <p className="text-[11px] text-muted-foreground">
                  Patch · San Francisco
                </p>
              </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
