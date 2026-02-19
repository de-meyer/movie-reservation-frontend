"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Sign in to your CineVault account to book tickets and manage your
            profile.
          </DialogDescription>
        </DialogHeader>

        <Button
          type="button"
          onClick={() =>
            (window.location.href =
              "http://localhost:8080/oauth2/authorization/discord")
          }
          className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
          Sign in with Discord
        </Button>
      </DialogContent>
    </Dialog>
  );
}
