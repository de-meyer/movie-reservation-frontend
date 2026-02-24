"use client";

import { useState } from "react";
import {
  User,
  Ticket,
  Trash2,
  History,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { User as UserType, Reservation } from "@/lib/mock-data";

type Section = "profile" | "reservations";

interface ProfileModalProps {
  user: UserType | null;
  reservations: Reservation[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteAccount: () => void;
}

const menuItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "reservations", label: "Reservations", icon: Ticket },
];

export function ProfileModal({
  user,
  reservations,
  open,
  onOpenChange,
  onDeleteAccount,
}: ProfileModalProps) {
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [showHistory, setShowHistory] = useState(false);

  if (!user) return null;

  const upcomingReservations = reservations.filter((r) => r.status === "upcoming");
  const pastReservations = reservations.filter((r) => r.status === "past");

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-3xl bg-card text-card-foreground">
        {/* Hidden accessible title */}
        <DialogHeader className="sr-only">
          <DialogTitle>My Account</DialogTitle>
          <DialogDescription>Manage your profile and reservations</DialogDescription>
        </DialogHeader>

        <div className="flex h-full min-h-[520px]">
          {/* Left Sidebar */}
          <div className="flex w-52 shrink-0 flex-col border-r border-border bg-secondary/30">
            {/* User summary */}
            <div className="flex flex-col items-center gap-2 p-5 pb-4">
              <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground leading-tight">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Nav items */}
            <nav className="flex flex-col gap-1 p-3 flex-1">
              {menuItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left w-full ${
                    activeSection === id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                  {id === "reservations" && upcomingReservations.length > 0 && (
                    <span
                      className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                        activeSection === id
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary/15 text-primary"
                      }`}
                    >
                      {upcomingReservations.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {activeSection === "profile" && (
              <ProfileSection
                user={user}
                onDeleteAccount={() => {
                  onDeleteAccount();
                  onOpenChange(false);
                }}
              />
            )}
            {activeSection === "reservations" && (
              <ReservationsSection
                upcoming={upcomingReservations}
                past={pastReservations}
                showHistory={showHistory}
                onToggleHistory={() => setShowHistory((v) => !v)}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────── Profile Section ─────────────────────── */

function ProfileSection({
  user,
  onDeleteAccount,
}: {
  user: UserType;
  onDeleteAccount: () => void;
}) {
  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-6 p-6">
        {/* Section header */}
        <div>
          <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Member since {user.memberSince}
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-3">
          <InfoRow label="Full Name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          {user.phone && <InfoRow label="Phone" value={user.phone} />}
        </div>

        <Separator className="bg-border" />

        {/* Danger zone */}
        <div>
          <h3 className="text-sm font-semibold text-destructive flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All your reservations, payment methods, and
                  personal data will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </ScrollArea>
  );
}

/* ─────────────────────── Reservations Section ─────────────────────── */

function ReservationsSection({
  upcoming,
  past,
  showHistory,
  onToggleHistory,
}: {
  upcoming: Reservation[];
  past: Reservation[];
  showHistory: boolean;
  onToggleHistory: () => void;
}) {
  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-6 p-6">
        {/* Upcoming */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Upcoming Reservations</h2>
            <Badge variant="secondary">{upcoming.length}</Badge>
          </div>

          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming reservations.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((r) => (
                <ReservationCard key={r.id} reservation={r} />
              ))}
            </div>
          )}
        </div>

        {/* History toggle */}
        <div>
          <button
            type="button"
            onClick={onToggleHistory}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <History className="h-4 w-4" />
            {showHistory ? "Hide History" : "View History"}
            <ChevronRight
              className={`h-4 w-4 transition-transform ${showHistory ? "rotate-90" : ""}`}
            />
          </button>

          {showHistory && (
            <div className="mt-3 flex flex-col gap-3">
              {past.length === 0 ? (
                <p className="text-sm text-muted-foreground">No past reservations.</p>
              ) : (
                past.map((r) => (
                  <ReservationCard key={r.id} reservation={r} isPast />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}

/* ─────────────────────── Reservation Card ─────────────────────── */

function ReservationCard({
  reservation: r,
  isPast = false,
}: {
  reservation: Reservation;
  isPast?: boolean;
}) {
  return (
    <div
      className={`flex gap-3 rounded-lg border bg-background p-3 ${
        isPast ? "border-border opacity-60" : "border-border hover:border-primary/40"
      } transition-colors`}
    >
      {/* Thumbnail */}
      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md bg-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={r.movieThumbnail}
          alt={r.movieTitle}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{r.movieTitle}</p>
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 shrink-0" />
            {r.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 shrink-0" />
            {r.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0" />
            {r.theater}
          </span>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <span className="text-sm font-semibold text-foreground">${r.totalPrice.toFixed(2)}</span>
        <div className="flex flex-wrap justify-end gap-1">
          {r.seats.map((seat) => (
            <Badge key={seat} variant="outline" className="text-xs px-1.5 py-0">
              {seat}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Helpers ─────────────────────── */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}
