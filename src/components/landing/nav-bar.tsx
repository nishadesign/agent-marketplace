"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { PatchLogo } from "@/components/patch-logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Providers", href: "#providers" },
  { label: "Developers", href: "#developers" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link href="/landing" className="flex items-center gap-2.5">
            <PatchLogo size={28} variant="dark" className="text-foreground" />
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              Patch
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 md:inline-flex"
          >
            Patch app
            <ArrowUpRight size={14} strokeWidth={2} />
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl md:hidden"
          >
            <div className="flex h-full flex-col items-center justify-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => handleNavClick(link.href)}
                  className="text-2xl font-medium text-foreground"
                >
                  {link.label}
                </motion.button>
              ))}
              <Link
                href="/"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background"
              >
                Patch app
                <ArrowUpRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
