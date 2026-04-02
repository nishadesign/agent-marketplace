"use client";

import { useState } from "react";
import {
  Pencil,
  ChevronRight,
  Settings,
  CreditCard,
  Briefcase,
  MapPin,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const MENU_ITEMS = [
  { label: "Account Settings", icon: Settings },
  { label: "Manage Payment Methods", icon: CreditCard },
] as const;

export default function ProfilePage() {
  const [name, setName] = useState("Emma");
  const [phone, setPhone] = useState("+1 (415) 555-0142");
  const [address, setAddress] = useState("1247 Noe Valley, San Francisco, CA 94114");

  const [editOpen, setEditOpen] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftPhone, setDraftPhone] = useState(phone);
  const [draftAddress, setDraftAddress] = useState(address);

  function openEdit() {
    setDraftName(name);
    setDraftPhone(phone);
    setDraftAddress(address);
    setEditOpen(true);
  }

  function saveEdit() {
    setName(draftName.trim());
    setPhone(draftPhone.trim());
    setAddress(draftAddress.trim());
    setEditOpen(false);
  }

  return (
    <div className="flex flex-1 flex-col px-4 pt-20">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your account and preferences.
      </p>

      {/* User info card */}
      <Card className="mt-6">
        <CardContent className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg font-medium">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="text-base font-medium leading-snug">{name}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{phone}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={12} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{address}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={openEdit}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Edit profile"
          >
            <Pencil size={18} strokeWidth={1.5} />
          </button>
        </CardContent>
      </Card>

      {/* Edit profile dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-name" className="text-xs font-medium text-muted-foreground">
                Name
              </label>
              <Input
                id="edit-name"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-phone" className="text-xs font-medium text-muted-foreground">
                Phone
              </label>
              <Input
                id="edit-phone"
                type="tel"
                value={draftPhone}
                onChange={(e) => setDraftPhone(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-address" className="text-xs font-medium text-muted-foreground">
                Address
              </label>
              <Input
                id="edit-address"
                value={draftAddress}
                onChange={(e) => setDraftAddress(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={saveEdit} className="w-full sm:w-auto">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Menu options */}
      <div className="mt-6 flex flex-col gap-1">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-accent"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <item.icon size={18} strokeWidth={1.5} />
            </span>
            <span className="flex-1 text-sm font-medium">{item.label}</span>
            <ChevronRight
              size={18}
              strokeWidth={1.5}
              className="text-muted-foreground"
            />
          </button>
        ))}
      </div>

      {/* Become a service provider */}
      <Card className="mt-6 bg-foreground text-background">
        <CardContent>
          <button
            type="button"
            className="flex w-full items-center gap-3 text-left"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-background/10">
              <Briefcase size={18} strokeWidth={1.5} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">Become a Service Provider</p>
              <p className="mt-0.5 text-xs text-background/60">
                List your services and start earning
              </p>
            </div>
            <ChevronRight size={18} strokeWidth={1.5} className="opacity-60" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
