import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Patch — The Marketplace AI Agents Use",
  description:
    "List your services or connect via API. Patch is the marketplace where AI agents discover, compare, and book real-world service providers.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Prevent white FOUC on refresh + enable section snap-scroll on the landing route */}
      <style>{`
        html,body{background-color:oklch(0.145 0 0);color-scheme:dark;}
        html{scroll-snap-type:y mandatory;scroll-padding-top:5.25rem;scroll-behavior:smooth;}
      `}</style>
      {children}
    </>
  );
}
