"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import type { Booking, Provider } from "@/types";
import { bookings as mockBookings } from "@/data/bookings";

interface SlotInfo {
  dayLabel: string;
  date: string;
  start: string;
  end: string;
}

interface BookingsContextValue {
  bookings: Booking[];
  addBooking: (provider: Provider, slot: SlotInfo) => Booking;
  getUpcoming: () => Booking[];
  getActive: () => Booking[];
  getPast: () => Booking[];
}

const BookingsContext = createContext<BookingsContextValue | null>(null);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const addBooking = useCallback(
    (provider: Provider, slot: SlotInfo): Booking => {
      const id = `bk-${Date.now()}`;
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      const todayStr = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const newBooking: Booking = {
        id,
        providerId: provider.id,
        providerName: provider.name,
        providerPhoto: provider.photos[0] ?? "/providers/placeholder.jpg",
        serviceType:
          provider.category.charAt(0).toUpperCase() +
          provider.category.slice(1).replace("-", " "),
        serviceSummary: provider.services[0]?.name ?? "General service",
        date: slot.dayLabel === "Tomorrow" ? `Tomorrow, ${slot.date}` : slot.dayLabel,
        time: `${slot.start} – ${slot.end}`,
        address: "742 Valencia St, San Francisco",
        status: "confirmed",
        priceEstimate: provider.priceRange,
        statusTimeline: [
          {
            label: "Request submitted",
            time: `${todayStr}, ${timeStr}`,
            completed: true,
          },
          {
            label: "Provider confirmed",
            time: `${todayStr}, ${timeStr}`,
            completed: true,
          },
          { label: "On the way", completed: false },
          { label: "In progress", completed: false },
          { label: "Completed", completed: false },
        ],
      };

      setBookings((prev) => [newBooking, ...prev]);
      return newBooking;
    },
    []
  );

  const getUpcoming = useCallback(
    () => bookings.filter((b) => b.status === "confirmed"),
    [bookings]
  );

  const getActive = useCallback(
    () =>
      bookings.filter((b) =>
        ["provider-en-route", "arriving-soon", "in-progress"].includes(
          b.status
        )
      ),
    [bookings]
  );

  const getPast = useCallback(
    () =>
      bookings.filter((b) =>
        ["completed", "cancelled"].includes(b.status)
      ),
    [bookings]
  );

  return (
    <BookingsContext.Provider
      value={{ bookings, addBooking, getUpcoming, getActive, getPast }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) {
    throw new Error("useBookings must be used within BookingsProvider");
  }
  return ctx;
}
