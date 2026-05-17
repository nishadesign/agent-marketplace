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
      <main className="pt-20">
        <HeroSection />
        <ProvidersSection />
        <DevelopersSection />
      </main>
      <Footer />
    </div>
  );
}
