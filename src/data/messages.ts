import type { Conversation } from "@/types";

export const conversations: Conversation[] = [
  {
    id: "conv-001",
    providerId: "rapid-response-plumbing",
    providerName: "Rapid Response Plumbing",
    providerAvatar: "/providers/plumbing-12.jpg",
    lastMessage: "On my way now, see you in about 12 minutes.",
    lastMessageTime: "9:48 AM",
    unread: true,
    messages: [
      {
        id: "m1",
        sender: "system",
        text: "Booking confirmed for today, 10:00 AM – 12:00 PM.",
        timestamp: "8:45 AM",
      },
      {
        id: "m2",
        sender: "user",
        text: "Hi Carlos, the leak is under the kitchen sink on the left side. Front door code is #4521.",
        timestamp: "8:52 AM",
      },
      {
        id: "m3",
        sender: "provider",
        text: "Got it, thanks for the details. I'll bring the right tools. Should be straightforward.",
        timestamp: "9:10 AM",
      },
      {
        id: "m4",
        sender: "system",
        text: "Provider is on the way.",
        timestamp: "9:48 AM",
      },
      {
        id: "m5",
        sender: "provider",
        text: "On my way now, see you in about 12 minutes.",
        timestamp: "9:48 AM",
      },
    ],
  },
  {
    id: "conv-002",
    providerId: "sparkle-clean-sf",
    providerName: "Sparkle Clean SF",
    providerAvatar: "/providers/cleaning-1.jpg",
    lastMessage: "Thank you! Glad you liked it.",
    lastMessageTime: "Mar 27",
    unread: false,
    messages: [
      {
        id: "m6",
        sender: "system",
        text: "Booking confirmed for Mar 27, 9:00 AM – 12:00 PM.",
        timestamp: "Mar 26, 4:35 PM",
      },
      {
        id: "m7",
        sender: "provider",
        text: "Hi! We'll be there at 9 AM sharp tomorrow. Do you have any specific areas you want us to focus on?",
        timestamp: "Mar 26, 5:00 PM",
      },
      {
        id: "m8",
        sender: "user",
        text: "Yes — kitchen needs extra attention, especially behind the stove and inside the oven. Thanks!",
        timestamp: "Mar 26, 5:15 PM",
      },
      {
        id: "m9",
        sender: "provider",
        text: "Noted! We'll make sure to give the kitchen extra love.",
        timestamp: "Mar 26, 5:22 PM",
      },
      {
        id: "m10",
        sender: "system",
        text: "Service completed.",
        timestamp: "Mar 27, 11:48 AM",
      },
      {
        id: "m11",
        sender: "user",
        text: "Place looks amazing, thank you so much! Kitchen is spotless.",
        timestamp: "Mar 27, 12:30 PM",
      },
      {
        id: "m12",
        sender: "provider",
        text: "Thank you! Glad you liked it.",
        timestamp: "Mar 27, 12:45 PM",
      },
    ],
  },
];

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}
