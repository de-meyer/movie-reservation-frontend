"use client"

import React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/lib/mock-data"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (user: User) => void
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login - in production this would call your Spring Boot backend
    onLogin({
      name: email.split("@")[0] || "Guest",
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(email.split("@")[0] || "G")}`,
    })
    setEmail("")
    setPassword("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-foreground">Welcome Back</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Sign in to your CineVault account to book tickets and manage your profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background text-foreground"
            />
          </div>
          <Button type="submit" className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
            Sign In
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {"Don't have an account? "}
            <button type="button" className="text-primary hover:underline">
              Register
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
