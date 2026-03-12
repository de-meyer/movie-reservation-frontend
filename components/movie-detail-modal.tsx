"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Movie, Showtime } from "@/lib/mock-data";
import type { SeatResponse } from "@/lib/api/models";
import {
  useListTheaters,
  useGetTheaterSeats,
} from "@/lib/api/endpoints/theater-controller/theater-controller";
import {
  useGetReservations,
  useCreateReservation,
} from "@/lib/api/endpoints/reservation-controller/reservation-controller";
import { useMe } from "@/lib/api/endpoints/user/user";

type ModalView = "detail" | "seats" | "confirmed";

interface MovieDetailModalProps {
  movie: Movie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MovieDetailModal({
  movie,
  open,
  onOpenChange,
}: MovieDetailModalProps) {
  const [view, setView] = useState<ModalView>("detail");
  const [bookingShowtime, setBookingShowtime] = useState<Showtime | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const { data: meData } = useMe({ query: { retry: false } });

  const { data: theatersData, isLoading: isLoadingTheaters } = useListTheaters({
    query: { enabled: !!bookingShowtime },
  });

  const { data: reservationsData, isLoading: isLoadingReservations } =
    useGetReservations({ query: { enabled: !!bookingShowtime && !!movie } });

  const { mutate: createReservation, isPending: isCreating } =
    useCreateReservation();

  const theaters =
    theatersData?.data ?? (Array.isArray(theatersData) ? theatersData : []);
  const reservations =
    reservationsData?.data ??
    (Array.isArray(reservationsData) ? reservationsData : []);

  const theater = theaters.find((t) => t.name === bookingShowtime?.theater);
  const capacity = theater?.capacity ?? 0;

  const { data: theaterSeatsData, isLoading: isLoadingTheaterSeats } =
    useGetTheaterSeats(theater?.id ?? "", {
      query: { enabled: !!theater?.id },
    });

  const seats: SeatResponse[] =
    theaterSeatsData?.data ??
    (Array.isArray(theaterSeatsData) ? theaterSeatsData : []);

  const seatsByRow = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    },
    {} as Record<string, SeatResponse[]>,
  );
  const sortedRows = Object.keys(seatsByRow).sort();

  const takenSeats = new Set(
    reservations
      .filter((r) => r.movieId === movie?.id)
      .map((r) => r.seatNumber),
  );

  const handleBookClick = (showtime: Showtime) => {
    setBookingShowtime(showtime);
    setSelectedSeat(null);
    setBookingError(null);
    setView("seats");
  };

  const handleBack = () => {
    setView("detail");
    setBookingShowtime(null);
    setSelectedSeat(null);
    setBookingError(null);
  };

  const selectedSeatObj = seats.find((s) => s.id === selectedSeat) ?? null;

  const handleConfirm = () => {
    if (!selectedSeatObj || !theater?.id || !movie?.id) return;
    setBookingError(null);
    createReservation(
      {
        data: {
          userId: meData?.id ?? "",
          theaterId: theater.id,
          seatNumber: selectedSeatObj.number,
          movieId: movie.id,
          date: bookingShowtime?.rawDate ?? bookingShowtime?.date ?? "",
        },
      },
      {
        onSuccess: () => setView("confirmed"),
        onError: () =>
          setBookingError("Failed to complete booking. Please try again."),
      },
    );
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setView("detail");
      setBookingShowtime(null);
      setSelectedSeat(null);
      setBookingError(null);
    }
    onOpenChange(isOpen);
  };

  if (!movie) return null;

  const showtimesByDate = movie.showtimes.reduce(
    (acc, st) => {
      if (!acc[st.date]) acc[st.date] = [];
      acc[st.date].push(st);
      return acc;
    },
    {} as Record<string, typeof movie.showtimes>,
  );

  const isLoadingSeats =
    isLoadingTheaters || isLoadingReservations || isLoadingTheaterSeats;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
                <Badge
                  variant="outline"
                  className="border-foreground/20 text-foreground/80">
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

        {/* ── Detail / Showtimes view ── */}
        {view === "detail" && (
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
              <p className="text-sm leading-relaxed text-foreground/80">
                {movie.description}
              </p>

              {/* Cast */}
              {movie.cast.length > 0 && (
                <div>
                  <h4 className="pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Cast
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor) => (
                      <Badge
                        key={actor}
                        variant="secondary"
                        className="bg-secondary text-secondary-foreground font-normal">
                        {actor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

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
                            onClick={() => handleBookClick(st)}
                            className="flex items-center justify-between rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary hover:bg-primary/5">
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-semibold text-foreground">
                                {st.time}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {st.theater}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="pointer-events-none text-xs text-primary">
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
        )}

        {/* ── Seat Selection view ── */}
        {view === "seats" && bookingShowtime && (
          <ScrollArea className="max-h-[50vh]">
            <div className="flex flex-col gap-5 p-6 pt-4">
              {/* Back + Showtime summary */}
              <div className="flex items-start gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-0.5 shrink-0"
                  onClick={handleBack}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    Select a seat
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {bookingShowtime.date} &middot; {bookingShowtime.time}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {bookingShowtime.theater}
                    {theater && (
                      <span className="text-muted-foreground/60">
                        &mdash; {capacity} seats total
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-4 w-4 rounded border border-border bg-background" />
                  Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-4 w-4 rounded bg-primary" />
                  Selected
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-4 w-4 rounded bg-muted-foreground/30" />
                  Taken
                </span>
              </div>

              {/* Seat grid */}
              {isLoadingSeats ? (
                <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                  Loading seats…
                </div>
              ) : seats.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                  Theater information unavailable
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  {/* Screen indicator */}
                  <div className="mb-2 w-3/4 rounded-sm bg-muted py-1 text-center text-xs text-muted-foreground tracking-widest">
                    SCREEN
                  </div>
                  {sortedRows.map((row) => (
                    <div key={row} className="flex items-center gap-1.5">
                      <span className="w-4 shrink-0 text-right text-[10px] font-semibold text-muted-foreground">
                        {row}
                      </span>
                      <div className="flex gap-1.5">
                        {seatsByRow[row]
                          .slice()
                          .sort((a, b) => a.number - b.number)
                          .map((seat) => {
                            const isTaken = takenSeats.has(seat.number);
                            const isSelected = selectedSeat === seat.id;
                            return (
                              <button
                                key={seat.id}
                                type="button"
                                disabled={isTaken}
                                onClick={() =>
                                  setSelectedSeat(isSelected ? null : seat.id)
                                }
                                title={`${row}${seat.number}${isTaken ? " (taken)" : ""}`}
                                className={[
                                  "flex h-7 w-7 items-center justify-center rounded text-[10px] font-medium transition-colors",
                                  isTaken
                                    ? "cursor-not-allowed bg-muted-foreground/30 text-muted-foreground/50"
                                    : isSelected
                                      ? "bg-primary text-primary-foreground shadow"
                                      : "border border-border bg-background text-foreground hover:border-primary hover:bg-primary/10",
                                ].join(" ")}>
                                {seat.number}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {bookingError && (
                <p className="text-center text-sm text-destructive">
                  {bookingError}
                </p>
              )}

              {/* Confirm button */}
              <Button
                className="w-full"
                disabled={!selectedSeatObj || isCreating || !theater?.id}
                onClick={handleConfirm}>
                {isCreating
                  ? "Booking…"
                  : selectedSeatObj
                    ? `Confirm seat ${selectedSeatObj.row}${selectedSeatObj.number}`
                    : "Choose a seat to continue"}
              </Button>
            </div>
          </ScrollArea>
        )}

        {/* ── Confirmation view ── */}
        {view === "confirmed" && bookingShowtime && (
          <div className="flex flex-col items-center gap-5 px-6 py-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
            <div className="flex flex-col gap-1">
              <p className="text-lg font-semibold text-foreground">
                Booking confirmed!
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {movie.title}
                </span>{" "}
                &middot; Seat{" "}
                <span className="font-medium text-foreground">
                  {selectedSeatObj
                    ? `${selectedSeatObj.row}${selectedSeatObj.number}`
                    : ""}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                {bookingShowtime.date} &middot; {bookingShowtime.time}
              </p>
              <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {bookingShowtime.theater}
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => handleClose(false)}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
