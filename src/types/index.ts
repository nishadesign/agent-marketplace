export interface Provider {
  id: string;
  name: string;
  ownerName: string;
  category: ServiceCategory;
  rating: number;
  reviewCount: number;
  priceRange: string;
  pricingStructure: PricingItem[];
  distance: string;
  distanceMiles: number;
  serviceArea: string;
  latitude: number;
  longitude: number;
  bio: string;
  yearsExperience: number;
  specialties: string[];
  services: ServiceItem[];
  availability: AvailabilityDay[];
  reviews: Review[];
  badges: TrustBadge[];
  photos: string[];
  cancellationPolicy: string;
  aiTag?: AiRecommendationTag;
}

export type ServiceCategory =
  | "plumbing"
  | "cleaning"
  | "electrical"
  | "handyman"
  | "tv-mounting"
  | "painting"
  | "pest-control"
  | "appliance-repair";

export interface ServiceItem {
  name: string;
  description: string;
  priceRange?: string;
}

export interface PricingItem {
  label: string;
  price: string;
  note?: string;
}

export interface AvailabilityDay {
  date: string;
  dayLabel: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  available: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  text: string;
}

export type TrustBadge = "licensed" | "insured" | "background-checked";

export type AiRecommendationTag =
  | "Best Matched"
  | "Instant"
  | "Top-Rated";

export type BookingStatus =
  | "confirmed"
  | "provider-en-route"
  | "arriving-soon"
  | "in-progress"
  | "completed"
  | "cancelled";

export interface ReceiptItem {
  label: string;
  amount: string;
}

export interface Receipt {
  items: ReceiptItem[];
  total: string;
  paidAt?: string;
}

export interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  providerPhoto: string;
  serviceType: string;
  serviceSummary: string;
  date: string;
  time: string;
  address: string;
  status: BookingStatus;
  priceEstimate: string;
  statusTimeline: StatusTimelineEntry[];
  eta?: string;
  notes?: string;
  agentSummary?: string;
  receipt?: Receipt;
}

export interface StatusTimelineEntry {
  label: string;
  time?: string;
  completed: boolean;
  active?: boolean;
  description?: string;
}

export interface Conversation {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  closed?: boolean;
  messages: Message[];
}

export type MessageSender = "user" | "provider" | "system";

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
}

export interface CategoryItem {
  id: ServiceCategory;
  label: string;
  icon: string;
}

export interface AgentInterpretation {
  serviceType: string;
  when: string;
  budget: string;
  location: string;
  specialRequirements?: string;
}
