"use client";

import { NavBar } from "@/components/landing/nav-bar";
import { HeroSection } from "@/components/landing/hero-section";
import { DevelopersSection } from "@/components/landing/developers-section";
import { ProvidersSection } from "@/components/landing/providers-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="dark min-h-screen bg-background">
      <NavBar />
      <HeroSection />
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-32">
        <div className="overflow-hidden rounded-3xl border border-white/[0.12] bg-white/[0.06] shadow-[0_0_40px_rgba(168,85,247,0.06),0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
          <ProvidersSection />
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent sm:mx-10" />
          <DevelopersSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}
