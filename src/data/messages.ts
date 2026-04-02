import type { Conversation } from "@/types";

export const conversations: Conversation[] = [
  {
    id: "conv-001",
    providerId: "golden-gate-plumbing",
    providerName: "Golden Gate Home Plumbing",
    providerAvatar: "/providers/plumbing-9.jpg",
    lastMessage: "See you Thursday morning! I'll bring everything needed for the faucet replacement.",
    lastMessageTime: "2:50 PM",
    unread: true,
    messages: [
      {
        id: "m1",
        sender: "system",
        text: "Booking confirmed for kitchen faucet replacement.",
        timestamp: "Today, 2:15 PM",
      },
      {
        id: "m2",
        sender: "user",
        text: "Hi Marcus, the faucet is a single-handle Moen in the kitchen. Just wanted to give you a heads up.",
        timestamp: "Today, 2:25 PM",
      },
      {
        id: "m3",
        sender: "provider",
        text: "Thanks for letting me know! I'll bring compatible parts. Is the shut-off valve under the sink accessible?",
        timestamp: "Today, 2:38 PM",
      },
      {
        id: "m4",
        sender: "user",
        text: "Yes, it's right under the sink. Easy to reach.",
        timestamp: "Today, 2:42 PM",
      },
      {
        id: "m5",
        sender: "provider",
        text: "See you Thursday morning! I'll bring everything needed for the faucet replacement.",
        timestamp: "Today, 2:50 PM",
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
    closed: true,
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

export function getConversationByProviderId(
  providerId: string
): Conversation | undefined {
  return conversations.find((c) => c.providerId === providerId);
}
