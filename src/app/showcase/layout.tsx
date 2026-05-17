import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Patch — Showcase",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function ShowcaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <style>{`html,body{background-color:#ffffff;color-scheme:light;}`}</style>
      {children}
    </>
  );
}
