"use client";

import { MovieCard } from "@/components/movie-card";
import type { Movie } from "@/lib/mock-data";

interface MovieGridProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  id?: string;
}

export function MovieGrid({ title, movies, onMovieClick, id }: MovieGridProps) {
  return (
    <section id={id} className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="pb-6 font-serif text-2xl font-bold text-foreground lg:text-3xl">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-6">
          {movies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              onClick={onMovieClick}
              variant="grid"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
