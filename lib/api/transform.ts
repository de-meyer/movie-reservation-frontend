/**
 * Transforms API responses to match the component's expected data structure
 */

import type { Movie as ApiMovie } from './models/movie';
import type { ProgramResponse } from './models/programResponse';
import type { ShowSchedule } from './models/showSchedule';
import { getImageUrl } from '../utils';

// Component's Movie interface (from mock-data)
export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  director: string;
  cast: string[];
  thumbnail: string;
  banner?: string;
  showtimes: Showtime[];
}

export interface Showtime {
  time: string;
  theater: string;
  date: string;
  rawDate: string;
  showId?: string;
}

/**
 * Transforms a ProgramResponse from the API to a Movie object for the components
 */
export function transformProgramToMovie(program: ProgramResponse): Movie {
  const { movie, shows } = program;
  
  // Transform shows to showtimes
  const showtimes: Showtime[] = shows.map((show: ShowSchedule) => ({
    time: formatShowTime(show.date),
    theater: show.theaterName,
    date: formatShowDate(show.date),
    rawDate: show.date,
    showId: show.id,
  }));

  return {
    id: movie.id,
    title: movie.title,
    description: movie.description,
    genre: movie.genre,
    duration: `${movie.durationMinutes}min`,
    director: movie.director,
    cast: [], // Cast is not in the API response
    thumbnail: getImageUrl(movie.imageProfile, 'profile'),
    banner: getImageUrl(movie.imageLandscape, 'landscape'),
    showtimes,
  };
}

/**
 * Transform multiple program responses to movies
 */
export function transformProgramsToMovies(programs: ProgramResponse[]): Movie[] {
  return programs.map(transformProgramToMovie);
}

/**
 * Formats a date string to show time (e.g., "14:30")
 */
function formatShowTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return '00:00';
  }
}

/**
 * Formats a date string to display format (e.g., "Monday, January 15")
 */
function formatShowDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Unknown date';
  }
}
