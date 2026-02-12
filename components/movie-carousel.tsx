"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { MovieCard } from "@/components/movie-card"
import type { Movie } from "@/lib/mock-data"
import { useState, useCallback, useEffect } from "react"

interface MovieCarouselProps {
  title: string
  movies: Movie[]
  onMovieClick: (movie: Movie) => void
  id?: string
}

export function MovieCarousel({ title, movies, onMovieClick, id }: MovieCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [api])

  useEffect(() => {
    if (!api) return
    onSelect()
    api.on("select", onSelect)
    api.on("reInit", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <section id={id} className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between pb-6">
          <h2 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">{title}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-border/60 text-foreground hover:bg-secondary bg-transparent"
              onClick={() => api?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous movies"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-border/60 text-foreground hover:bg-secondary bg-transparent"
              onClick={() => api?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next movies"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 lg:-ml-4">
            {movies.map((movie) => (
              <CarouselItem
                key={movie.id}
                className="basis-[40%] pl-3 sm:basis-[30%] md:basis-[22%] lg:basis-[18%] lg:pl-4"
              >
                <MovieCard movie={movie} onClick={onMovieClick} variant="carousel" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
