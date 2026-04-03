import { Toaster } from "sonner";

import { SideNav } from "@/components/layout/side-nav";
import { BookingsProvider } from "@/components/bookings-context";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BookingsProvider>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        {children}
      </main>
      <SideNav />
      <Toaster position="top-center" richColors />
    </BookingsProvider>
  );
}
