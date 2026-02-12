"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { HeroBanner } from "@/components/hero-banner"
import { MovieCarousel } from "@/components/movie-carousel"
import { MovieGrid } from "@/components/movie-grid"
import { MovieDetailModal } from "@/components/movie-detail-modal"
import { Footer } from "@/components/footer"
import { type Movie, type User } from "@/lib/mock-data"
import { useGetCurrentProgram } from "@/lib/api/endpoints/program/program"
import { useGetTodayProgram } from "@/lib/api/endpoints/program/program"
import { useGetTomorrowProgram } from "@/lib/api/endpoints/program/program"
import { transformProgramsToMovies } from "@/lib/api/transform"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Fetch data from API
  const { data: currentProgramData, isLoading: isLoadingCurrent, error: errorCurrent } = useGetCurrentProgram()
  const { data: todayProgramData, isLoading: isLoadingToday, error: errorToday } = useGetTodayProgram()
  const { data: tomorrowProgramData, isLoading: isLoadingTomorrow, error: errorTomorrow } = useGetTomorrowProgram()

  // Debug: Log the data structure
  console.log('Current Program Data:', currentProgramData)
  console.log('Today Program Data:', todayProgramData)
  console.log('Tomorrow Program Data:', tomorrowProgramData)
  console.log('Errors:', { errorCurrent, errorToday, errorTomorrow })

  // Transform API data to component format
  const allMovies = useMemo(() => {
    console.log('Transforming current program:', currentProgramData)
    // Check if data is directly an array or wrapped in .data property
    const programs = Array.isArray(currentProgramData) ? currentProgramData : currentProgramData?.data
    if (!programs || !Array.isArray(programs)) return []
    return transformProgramsToMovies(programs)
  }, [currentProgramData])

  const todayMovies = useMemo(() => {
    console.log('Transforming today program:', todayProgramData)
    // Check if data is directly an array or wrapped in .data property
    const programs = Array.isArray(todayProgramData) ? todayProgramData : todayProgramData?.data
    console.log('Today programs extracted:', programs)
    console.log('Is programs an array?', Array.isArray(programs))
    console.log('Programs length:', programs?.length)
    if (!programs || !Array.isArray(programs)) return []
    const transformed = transformProgramsToMovies(programs)
    console.log('Today movies transformed:', transformed)
    console.log('Today movies count:', transformed.length)
    return transformed
  }, [todayProgramData])

  const tomorrowMovies = useMemo(() => {
    console.log('Transforming tomorrow program:', tomorrowProgramData)
    // Check if data is directly an array or wrapped in .data property
    const programs = Array.isArray(tomorrowProgramData) ? tomorrowProgramData : tomorrowProgramData?.data
    if (!programs || !Array.isArray(programs)) return []
    return transformProgramsToMovies(programs)
  }, [tomorrowProgramData])

  // Use first 4 movies from today for featured movies carousel
  const featuredMovies = useMemo(() => {
    const featured = todayMovies.slice(0, 4)
    console.log('Featured Movies for banner:', featured)
    console.log('Featured Movies count:', featured.length)
    if (featured.length > 0) {
      console.log('First featured movie:', featured[0])
      console.log('First movie banner:', featured[0]?.banner)
      console.log('First movie thumbnail:', featured[0]?.thumbnail)
    }
    return featured
  }, [todayMovies])

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

  const isLoading = isLoadingCurrent || isLoadingToday || isLoadingTomorrow
  const hasError = errorCurrent || errorToday || errorTomorrow

  console.log('=== RENDER STATE ===')
  console.log('isLoading:', isLoading)
  console.log('hasError:', hasError)
  console.log('featuredMovies.length:', featuredMovies.length)
  console.log('todayMovies.length:', todayMovies.length)
  console.log('allMovies.length:', allMovies.length)
  console.log('==================')

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar user={user} onLogin={handleLogin} onLogout={handleLogout} />

      <main className="flex-1">
        {/* Hero Banner - Auto-sliding carousel */}
        {hasError ? (
          <div className="flex flex-col items-center justify-center h-[600px] gap-4">
            <p className="text-destructive">Error loading movies from backend</p>
            <p className="text-muted-foreground text-sm">Make sure your backend is running on {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}</p>
            <p className="text-muted-foreground text-xs">Check browser console for details</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-[600px]">
            <p className="text-muted-foreground">Loading movies...</p>
          </div>
        ) : featuredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[600px] gap-4">
            <p className="text-muted-foreground">No movies available</p>
            <p className="text-muted-foreground text-sm">The backend returned no movies</p>
          </div>
        ) : (
          <>
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
          </>
        )}
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
