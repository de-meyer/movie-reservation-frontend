export interface Movie {
  id: number
  title: string
  description: string
  genre: string
  duration: string
  director: string
  cast: string[]
  thumbnail: string
  banner?: string
  showtimes: Showtime[]
}

export interface Showtime {
  time: string
  theater: string
  date: string
}

export interface User {
  name: string
  avatar: string
}

const todayDate = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
})

const tomorrowDate = new Date(Date.now() + 86400000).toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
})

export const featuredMovies: Movie[] = [
  {
    id: 1,
    title: "Dune: Prophecy",
    description:
      "Set 10,000 years before the events of Dune, this epic saga follows the Harkonnen Sisters as they establish the secretive order known as the Bene Gesserit to combat an existential threat to humankind.",
    genre: "Sci-Fi / Drama",
    duration: "2h 45min",
    director: "Denis Villeneuve",
    cast: ["Timothee Chalamet", "Zendaya", "Rebecca Ferguson"],
    thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&h=900&fit=crop",
    banner: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&h=700&fit=crop",
    showtimes: [
      { time: "14:00", theater: "IMAX Theater 1", date: todayDate },
      { time: "17:30", theater: "Theater 3", date: todayDate },
      { time: "20:45", theater: "IMAX Theater 1", date: todayDate },
      { time: "15:00", theater: "Theater 2", date: tomorrowDate },
      { time: "19:00", theater: "IMAX Theater 1", date: tomorrowDate },
    ],
  },
  {
    id: 2,
    title: "The Last Ember",
    description:
      "A gripping thriller where a firefighter discovers a conspiracy hidden beneath the ashes of a devastating wildfire that threatens to expose the corrupt elite of a small mountain town.",
    genre: "Thriller / Action",
    duration: "2h 12min",
    director: "Christopher Nolan",
    cast: ["Oscar Isaac", "Florence Pugh", "Idris Elba"],
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=900&fit=crop",
    banner: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1600&h=700&fit=crop",
    showtimes: [
      { time: "13:30", theater: "Theater 2", date: todayDate },
      { time: "16:00", theater: "Theater 5", date: todayDate },
      { time: "21:00", theater: "Theater 2", date: todayDate },
      { time: "14:30", theater: "Theater 4", date: tomorrowDate },
      { time: "18:30", theater: "Theater 2", date: tomorrowDate },
    ],
  },
  {
    id: 3,
    title: "Midnight Garden",
    description:
      "An enchanting fantasy adventure where a young botanist discovers a hidden garden that blooms only at midnight, unlocking a portal to a parallel world filled with magical creatures.",
    genre: "Fantasy / Adventure",
    duration: "2h 05min",
    director: "Guillermo del Toro",
    cast: ["Saoirse Ronan", "Dev Patel", "Cate Blanchett"],
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=900&fit=crop",
    banner: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&h=700&fit=crop",
    showtimes: [
      { time: "12:00", theater: "Theater 4", date: todayDate },
      { time: "15:30", theater: "Theater 6", date: todayDate },
      { time: "19:15", theater: "Theater 4", date: todayDate },
      { time: "13:00", theater: "Theater 3", date: tomorrowDate },
      { time: "17:00", theater: "Theater 6", date: tomorrowDate },
    ],
  },
  {
    id: 4,
    title: "Echoes of Steel",
    description:
      "In a dystopian future, a rogue engineer builds an underground resistance against a totalitarian regime using repurposed machines, sparking a revolution that could change the world forever.",
    genre: "Sci-Fi / Action",
    duration: "2h 20min",
    director: "Ridley Scott",
    cast: ["Pedro Pascal", "Lupita Nyong'o", "Tom Hardy"],
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=900&fit=crop",
    banner: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&h=700&fit=crop",
    showtimes: [
      { time: "14:45", theater: "IMAX Theater 1", date: todayDate },
      { time: "18:00", theater: "Theater 7", date: todayDate },
      { time: "21:30", theater: "IMAX Theater 1", date: todayDate },
      { time: "16:00", theater: "Theater 5", date: tomorrowDate },
      { time: "20:00", theater: "IMAX Theater 1", date: tomorrowDate },
    ],
  },
]

