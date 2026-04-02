"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/bookings", label: "Bookings", icon: "📅" },
  { href: "/messages", label: "Messages", icon: "✉️" },
  { href: "/profile", label: "Profile", icon: "👤" },
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
      {/* Menu trigger — Win2000 taskbar Start-style */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          left: 4,
          top: "max(env(safe-area-inset-top), 12px)",
          zIndex: 40,
          background: "#d4d0c8",
          fontSize: 11,
          padding: "3px 10px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontWeight: "bold",
          boxShadow:
            "inset -1px -1px 0 #000, inset 1px 1px 0 #fff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf",
          border: "none",
          cursor: "default",
          fontFamily: "var(--font-sans)",
        }}
      >
        <span>🪟</span> Menu
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 90,
              background: "rgba(0,0,0,0.4)",
            }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.15 }}
            style={{
              position: "fixed",
              insetY: 0,
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 100,
              width: 220,
              display: "flex",
              flexDirection: "column",
              background: "#d4d0c8",
              boxShadow:
                "inset -1px -1px 0 #000, inset 1px 1px 0 #fff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf",
            }}
          >
            {/* Title bar */}
            <div
              style={{
                background: "linear-gradient(to right, #000080, #1084d0)",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 12,
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                userSelect: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span>🪟</span>
                <span>Patch Navigator</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "#d4d0c8",
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: 10,
                  width: 16,
                  height: 14,
                  border: "none",
                  boxShadow:
                    "inset -1px -1px 0 #000, inset 1px 1px 0 #fff, inset -2px -2px 0 #808080, inset 2px 2px 0 #dfdfdf",
                  cursor: "default",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            {/* Vertical banner */}
            <div style={{ display: "flex", flex: 1 }}>
              <div
                style={{
                  width: 24,
                  background: "linear-gradient(to bottom, #000080, #1084d0)",
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg)",
                  color: "#ffffff",
                  fontSize: 10,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: 8,
                  letterSpacing: 2,
                  userSelect: "none",
                }}
              >
                PATCH 2000
              </div>

              <div style={{ flex: 1, padding: "8px 0" }}>
                {navItems.map(({ href, label, icon }) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 10px",
                        fontSize: 12,
                        fontWeight: active ? "bold" : "normal",
                        background: active ? "#000080" : "transparent",
                        color: active ? "#ffffff" : "#000000",
                        textDecoration: "none",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLAnchorElement).style.background = "#316ac5";
                          (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                          (e.currentTarget as HTMLAnchorElement).style.color = "#000";
                        }
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{icon}</span>
                      <span>{label}</span>
                    </Link>
                  );
                })}

                <div
                  style={{
                    borderTop: "1px solid #808080",
                    margin: "8px 0",
                  }}
                />

                <div style={{ padding: "4px 10px", fontSize: 10, color: "#808080" }}>
                  🌐 San Francisco, CA
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: "1px solid #808080",
                padding: "4px 8px",
                fontSize: 10,
                color: "#808080",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Patch © 2000</span>
              <span>v2.0.1</span>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
