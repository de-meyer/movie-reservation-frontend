"use client";

import React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/mock-data";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (user: User) => void;
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in production this would call your Spring Boot backend
    onLogin({
      name: email.split("@")[0] || "Guest",
      email: email,
      memberSince: new Date().getFullYear().toString(),
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(email.split("@")[0] || "G")}`,
      paymentMethods: [],
    });
    setEmail("");
    setPassword("");
    onOpenChange(false);
  };

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