export const todayMovies: Movie[] = [
  ...featuredMovies,
  {
    id: 5,
    title: "The Silent Witness",
    description:
      "A courtroom drama that follows a deaf lawyer who must prove the innocence of a wrongly accused man using only visual evidence in a case that captivates the entire nation.",
    genre: "Drama / Thriller",
    duration: "1h 58min",
    director: "Greta Gerwig",
    cast: ["Margot Robbie", "Rami Malek", "Viola Davis"],
    thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=900&fit=crop",
    showtimes: [
      { time: "11:30", theater: "Theater 3", date: todayDate },
      { time: "14:15", theater: "Theater 5", date: todayDate },
      { time: "17:45", theater: "Theater 3", date: todayDate },
    ],
  },
  {
    id: 6,
    title: "Aurora Rising",
    description:
      "A visually stunning space opera where a crew of misfit astronauts discovers an alien signal originating from a nebula, leading them on a perilous journey to the edge of the known universe.",
    genre: "Sci-Fi / Adventure",
    duration: "2h 35min",
    director: "James Cameron",
    cast: ["John Boyega", "Zoe Saldana", "Ana de Armas"],
    thumbnail: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=900&fit=crop",
    showtimes: [
      { time: "13:00", theater: "IMAX Theater 1", date: todayDate },
      { time: "16:30", theater: "Theater 2", date: todayDate },
      { time: "20:00", theater: "IMAX Theater 1", date: todayDate },
    ],
  },
  {
    id: 7,
    title: "Crimson Tide",
    description:
      "A heart-pounding submarine thriller where the crew must navigate deadly waters and internal conflict when their captain receives conflicting orders during an international crisis.",
    genre: "Action / Thriller",
    duration: "2h 08min",
    director: "Kathryn Bigelow",
    cast: ["Michael B. Jordan", "Daniel Kaluuya", "Jenna Ortega"],
    thumbnail: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=900&fit=crop",
    showtimes: [
      { time: "15:00", theater: "Theater 6", date: todayDate },
      { time: "18:30", theater: "Theater 4", date: todayDate },
      { time: "22:00", theater: "Theater 6", date: todayDate },
    ],
  },
  {
    id: 8,
    title: "Whispers in the Wind",
    description:
      "A poetic romance set in 1920s Ireland, following two star-crossed lovers whose forbidden relationship defies the social and political turmoil of their time.",
    genre: "Romance / Drama",
    duration: "1h 52min",
    director: "Barry Jenkins",
    cast: ["Andrew Garfield", "Lily James", "Cillian Murphy"],
    thumbnail: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=600&h=900&fit=crop",
    showtimes: [
      { time: "12:30", theater: "Theater 7", date: todayDate },
      { time: "16:00", theater: "Theater 3", date: todayDate },
      { time: "19:30", theater: "Theater 7", date: todayDate },
    ],
  },
]

export const tomorrowMovies: Movie[] = [
  featuredMovies[0],
  featuredMovies[1],
  featuredMovies[2],
  featuredMovies[3],
  {
    id: 9,
    title: "The Architects",
    description:
      "A mind-bending heist film where a team of architects design an impossible building as a cover for the greatest art theft in history, blending reality and illusion.",
    genre: "Thriller / Mystery",
    duration: "2h 15min",
    director: "David Fincher",
    cast: ["Ryan Gosling", "Anya Taylor-Joy", "Oscar Isaac"],
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop",
    showtimes: [
      { time: "14:00", theater: "Theater 2", date: tomorrowDate },
      { time: "17:30", theater: "Theater 5", date: tomorrowDate },
      { time: "21:00", theater: "Theater 2", date: tomorrowDate },
    ],
  },
  {
    id: 10,
    title: "Neon Requiem",
    description:
      "A cyberpunk noir detective story set in a rain-soaked megacity where a jaded investigator uncovers a conspiracy that blurs the lines between human consciousness and AI.",
    genre: "Sci-Fi / Noir",
    duration: "2h 22min",
    director: "Denis Villeneuve",
    cast: ["Keanu Reeves", "Tilda Swinton", "Dev Patel"],
    thumbnail: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&h=900&fit=crop",
    showtimes: [
      { time: "15:30", theater: "IMAX Theater 1", date: tomorrowDate },
      { time: "19:00", theater: "Theater 4", date: tomorrowDate },
      { time: "22:15", theater: "IMAX Theater 1", date: tomorrowDate },
    ],
  },
  {
    id: 11,
    title: "Golden Hour",
    description:
      "A sweeping period drama about a pioneering photographer in 1890s California whose work capturing the last wild landscapes ignites a conservation movement.",
    genre: "Drama / Historical",
    duration: "2h 01min",
    director: "Terrence Malick",
    cast: ["Cate Blanchett", "Brad Pitt", "Saoirse Ronan"],
    thumbnail: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=600&h=900&fit=crop",
    showtimes: [
      { time: "12:00", theater: "Theater 3", date: tomorrowDate },
      { time: "16:00", theater: "Theater 6", date: tomorrowDate },
      { time: "19:30", theater: "Theater 3", date: tomorrowDate },
    ],
  },
]

export const allMovies: Movie[] = [
  ...todayMovies,
  ...tomorrowMovies.filter((m) => !todayMovies.find((t) => t.id === m.id)),
]
