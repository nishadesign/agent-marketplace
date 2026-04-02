import type { Metadata, Viewport } from "next";
import { VT323 } from "next/font/google";
import { Toaster } from "sonner";

import { SideNav } from "@/components/layout/side-nav";
import { BookingsProvider } from "@/components/bookings-context";
import "./globals.css";

const vt323 = VT323({
  variable: "--font-sans",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patch — Find & Book Trusted Home Services",
  description:
    "AI-native marketplace for finding and booking trusted home service providers in San Francisco.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#008080",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${vt323.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans text-foreground" style={{ backgroundColor: "#008080" }}>
        <BookingsProvider>
          <main className="mx-auto flex w-full max-w-lg flex-1 flex-col">
            {children}
          </main>
          <SideNav />
          <Toaster position="bottom-right" />
        </BookingsProvider>
      </body>
    </html>
  );
}
