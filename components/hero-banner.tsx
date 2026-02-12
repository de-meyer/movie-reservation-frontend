"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Play, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Movie } from "@/lib/mock-data"

interface HeroBannerProps {
  movies: Movie[]
  onMovieClick: (movie: Movie) => void
}

export function HeroBanner({ movies, onMovieClick }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrent(index)
        setIsTransitioning(false)
      }, 400)
    },
    [isTransitioning]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((current + 1) % movies.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [current, movies.length, goToSlide])

  const movie = movies[current]

  return (
    <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden sm:h-[60vh] lg:h-[70vh]">
      {/* Background Image */}
      {movies.map((m, i) => (
        <div
          key={m.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === current ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={m.banner || m.thumbnail}
            alt={m.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      {/* Content */}
      <div
        className={cn(
          "absolute inset-0 flex items-end transition-all duration-500",
          isTransitioning ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <div className="mx-auto w-full max-w-7xl px-4 pb-12 lg:px-8 lg:pb-16">
          <div className="flex max-w-2xl flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary text-primary-foreground border-transparent">{movie.rating}</Badge>
              <Badge variant="outline" className="border-foreground/20 text-foreground/80">
                {movie.genre}
              </Badge>
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              {movie.title}
            </h1>
            <p className="line-clamp-2 text-sm leading-relaxed text-foreground/70 sm:text-base lg:line-clamp-3">
              {movie.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-foreground/60">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {movie.duration}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {movie.director}
              </span>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => onMovieClick(movie)}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Play className="h-4 w-4" />
                View Details
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onMovieClick(movie)}
                className="border-foreground/20 text-foreground hover:bg-foreground/10"
              >
                Showtimes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {movies.map((_, i) => (
          <button
            key={movies[i].id}
            onClick={() => goToSlide(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current
                ? "w-8 bg-primary"
                : "w-1.5 bg-foreground/30 hover:bg-foreground/50"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
