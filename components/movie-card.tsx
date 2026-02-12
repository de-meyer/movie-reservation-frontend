"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import type { Movie } from "@/lib/mock-data"

interface MovieCardProps {
  movie: Movie
  onClick: (movie: Movie) => void
  className?: string
  variant?: "carousel" | "grid"
}

export function MovieCard({ movie, onClick, className, variant = "carousel" }: MovieCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(movie)}
      className={cn(
        "group flex flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg",
          variant === "carousel" ? "aspect-[2/3]" : "aspect-[2/3]"
        )}
      >
        <Image
          src={movie.thumbnail || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={variant === "grid" ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" : "200px"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
            <svg className="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 pt-3">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        {variant === "grid" && (
          <p className="text-xs text-muted-foreground">{movie.genre}</p>
        )}
      </div>
    </button>
  )
}
