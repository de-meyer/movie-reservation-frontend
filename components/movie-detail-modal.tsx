"use client"

import Image from "next/image"
import { Clock, MapPin, Calendar, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { Movie } from "@/lib/mock-data"

interface MovieDetailModalProps {
  movie: Movie | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MovieDetailModal({ movie, open, onOpenChange }: MovieDetailModalProps) {
  if (!movie) return null

  const showtimesByDate = movie.showtimes.reduce(
    (acc, st) => {
      if (!acc[st.date]) acc[st.date] = []
      acc[st.date].push(st)
      return acc
    },
    {} as Record<string, typeof movie.showtimes>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-2xl bg-card text-card-foreground">
        {/* Movie Banner */}
        <div className="relative h-56 w-full sm:h-64">
          <Image
            src={movie.banner || movie.thumbnail}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 672px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute bottom-0 left-0 flex items-end gap-4 p-6">
            <div className="relative hidden h-32 w-22 shrink-0 overflow-hidden rounded-md shadow-lg sm:block">
              <Image
                src={movie.thumbnail || "/placeholder.svg"}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="88px"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-primary-foreground border-transparent">{movie.rating}</Badge>
                <Badge variant="outline" className="border-foreground/20 text-foreground/80">
                  {movie.genre}
                </Badge>
              </div>
              <DialogHeader className="text-left">
                <DialogTitle className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                  {movie.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Details and showtimes for {movie.title}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-[50vh]">
          <div className="flex flex-col gap-6 p-6 pt-2">
            {/* Info Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                {movie.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                {movie.director}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-foreground/80">{movie.description}</p>

            {/* Cast */}
            <div>
              <h4 className="pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Cast
              </h4>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor) => (
                  <Badge key={actor} variant="secondary" className="bg-secondary text-secondary-foreground font-normal">
                    {actor}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Showtimes */}
            <div>
              <h4 className="pb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Showtimes
              </h4>
              <div className="flex flex-col gap-5">
                {Object.entries(showtimesByDate).map(([date, times]) => (
                  <div key={date} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      {date}
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {times.map((st, i) => (
                        <button
                          key={`${st.time}-${st.theater}-${i}`}
                          type="button"
                          className="flex items-center justify-between rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary hover:bg-primary/5"
                        >
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-semibold text-foreground">{st.time}</span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {st.theater}
                            </span>
                          </div>
                          <Button size="sm" variant="ghost" className="text-xs text-primary hover:bg-primary/10 hover:text-primary">
                            Book
                          </Button>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
