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
  Sparkles,
  SquarePen,
} from "lucide-react";

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

  return (
    <>
      {/* Menu trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-[max(env(safe-area-inset-top),16px)] z-[70] flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/45 shadow-[0_2px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-2xl transition-all hover:bg-white/60 hover:shadow-[0_2px_24px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]"
      >
        <Menu size={20} strokeWidth={1.5} />
      </button>

      {/* New chat button — visible on all pages except home */}
      {pathname !== "/" && (
        <Link
          href="/"
          className="fixed right-4 top-[max(env(safe-area-inset-top),16px)] z-[70] flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/45 shadow-[0_2px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-2xl transition-all hover:bg-white/60 hover:shadow-[0_2px_24px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)]"
        >
          <SquarePen size={18} strokeWidth={1.5} />
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
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),16px)] pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
                    <Sparkles size={15} className="text-background" />
                  </div>
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
