import type { Provider } from "@/types";

function getNextDays(count: number): { date: string; dayLabel: string }[] {
  const days: { date: string; dayLabel: string }[] = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    days.push({
      date: `${d.getFullYear()}-${month}-${day}`,
      dayLabel: i === 1 ? "Tomorrow" : dayNames[d.getDay()],
    });
  }

  return days;
}

const nextDays = getNextDays(6);

export const providers: Provider[] = [
  {
    id: "marcus-cole-plumbing",
    name: "Marcus Cole Plumbing",
    ownerName: "Marcus",
    category: "plumbing",
    rating: 4.9,
    reviewCount: 312,
    priceRange: "From $89",
    pricingStructure: [
      { label: "Service call", price: "$89", note: "Includes first 30 min" },
      { label: "Leak repair", price: "$120–$280", note: "Parts included" },
      { label: "Faucet installation", price: "$160–$320" },
      { label: "Drain cleaning", price: "$95–$175" },
    ],
    distance: "1.2 mi",
    distanceMiles: 1.2,
    serviceArea: "Mission, Castro, Noe Valley, SoMa",
    latitude: 37.7599,
    longitude: -122.4148,
    bio: "Licensed master plumber with 14 years in SF. Specializing in residential repairs, fixture installs, and emergency leak response. Same-day service when available.",
    yearsExperience: 14,
    specialties: ["Leak repair", "Emergency", "Faucet install"],
    services: [
      { name: "Leak repair", description: "Kitchen, bathroom, and pipe leak diagnosis and repair" },
      { name: "Faucet installation", description: "Remove old and install new faucets, all brands" },
      { name: "Drain cleaning", description: "Mechanical and hydro-jet drain clearing" },
      { name: "Toilet repair", description: "Running toilets, clogs, flange replacement" },
      { name: "Garbage disposal", description: "Install or replace garbage disposals" },
    ],
    availability: [
      {
        date: nextDays[0].date,
        dayLabel: nextDays[0].dayLabel,
        slots: [
          { id: "mc-1", start: "8:00 AM", end: "10:00 AM", available: true },
          { id: "mc-2", start: "10:00 AM", end: "12:00 PM", available: false },
          { id: "mc-3", start: "1:00 PM", end: "3:00 PM", available: true },
        ],
      },
      {
        date: nextDays[1].date,
        dayLabel: nextDays[1].dayLabel,
        slots: [
          { id: "mc-4", start: "9:00 AM", end: "11:00 AM", available: true },
          { id: "mc-5", start: "11:00 AM", end: "1:00 PM", available: true },
          { id: "mc-6", start: "2:00 PM", end: "4:00 PM", available: true },
        ],
      },
      {
        date: nextDays[2].date,
        dayLabel: nextDays[2].dayLabel,
        slots: [
          { id: "mc-7", start: "8:00 AM", end: "10:00 AM", available: true },
          { id: "mc-8", start: "1:00 PM", end: "3:00 PM", available: false },
        ],
      },
      {
        date: nextDays[3].date,
        dayLabel: nextDays[3].dayLabel,
        slots: [
          { id: "mc-9", start: "9:00 AM", end: "11:00 AM", available: true },
          { id: "mc-10", start: "2:00 PM", end: "4:00 PM", available: true },
        ],
      },
      {
        date: nextDays[4].date,
        dayLabel: nextDays[4].dayLabel,
        slots: [
          { id: "mc-11", start: "8:00 AM", end: "10:00 AM", available: true },
          { id: "mc-12", start: "10:00 AM", end: "12:00 PM", available: true },
          { id: "mc-13", start: "1:00 PM", end: "3:00 PM", available: true },
        ],
      },
    ],
    reviews: [
      {
        id: "r1",
        authorName: "Sarah M.",
        rating: 5,
        date: "Mar 2026",
        text: "Marcus showed up right on time for our kitchen leak. Fixed it in under an hour and explained everything he did. Fair price, super professional.",
      },
      {
        id: "r2",
        authorName: "David L.",
        rating: 5,
        date: "Feb 2026",
        text: "Called about an emergency pipe burst at 7 AM. Marcus was there by 8:30. Saved us from major water damage. Can't recommend enough.",
      },
      {
        id: "r3",
        authorName: "Priya K.",
        rating: 4,
        date: "Feb 2026",
        text: "Great faucet install. Took a bit longer than quoted but the work was meticulous and he cleaned up after himself. Would hire again.",
      },
      {
        id: "r4",
        authorName: "Tom W.",
        rating: 5,
        date: "Jan 2026",
        text: "Third time using Marcus for plumbing work. Consistent quality every time. He's our go-to now.",
      },
    ],
    badges: ["licensed", "insured", "background-checked"],
    photos: ["/providers/plumbing-1.jpg", "/providers/plumbing-2.jpg", "/providers/plumbing-3.jpg"],
    cancellationPolicy: "Free cancellation up to 4 hours before the appointment. $25 fee for late cancellations.",
    aiTag: "Best Matched",
  },
  {
    id: "bay-flow-plumbing",
    name: "Bay Flow Plumbing Co.",
    ownerName: "James",
    category: "plumbing",
    rating: 4.7,
    reviewCount: 189,
    priceRange: "$75–$250",
    pricingStructure: [
      { label: "Diagnostic visit", price: "$75" },
      { label: "Standard repair", price: "$110–$250" },
      { label: "Faucet replacement", price: "$140–$290" },
      { label: "Emergency surcharge", price: "+$50", note: "After 6 PM / weekends" },
    ],
    distance: "2.4 mi",
    distanceMiles: 2.4,
    serviceArea: "Financial District, North Beach, Russian Hill, Marina",
    latitude: 37.7989,
    longitude: -122.4074,
    bio: "Family-owned plumbing service since 2015. We focus on transparent pricing — no surprise fees. Available 7 days a week including emergency calls.",
    yearsExperience: 11,
    specialties: ["Drain cleaning", "Water heater", "Transparent pricing"],
    services: [
      { name: "Drain cleaning", description: "Camera inspection and professional drain clearing" },
      { name: "Leak detection", description: "Non-invasive leak detection and repair" },
      { name: "Water heater service", description: "Repair, replace, or install tank/tankless heaters" },
      { name: "Faucet & fixture install", description: "All residential fixture installations" },
    ],
    availability: [
      {
        date: nextDays[0].date,
        dayLabel: nextDays[0].dayLabel,
        slots: [
          { id: "bf-1", start: "7:00 AM", end: "9:00 AM", available: true },
          { id: "bf-2", start: "11:00 AM", end: "1:00 PM", available: true },
        ],
      },
      {
        date: nextDays[1].date,
        dayLabel: nextDays[1].dayLabel,
        slots: [
          { id: "bf-3", start: "9:00 AM", end: "11:00 AM", available: true },
          { id: "bf-4", start: "1:00 PM", end: "3:00 PM", available: true },
          { id: "bf-5", start: "3:00 PM", end: "5:00 PM", available: false },
        ],
      },
      {
        date: nextDays[2].date,
        dayLabel: nextDays[2].dayLabel,
        slots: [
          { id: "bf-6", start: "8:00 AM", end: "10:00 AM", available: true },
          { id: "bf-7", start: "10:00 AM", end: "12:00 PM", available: true },
        ],
      },
      {
        date: nextDays[3].date,
        dayLabel: nextDays[3].dayLabel,
        slots: [
          { id: "bf-8", start: "9:00 AM", end: "11:00 AM", available: true },
        ],
      },
      {
        date: nextDays[4].date,
        dayLabel: nextDays[4].dayLabel,
        slots: [
          { id: "bf-9", start: "8:00 AM", end: "10:00 AM", available: true },
          { id: "bf-10", start: "2:00 PM", end: "4:00 PM", available: true },
        ],
      },
    ],
    reviews: [
      {
        id: "r5",
        authorName: "Mike R.",
        rating: 5,
        date: "Mar 2026",
        text: "James was upfront about everything before starting. No hidden costs. Fixed our running toilet in 20 minutes. Great experience.",
      },
      {
        id: "r6",
        authorName: "Linda T.",
        rating: 4,
        date: "Mar 2026",
        text: "Good service for a clogged kitchen drain. Arrived within the window and got it done. Slightly pricier than expected for the emergency call.",
      },
      {
        id: "r7",
        authorName: "Alex C.",
        rating: 5,
        date: "Jan 2026",
        text: "Used them for a water heater replacement. Professional install, hauled away the old unit, and left the area spotless.",
      },
    ],
    badges: ["licensed", "insured"],
    photos: ["/providers/plumbing-4.jpg", "/providers/plumbing-5.jpg", "/providers/plumbing-6.jpg"],
    cancellationPolicy: "Free cancellation up to 2 hours before. No-shows are charged the diagnostic fee.",
    aiTag: "Instant",
  },
  {
    id: "sf-rooter-pros",
    name: "SF Rooter Pros",
    ownerName: "Tony",
    category: "plumbing",
    rating: 4.6,
    reviewCount: 97,
    priceRange: "From $69",
    pricingStructure: [
      { label: "Basic drain clearing", price: "$69" },
      { label: "Leak repair", price: "$95–$195" },
      { label: "Pipe replacement", price: "From $250", note: "Depends on scope" },
      { label: "Sewer line camera", price: "$150" },
    ],
    distance: "3.1 mi",
    distanceMiles: 3.1,
    serviceArea: "Sunset, Richmond, Parkside, Inner Richmond",
    latitude: 37.7558,
    longitude: -122.4685,
    bio: "Drain and sewer specialists. We handle the tough jobs other plumbers pass on. Camera inspections, rooter service, and full pipe repair.",
    yearsExperience: 9,
    specialties: ["Sewer line", "Rooter service", "Budget-friendly"],
    services: [
      { name: "Rooter service", description: "Professional rooter for stubborn clogs" },
      { name: "Sewer camera inspection", description: "Video inspection of sewer and drain lines" },
      { name: "Pipe repair & replacement", description: "Copper, PVC, cast iron pipe work" },
      { name: "Leak repair", description: "Residential leak repair for all fixtures" },
    ],
    availability: [
      {
        date: nextDays[0].date,
        dayLabel: nextDays[0].dayLabel,
        slots: [
          { id: "sr-1", start: "10:00 AM", end: "12:00 PM", available: true },
          { id: "sr-2", start: "2:00 PM", end: "4:00 PM", available: true },
        ],
      },
      {
        date: nextDays[1].date,
        dayLabel: nextDays[1].dayLabel,
        slots: [
          { id: "sr-3", start: "8:00 AM", end: "10:00 AM", available: true },
          { id: "sr-4", start: "12:00 PM", end: "2:00 PM", available: true },
        ],
      },
      {
        date: nextDays[2].date,
        dayLabel: nextDays[2].dayLabel,
        slots: [
          { id: "sr-5", start: "9:00 AM", end: "11:00 AM", available: false },
          { id: "sr-6", start: "1:00 PM", end: "3:00 PM", available: true },
        ],
      },
      {
        date: nextDays[3].date,
        dayLabel: nextDays[3].dayLabel,
        slots: [
          { id: "sr-7", start: "10:00 AM", end: "12:00 PM", available: true },
          { id: "sr-8", start: "3:00 PM", end: "5:00 PM", available: true },
        ],
      },
    ],
    reviews: [
      {
        id: "r8",
        authorName: "Karen J.",
        rating: 5,
        date: "Mar 2026",
        text: "Tony ran a camera through our sewer line and found the root intrusion causing backups. Fixed it the same day. Very fair pricing.",
      },
      {
        id: "r9",
        authorName: "Brian H.",
        rating: 4,
        date: "Feb 2026",
        text: "Cleared a really stubborn kitchen drain. Took some effort but got it done. Affordable and honest.",
      },
      {
        id: "r10",
        authorName: "Yuki S.",
        rating: 5,
        date: "Jan 2026",
        text: "Best price I found for drain cleaning in the Sunset. Tony was friendly and efficient. Will use again.",
      },
    ],
    badges: ["licensed", "insured", "background-checked"],
    photos: ["/providers/plumbing-7.jpg", "/providers/plumbing-8.jpg"],
    cancellationPolicy: "Free cancellation up to 24 hours before. 50% charge for same-day cancellations.",
    aiTag: "Top-Rated",
  },
  {
    id: "golden-gate-plumbing",
    name: "Golden Gate Home Plumbing",
    ownerName: "Diana",
    category: "plumbing",
    rating: 4.8,
    reviewCount: 224,
    priceRange: "$95–$350",
    pricingStructure: [
      { label: "Diagnostic & estimate", price: "$95", note: "Waived if you book" },
      { label: "Standard leak repair", price: "$150–$350" },
      { label: "Fixture installation", price: "$180–$400" },
      { label: "Repiping (per section)", price: "From $500" },
    ],
    distance: "1.8 mi",
    distanceMiles: 1.8,
    serviceArea: "Pacific Heights, Cow Hollow, Marina, Presidio Heights",
    latitude: 37.7925,
    longitude: -122.4382,
    bio: "Premium residential plumbing for SF homeowners. We specialize in older home plumbing systems, fixture upgrades, and full bathroom remodels. Every job includes a warranty.",
    yearsExperience: 18,
    specialties: ["Older homes", "Fixture upgrades", "Warranty included"],
    services: [
      { name: "Leak diagnosis & repair", description: "Comprehensive leak detection with thermal imaging" },
      { name: "Fixture upgrades", description: "High-end faucet, showerhead, and toilet installations" },
      { name: "Bathroom remodel plumbing", description: "Full rough-in and finish plumbing for remodels" },
      { name: "Repiping", description: "Section or whole-house repiping for older SF homes" },
    ],
    availability: [
      {
        date: nextDays[0].date,
        dayLabel: nextDays[0].dayLabel,
        slots: [
          { id: "gg-1", start: "9:00 AM", end: "11:00 AM", available: true },
        ],
      },
      {
        date: nextDays[1].date,
        dayLabel: nextDays[1].dayLabel,
        slots: [
          { id: "gg-2", start: "8:00 AM", end: "10:00 AM", available: true },
          { id: "gg-3", start: "10:00 AM", end: "12:00 PM", available: false },
          { id: "gg-4", start: "2:00 PM", end: "4:00 PM", available: true },
        ],
      },
      {
        date: nextDays[2].date,
        dayLabel: nextDays[2].dayLabel,
        slots: [
          { id: "gg-5", start: "9:00 AM", end: "11:00 AM", available: true },
          { id: "gg-6", start: "1:00 PM", end: "3:00 PM", available: true },
        ],
      },
      {
        date: nextDays[3].date,
        dayLabel: nextDays[3].dayLabel,
        slots: [
          { id: "gg-7", start: "10:00 AM", end: "12:00 PM", available: true },
        ],
      },
      {
        date: nextDays[4].date,
        dayLabel: nextDays[4].dayLabel,
        slots: [
          { id: "gg-8", start: "8:00 AM", end: "10:00 AM", available: true },
          { id: "gg-9", start: "2:00 PM", end: "4:00 PM", available: true },
        ],
      },
    ],
    reviews: [
      {
        id: "r11",
        authorName: "Jennifer P.",
        rating: 5,
        date: "Mar 2026",
        text: "Diana's team replaced all the old galvanized pipes in our 1920s Victorian. Incredible work, minimal wall damage, and they patched everything after.",
      },
      {
        id: "r12",
        authorName: "Robert K.",
        rating: 5,
        date: "Feb 2026",
        text: "Had a complex leak behind a tile wall. They used thermal imaging to find it without tearing anything apart. Worth every penny.",
      },
      {
        id: "r13",
        authorName: "Mei L.",
        rating: 4,
        date: "Jan 2026",
        text: "High-quality fixture installation for our bathroom remodel. A bit on the premium side pricing-wise, but the warranty and craftsmanship justify it.",
      },
    ],
    badges: ["licensed", "insured", "background-checked"],
    photos: ["/providers/plumbing-9.jpg", "/providers/plumbing-10.jpg", "/providers/plumbing-11.jpg"],
    cancellationPolicy: "Free cancellation up to 24 hours before. Diagnostic fee applies for same-day cancellations.",
    aiTag: "Top-Rated",
  },
  {
    id: "rapid-response-plumbing",
    name: "Rapid Response Plumbing",
    ownerName: "Carlos",
    category: "plumbing",
    rating: 4.5,
    reviewCount: 156,
    priceRange: "From $79",
    pricingStructure: [
      { label: "Emergency call-out", price: "$79" },
      { label: "Leak repair", price: "$100–$220" },
      { label: "Drain unclogging", price: "$80–$150" },
      { label: "After-hours surcharge", price: "+$40" },
    ],
    distance: "0.8 mi",
    distanceMiles: 0.8,
    serviceArea: "SoMa, Mission, Potrero Hill, Dogpatch",
    latitude: 37.7724,
    longitude: -122.3995,
    bio: "Fast, reliable plumbing when you need it most. We pride ourselves on response time — most jobs start within 2 hours of booking. 24/7 emergency available.",
    yearsExperience: 7,
    specialties: ["Fast response", "24/7 emergency", "Same-day"],
    services: [
      { name: "Emergency leak repair", description: "Rapid response for active leaks and pipe bursts" },
      { name: "Drain unclogging", description: "Kitchen, bathroom, and main line clearing" },
      { name: "Toilet repair", description: "All toilet repairs including replacement" },
      { name: "Faucet repair", description: "Fix dripping and broken faucets same-day" },
    ],
    availability: [
      {
        date: nextDays[0].date,
        dayLabel: nextDays[0].dayLabel,
        slots: [
          { id: "rr-1", start: "7:00 AM", end: "9:00 AM", available: true },
          { id: "rr-2", start: "9:00 AM", end: "11:00 AM", available: true },
          { id: "rr-3", start: "11:00 AM", end: "1:00 PM", available: true },
          { id: "rr-4", start: "2:00 PM", end: "4:00 PM", available: false },
        ],
      },
      {
        date: nextDays[1].date,
        dayLabel: nextDays[1].dayLabel,
        slots: [
          { id: "rr-5", start: "8:00 AM", end: "10:00 AM", available: true },
          { id: "rr-6", start: "10:00 AM", end: "12:00 PM", available: true },
          { id: "rr-7", start: "1:00 PM", end: "3:00 PM", available: true },
        ],
      },
      {
        date: nextDays[2].date,
        dayLabel: nextDays[2].dayLabel,
        slots: [
          { id: "rr-8", start: "9:00 AM", end: "11:00 AM", available: true },
          { id: "rr-9", start: "3:00 PM", end: "5:00 PM", available: true },
        ],
      },
    ],
    reviews: [
      {
        id: "r14",
        authorName: "Jake M.",
        rating: 5,
        date: "Mar 2026",
        text: "Booked at 9 AM, Carlos was at my door by 10:15. Fastest plumber I've ever hired. Fixed the kitchen faucet leak in no time.",
      },
      {
        id: "r15",
        authorName: "Nadia F.",
        rating: 4,
        date: "Feb 2026",
        text: "Came out on a Sunday for an emergency. Slightly higher price for the weekend call but totally worth it. Stopped the leak before it caused damage.",
      },
      {
        id: "r16",
        authorName: "Chris B.",
        rating: 5,
        date: "Jan 2026",
        text: "Reliable and fast. Used them twice now for different issues. Both times they showed up within 2 hours of booking.",
      },
    ],
    badges: ["licensed", "insured"],
    photos: ["/providers/plumbing-12.jpg", "/providers/plumbing-13.jpg"],
    cancellationPolicy: "Free cancellation up to 1 hour before. Emergency calls are non-refundable once dispatched.",
    aiTag: "Instant",
  },
  {
    id: "sparkle-clean-sf",
    name: "Sparkle Clean SF",
    ownerName: "Ana",
    category: "cleaning",
    rating: 4.8,
    reviewCount: 287,
    priceRange: "$120–$320",
    pricingStructure: [
      { label: "Standard clean (1BR)", price: "$120" },
      { label: "Standard clean (2BR)", price: "$180" },
      { label: "Deep clean", price: "$220–$320" },
      { label: "Move-out clean", price: "From $280" },
    ],
    distance: "2.1 mi",
    distanceMiles: 2.1,
    serviceArea: "Castro, Mission, Noe Valley, Haight",
    latitude: 37.7609,
    longitude: -122.4350,
    bio: "Eco-friendly residential cleaning with a detail-obsessed team. We use non-toxic products and bring all our own supplies. Recurring discounts available.",
    yearsExperience: 8,
    specialties: ["Eco-friendly", "Deep clean", "Move-out"],
    services: [
      { name: "Standard cleaning", description: "Full home clean — kitchen, bathrooms, floors, dusting" },
      { name: "Deep cleaning", description: "Intensive cleaning including appliances, baseboards, windows" },
      { name: "Move-in / move-out", description: "Thorough clean for transitions, includes inside cabinets" },
      { name: "Recurring service", description: "Weekly, bi-weekly, or monthly on a schedule" },
    ],
    availability: [
      {
        date: nextDays[0].date,
        dayLabel: nextDays[0].dayLabel,
        slots: [
          { id: "sc-1", start: "9:00 AM", end: "12:00 PM", available: false },
          { id: "sc-2", start: "1:00 PM", end: "4:00 PM", available: true },
        ],
      },
      {
        date: nextDays[1].date,
        dayLabel: nextDays[1].dayLabel,
        slots: [
          { id: "sc-3", start: "9:00 AM", end: "12:00 PM", available: true },
          { id: "sc-4", start: "1:00 PM", end: "4:00 PM", available: true },
        ],
      },
      {
        date: nextDays[2].date,
        dayLabel: nextDays[2].dayLabel,
        slots: [
          { id: "sc-5", start: "10:00 AM", end: "1:00 PM", available: true },
        ],
      },
    ],
    reviews: [
      {
        id: "r17",
        authorName: "Emma W.",
        rating: 5,
        date: "Mar 2026",
        text: "Best cleaning service I've used in the city. Ana's team is thorough, on time, and the eco-friendly products smell amazing. My apartment has never looked better.",
      },
      {
        id: "r18",
        authorName: "Ryan D.",
        rating: 5,
        date: "Feb 2026",
        text: "Booked a move-out deep clean. They got our full deposit back. Landlord said the place looked better than when we moved in.",
      },
      {
        id: "r19",
        authorName: "Sophia G.",
        rating: 4,
        date: "Jan 2026",
        text: "Great regular cleaning service. Bi-weekly schedule keeps our place spotless. Only minor feedback — they sometimes miss the tops of door frames.",
      },
    ],
    badges: ["insured", "background-checked"],
    photos: ["/providers/cleaning-1.jpg", "/providers/cleaning-2.jpg", "/providers/cleaning-3.jpg"],
    cancellationPolicy: "Free cancellation up to 24 hours before. 50% charge within 24 hours.",
  },
  {
    id: "volt-electric-sf",
    name: "Volt Electric",
    ownerName: "Kevin",
    category: "electrical",
    rating: 4.7,
    reviewCount: 143,
    priceRange: "$110–$400",
    pricingStructure: [
      { label: "Service call", price: "$110", note: "Includes diagnosis" },
      { label: "Outlet/switch install", price: "$85–$150", note: "Per unit" },
      { label: "Panel upgrade", price: "From $400" },
      { label: "Lighting install", price: "$120–$300" },
    ],
    distance: "3.4 mi",
    distanceMiles: 3.4,
    serviceArea: "Richmond, Sunset, Parkside, Lake Merced",
    latitude: 37.7750,
    longitude: -122.4795,
    bio: "Licensed electrician serving SF residential and small commercial. Panel upgrades, EV charger installs, smart home wiring, and general electrical work.",
    yearsExperience: 12,
    specialties: ["Panel upgrade", "EV charger", "Smart home"],
    services: [
      { name: "Electrical repair", description: "Troubleshoot and fix outlets, switches, wiring issues" },
      { name: "Panel upgrade", description: "Upgrade electrical panels for modern load requirements" },
      { name: "Lighting installation", description: "Recessed, pendant, under-cabinet, and outdoor lighting" },
      { name: "EV charger install", description: "Level 2 home EV charger installation with permit" },
    ],
    availability: [
      {
        date: nextDays[0].date,
        dayLabel: nextDays[0].dayLabel,
        slots: [
          { id: "ve-1", start: "10:00 AM", end: "12:00 PM", available: true },
        ],
      },
      {
        date: nextDays[1].date,
        dayLabel: nextDays[1].dayLabel,
        slots: [
          { id: "ve-2", start: "8:00 AM", end: "10:00 AM", available: true },
          { id: "ve-3", start: "1:00 PM", end: "3:00 PM", available: true },
        ],
      },
      {
        date: nextDays[2].date,
        dayLabel: nextDays[2].dayLabel,
        slots: [
          { id: "ve-4", start: "9:00 AM", end: "11:00 AM", available: true },
          { id: "ve-5", start: "2:00 PM", end: "4:00 PM", available: false },
        ],
      },
    ],
    reviews: [
      {
        id: "r20",
        authorName: "Paul S.",
        rating: 5,
        date: "Mar 2026",
        text: "Kevin installed our EV charger perfectly. Handled the permit, did the work clean, and was very patient explaining the panel situation.",
      },
      {
        id: "r21",
        authorName: "Helen N.",
        rating: 4,
        date: "Feb 2026",
        text: "Good work on recessed lighting in our kitchen. Professional and knowledgeable. Price was fair for the amount of work involved.",
      },
      {
        id: "r22",
        authorName: "Arjun M.",
        rating: 5,
        date: "Jan 2026",
        text: "Panel upgrade done right. Other electricians wanted to do shortcuts but Kevin explained why a full upgrade was worth it. No issues since.",
      },
    ],
    badges: ["licensed", "insured", "background-checked"],
    photos: ["/providers/electrical-1.jpg", "/providers/electrical-2.jpg"],
    cancellationPolicy: "Free cancellation up to 24 hours before. Full charge for no-shows.",
  },
  {
    id: "handy-dan-sf",
    name: "Handy Dan",
    ownerName: "Dan",
    category: "handyman",
    rating: 4.6,
    reviewCount: 203,
    priceRange: "$65/hr",
    pricingStructure: [
      { label: "Hourly rate", price: "$65/hr", note: "2-hour minimum" },
      { label: "Half-day (4 hrs)", price: "$240" },
      { label: "Full day (8 hrs)", price: "$450" },
      { label: "Small project flat rate", price: "From $85" },
    ],
    distance: "1.5 mi",
    distanceMiles: 1.5,
    serviceArea: "SoMa, Mission, Potrero Hill, Bernal Heights",
    latitude: 37.7527,
    longitude: -122.4057,
    bio: "Your neighborhood handyman for the small stuff and the medium stuff. Furniture assembly, drywall patches, shelving, door repairs, and everything in between.",
    yearsExperience: 10,
    specialties: ["Furniture assembly", "Drywall", "Odd jobs"],
    services: [
      { name: "Furniture assembly", description: "IKEA and all brands, built right the first time" },
      { name: "Drywall repair", description: "Patch holes, fix cracks, texture matching" },
      { name: "Shelving & mounting", description: "Floating shelves, heavy mirrors, art hanging" },
      { name: "Door & window repair", description: "Fix sticky doors, broken locks, window hardware" },
      { name: "General repairs", description: "Caulking, weatherstripping, minor carpentry" },
    ],
    availability: [
      {
        date: nextDays[0].date,
        dayLabel: nextDays[0].dayLabel,
        slots: [
          { id: "hd-1", start: "8:00 AM", end: "12:00 PM", available: true },
          { id: "hd-2", start: "1:00 PM", end: "5:00 PM", available: false },
        ],
      },
      {
        date: nextDays[1].date,
        dayLabel: nextDays[1].dayLabel,
        slots: [
          { id: "hd-3", start: "8:00 AM", end: "12:00 PM", available: true },
          { id: "hd-4", start: "1:00 PM", end: "5:00 PM", available: true },
        ],
      },
      {
        date: nextDays[2].date,
        dayLabel: nextDays[2].dayLabel,
        slots: [
          { id: "hd-5", start: "9:00 AM", end: "1:00 PM", available: true },
        ],
      },
    ],
    reviews: [
      {
        id: "r23",
        authorName: "Lisa Q.",
        rating: 5,
        date: "Mar 2026",
        text: "Dan assembled a full IKEA wardrobe and two bookshelves in under 3 hours. Efficient and friendly. My go-to for any handyman stuff.",
      },
      {
        id: "r24",
        authorName: "Mark T.",
        rating: 4,
        date: "Feb 2026",
        text: "Good drywall patch job after we removed some old shelves. Texture matching was pretty close. Fair hourly rate for SF.",
      },
      {
        id: "r25",
        authorName: "Nina C.",
        rating: 5,
        date: "Jan 2026",
        text: "Had a list of 6 small repairs. Dan knocked them all out in one visit. Super convenient and everything was done well.",
      },
    ],
    badges: ["insured", "background-checked"],
    photos: ["/providers/handyman-1.jpg", "/providers/handyman-2.jpg", "/providers/handyman-3.jpg"],
    cancellationPolicy: "Free cancellation up to 12 hours before. $30 fee for late cancellations.",
  },
  {
    id: "precision-mount-sf",
    name: "Precision AV Mounting",
    ownerName: "Ray",
    category: "tv-mounting",
    rating: 4.8,
    reviewCount: 178,
    priceRange: "$120–$280",
    pricingStructure: [
      { label: "Standard mount (up to 55\")", price: "$120" },
      { label: "Large mount (55\"–85\")", price: "$180" },
      { label: "Full concealment (in-wall)", price: "$250–$280" },
      { label: "Soundbar mount add-on", price: "$45" },
    ],
    distance: "2.8 mi",
    distanceMiles: 2.8,
    serviceArea: "Marina, Pacific Heights, Cow Hollow, Hayes Valley",
    latitude: 37.7985,
    longitude: -122.4370,
    bio: "TV and AV mounting done right. Clean installs with cord concealment options. We bring all hardware and can mount any TV on any wall type. Free stud-finding consultation.",
    yearsExperience: 6,
    specialties: ["TV mounting", "Cord concealment", "All wall types"],
    services: [
      { name: "TV wall mounting", description: "Tilt, full-motion, or fixed mounts for any TV size" },
      { name: "Cord concealment", description: "In-wall cable routing for a clean look" },
      { name: "Soundbar installation", description: "Wall-mount or shelf-mount soundbar setup" },
      { name: "Projector mounting", description: "Ceiling mount projectors with cable management" },
    ],
    availability: [
      {
        date: nextDays[0].date,
        dayLabel: nextDays[0].dayLabel,
        slots: [
          { id: "pm-1", start: "10:00 AM", end: "12:00 PM", available: true },
          { id: "pm-2", start: "2:00 PM", end: "4:00 PM", available: true },
        ],
      },
      {
        date: nextDays[1].date,
        dayLabel: nextDays[1].dayLabel,
        slots: [
          { id: "pm-3", start: "9:00 AM", end: "11:00 AM", available: false },
          { id: "pm-4", start: "1:00 PM", end: "3:00 PM", available: true },
        ],
      },
      {
        date: nextDays[2].date,
        dayLabel: nextDays[2].dayLabel,
        slots: [
          { id: "pm-5", start: "10:00 AM", end: "12:00 PM", available: true },
          { id: "pm-6", start: "3:00 PM", end: "5:00 PM", available: true },
        ],
      },
    ],
    reviews: [
      {
        id: "r26",
        authorName: "Josh L.",
        rating: 5,
        date: "Mar 2026",
        text: "Mounted a 75\" on our brick wall. Ray made it look effortless and the cord concealment is perfect — you'd never know there are cables.",
      },
      {
        id: "r27",
        authorName: "Amy H.",
        rating: 5,
        date: "Feb 2026",
        text: "Quick and professional. Mounted our TV and soundbar in under an hour. Very satisfied with how clean it looks.",
      },
      {
        id: "r28",
        authorName: "Steve P.",
        rating: 4,
        date: "Jan 2026",
        text: "Great mounting job on a plaster wall. Only 4 stars because scheduling took a few days, but the work itself was excellent.",
      },
    ],
    badges: ["insured", "background-checked"],
    photos: ["/providers/tv-mount-1.jpg", "/providers/tv-mount-2.jpg", "/providers/tv-mount-3.jpg"],
    cancellationPolicy: "Free cancellation up to 24 hours before. $50 fee for same-day cancellations.",
  },
  {
    id: "fresh-coat-painting",
    name: "Fresh Coat Painters",
    ownerName: "Miguel",
    category: "painting",
    rating: 4.7,
    reviewCount: 134,
    priceRange: "From $350/room",
    pricingStructure: [
      { label: "Single room", price: "$350–$550", note: "Walls + ceiling" },
      { label: "Two rooms", price: "$600–$950" },
      { label: "Whole apartment (1BR)", price: "From $1,200" },
      { label: "Trim & accent wall", price: "From $180" },
    ],
    distance: "4.2 mi",
    distanceMiles: 4.2,
    serviceArea: "All SF neighborhoods",
    latitude: 37.7694,
    longitude: -122.4529,
    bio: "Interior painting specialists. We prep properly, use premium paints, and leave no mess. Color consultation included on jobs over $500. Serving all of San Francisco.",
    yearsExperience: 15,
    specialties: ["Interior painting", "Color consult", "Zero-mess"],
    services: [
      { name: "Interior painting", description: "Walls, ceilings, and trim with premium paint" },
      { name: "Accent walls", description: "Feature walls, color blocking, and murals" },
      { name: "Cabinet painting", description: "Kitchen and bathroom cabinet refinishing" },
      { name: "Touch-up & repair", description: "Patch, sand, and paint damaged walls" },
    ],
    availability: [
      {
        date: nextDays[1].date,
        dayLabel: nextDays[1].dayLabel,
        slots: [
          { id: "fc-1", start: "8:00 AM", end: "12:00 PM", available: true },
        ],
      },
      {
        date: nextDays[2].date,
        dayLabel: nextDays[2].dayLabel,
        slots: [
          { id: "fc-2", start: "8:00 AM", end: "12:00 PM", available: true },
          { id: "fc-3", start: "1:00 PM", end: "5:00 PM", available: true },
        ],
      },
      {
        date: nextDays[3].date,
        dayLabel: nextDays[3].dayLabel,
        slots: [
          { id: "fc-4", start: "8:00 AM", end: "12:00 PM", available: true },
          { id: "fc-5", start: "1:00 PM", end: "5:00 PM", available: false },
        ],
      },
      {
        date: nextDays[4].date,
        dayLabel: nextDays[4].dayLabel,
        slots: [
          { id: "fc-6", start: "8:00 AM", end: "12:00 PM", available: true },
          { id: "fc-7", start: "1:00 PM", end: "5:00 PM", available: true },
        ],
      },
    ],
    reviews: [
      {
        id: "r29",
        authorName: "Diana V.",
        rating: 5,
        date: "Mar 2026",
        text: "Miguel's team painted our entire 2BR apartment in two days. The prep work was incredible — perfectly taped edges, covered all furniture. Result looks flawless.",
      },
      {
        id: "r30",
        authorName: "Greg M.",
        rating: 4,
        date: "Feb 2026",
        text: "Good paint job on our living room accent wall. Color consultation was a nice touch. Slightly above our initial budget but the quality shows.",
      },
      {
        id: "r31",
        authorName: "Tina R.",
        rating: 5,
        date: "Dec 2025",
        text: "Had our kitchen cabinets painted and they look brand new. Miguel's attention to detail is outstanding. Highly recommend for any painting job.",
      },
    ],
    badges: ["licensed", "insured"],
    photos: ["/providers/painting-1.jpg", "/providers/painting-2.jpg", "/providers/painting-3.jpg"],
    cancellationPolicy: "Free cancellation up to 48 hours before. 25% charge within 48 hours.",
  },
];

export function getProviderById(id: string): Provider | undefined {
  return providers.find((p) => p.id === id);
}

export function getProvidersByCategory(category: string): Provider[] {
  return providers.filter((p) => p.category === category);
}

export function getSearchResults(): Provider[] {
  return providers.filter((p) => p.category === "plumbing").slice(0, 5);
}

export function getPopularProviders(): Provider[] {
  return [...providers].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
}

export function getAvailableTodayProviders(): Provider[] {
  return providers.filter((p) => p.availability.length > 0 && p.availability[0].slots.some((s) => s.available)).slice(0, 4);
}
