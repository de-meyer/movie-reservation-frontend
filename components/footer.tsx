import { Film } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Film className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-lg font-bold text-foreground">CineVault</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6">
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </Link>
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Privacy
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">2026 CineVault. All rights reserved.</p>
      </div>
    </footer>
  )
}
