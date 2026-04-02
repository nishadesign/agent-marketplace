import type { Booking } from "@/types";

function formatDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function pastDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export const bookings: Booking[] = [
  {
    id: "bk-001",
    providerId: "golden-gate-plumbing",
    providerName: "Golden Gate Home Plumbing",
    providerPhoto: "/providers/plumbing-9.jpg",
    serviceType: "Plumbing",
    serviceSummary: "Kitchen faucet replacement",
    date: formatDate(2),
    time: "9:00 AM – 11:00 AM",
    address: "742 Valencia St, San Francisco",
    status: "confirmed",
    priceEstimate: "$180–$320",
    statusTimeline: [
      { label: "Request submitted", time: "Today, 2:15 PM", completed: true },
      { label: "Provider confirmed", time: "Today, 2:42 PM", completed: true },
      { label: "On the way", completed: false },
      { label: "In progress", completed: false },
      { label: "Completed", completed: false },
    ],
  },
  {
    id: "bk-002",
    providerId: "rapid-response-plumbing",
    providerName: "Rapid Response Plumbing",
    providerPhoto: "/providers/plumbing-12.jpg",
    serviceType: "Plumbing",
    serviceSummary: "Emergency kitchen leak repair",
    date: "Today",
    time: "10:00 AM – 12:00 PM",
    address: "1847 Market St, San Francisco",
    status: "provider-en-route",
    priceEstimate: "$120–$220",
    eta: "12 min",
    statusTimeline: [
      { label: "Booking Confirmed", time: "8:45 AM", completed: true },
      {
        label: "Sarah is on the way",
        time: "9:48 AM",
        completed: true,
        active: true,
        description: "Traffic is light, arrival expected slightly early.",
      },
      { label: "Arrival", completed: false, description: "Service begins" },
      { label: "Completed", completed: false, description: "Service wrap-up & payment" },
    ],
    notes: "Front door code: #4521. Leak is under the kitchen sink, left side.",
  },
  {
    id: "bk-003",
    providerId: "sparkle-clean-sf",
    providerName: "Sparkle Clean SF",
    providerPhoto: "/providers/cleaning-1.jpg",
    serviceType: "Cleaning",
    serviceSummary: "Deep clean — 2BR apartment",
    date: pastDate(5),
    time: "9:00 AM – 12:00 PM",
    address: "1847 Market St, San Francisco",
    status: "completed",
    priceEstimate: "$220",
    statusTimeline: [
      { label: "Request submitted", time: pastDate(6) + ", 4:10 PM", completed: true },
      { label: "Provider confirmed", time: pastDate(6) + ", 4:35 PM", completed: true },
      { label: "On the way", time: pastDate(5) + ", 8:42 AM", completed: true },
      { label: "In progress", time: pastDate(5) + ", 9:05 AM", completed: true },
      { label: "Completed", time: pastDate(5) + ", 11:48 AM", completed: true },
    ],
    agentSummary: "Maria from Sparkle Clean SF completed a full deep clean of your 2-bedroom apartment. All rooms were scrubbed down including kitchen appliances, bathroom tile and grout, baseboards, and interior windows. She noted light mold buildup under the bathroom sink which was treated and cleaned. Total time on-site was 2 hours 43 minutes.",
    receipt: {
      items: [
        { label: "Deep clean — 2BR", amount: "$180.00" },
        { label: "Kitchen appliance detail", amount: "$25.00" },
        { label: "Mold treatment (bathroom)", amount: "$15.00" },
      ],
      total: "$220.00",
      paidAt: pastDate(5) + ", 12:02 PM",
    },
  },
  {
    id: "bk-004",
    providerId: "handy-dan-sf",
    providerName: "Handy Dan",
    providerPhoto: "/providers/handyman-1.jpg",
    serviceType: "Handyman",
    serviceSummary: "IKEA wardrobe assembly + shelf mounting",
    date: pastDate(12),
    time: "1:00 PM – 5:00 PM",
    address: "1847 Market St, San Francisco",
    status: "completed",
    priceEstimate: "$240",
    statusTimeline: [
      { label: "Request submitted", time: pastDate(14) + ", 11:20 AM", completed: true },
      { label: "Provider confirmed", time: pastDate(14) + ", 12:05 PM", completed: true },
      { label: "On the way", time: pastDate(12) + ", 12:38 PM", completed: true },
      { label: "In progress", time: pastDate(12) + ", 1:10 PM", completed: true },
      { label: "Completed", time: pastDate(12) + ", 4:15 PM", completed: true },
    ],
    agentSummary: "Dan assembled a full-size IKEA PAX wardrobe with mirror doors and internal organizers, plus mounted two floating shelves (36\" each) on the bedroom wall with drywall anchors. All packaging was removed and disposed of. He flagged that one shelf bracket had a slight manufacturing defect and replaced it with a spare from his kit. Total time on-site was 3 hours 5 minutes.",
    receipt: {
      items: [
        { label: "IKEA PAX wardrobe assembly", amount: "$140.00" },
        { label: "Shelf mounting (×2)", amount: "$70.00" },
        { label: "Hardware & anchors", amount: "$15.00" },
        { label: "Packaging disposal", amount: "$15.00" },
      ],
      total: "$240.00",
      paidAt: pastDate(12) + ", 4:22 PM",
    },
  },
];

export function getUpcomingBookings(): Booking[] {
  return bookings.filter((b) => b.status === "confirmed");
}

export function getActiveBookings(): Booking[] {
  return bookings.filter((b) =>
    ["provider-en-route", "arriving-soon", "in-progress"].includes(b.status)
  );
}

export function getPastBookings(): Booking[] {
  return bookings.filter((b) => ["completed", "cancelled"].includes(b.status));
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}
