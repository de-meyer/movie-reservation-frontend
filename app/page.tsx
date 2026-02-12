"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { HeroBanner } from "@/components/hero-banner"
import { MovieCarousel } from "@/components/movie-carousel"
import { MovieGrid } from "@/components/movie-grid"
import { MovieDetailModal } from "@/components/movie-detail-modal"
import { Footer } from "@/components/footer"
import {
  featuredMovies,
  todayMovies,
  tomorrowMovies,
  allMovies,
  type Movie,
  type User,
} from "@/lib/mock-data"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setModalOpen(true)
  }

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />

      <main className="flex-1">
        {/* Hero Banner - Auto-sliding carousel */}
        <HeroBanner movies={featuredMovies} onMovieClick={handleMovieClick} />

        {/* Today's Movies - Manual carousel */}
        <MovieCarousel
          id="now-playing"
          title="Playing Today"
          movies={todayMovies}
          onMovieClick={handleMovieClick}
        />

        {/* Divider */}
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="h-px bg-border/50" />
        </div>

        {/* Tomorrow's Movies - Manual carousel */}
        <MovieCarousel
          id="coming-soon"
          title="Playing Tomorrow"
          movies={tomorrowMovies}
          onMovieClick={handleMovieClick}
        />

        {/* Divider */}
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="h-px bg-border/50" />
        </div>

        {/* All Movies Grid */}
        <MovieGrid
          id="all-movies"
          title="Current Program"
          movies={allMovies}
          onMovieClick={handleMovieClick}
        />
      </main>

      <Footer />

      {/* Movie Detail Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}
