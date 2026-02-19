"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Film, Menu, X, LogIn, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginDialog } from "@/components/login-dialog";
import { useUserStore } from "@/hooks/use-user-information";
import { useMe } from "@/lib/api/endpoints/user/user";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Now Playing", href: "#now-playing" },
  { label: "Coming Soon", href: "#coming-soon" },
  { label: "All Movies", href: "#all-movies" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, isAuthenticated, setUser, clearUser } = useUserStore();

  // Fetch current user on mount (handles OAuth redirect)
  const { data: meData } = useMe();

  useEffect(() => {
    if (meData?.data && !isAuthenticated) {
      const userData = meData.data as {
        id?: string;
        name?: string;
        email?: string;
        role?: string;
      };
      if (userData.name && userData.email) {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role || "user",
        });
      }
    }
  }, [meData, isAuthenticated, setUser]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link href="#" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Film className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              CineVault
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium text-foreground lg:block">
                      {user.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-foreground">
                    {user.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={clearUser}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                onClick={() => setLoginOpen(true)}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Log in</span>
              </Button>
            )}

            {/* Mobile Hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu">
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-border/50 bg-background md:hidden">
            <ul className="flex flex-col px-4 py-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
