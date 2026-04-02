"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

import { conversations } from "@/data/messages";
import type { Conversation } from "@/types";
import { cn } from "@/lib/utils";

function ConversationRow({ conversation }: { conversation: Conversation }) {
  return (
    <Link href={`/messages/${conversation.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-2xl px-1 py-3 transition-colors hover:bg-accent/40"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
          {conversation.providerName.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={cn(
                "truncate text-sm",
                conversation.unread
                  ? "font-semibold text-foreground"
                  : "font-medium text-foreground"
              )}
            >
              {conversation.providerName}
            </h3>
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {conversation.lastMessageTime}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2">
            <p
              className={cn(
                "truncate text-xs",
                conversation.unread
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {conversation.lastMessage}
            </p>
            {conversation.unread && (
              <div className="h-2 w-2 shrink-0 rounded-full bg-foreground" />
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function EmptyMessages() {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <MessageSquare
          size={22}
          strokeWidth={1.5}
          className="text-muted-foreground"
        />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">
        No conversations yet
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Messages with providers will appear here.
      </p>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <div className="flex flex-1 flex-col px-5 pt-20 pb-20">
      <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Conversations with your service providers.
      </p>

      {conversations.length === 0 ? (
        <EmptyMessages />
      ) : (
        <div className="mt-6 divide-y divide-border">
          {conversations.map((conv) => (
            <ConversationRow key={conv.id} conversation={conv} />
          ))}
        </div>
      )}
    </div>
  );
}
