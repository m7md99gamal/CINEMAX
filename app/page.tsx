"use client"

import { useEffect, useState } from "react"
import MovieCard from "@/components/movie-card"
import { motion } from "framer-motion"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
  overview: string
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true)
        const apiKey = "9905a53586e4fbd03243b64e152b9691"

        if (!apiKey) {
          setError("TMDb API key is not configured")
          return
        }

        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)

        if (!response.ok) {
          throw new Error("Failed to fetch movies")
        }

        const data = await response.json()
        setMovies(data.results || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingMovies()
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-4 text-balance">
              Discover Amazing Movies
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto text-balance">
              Explore trending films, search for your favorites, and dive deep into movie details
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Trending This Week</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-orange-500 rounded" />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
            <p className="text-red-300">{error}</p>
            <p className="text-sm text-red-300/70 mt-2">
              Please add NEXT_PUBLIC_TMDB_API_KEY to your environment variables
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-800 rounded-lg h-80 mb-4" />
                <div className="bg-slate-800 rounded h-4 w-3/4 mb-2" />
                <div className="bg-slate-800 rounded h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  rating={movie.vote_average}
                  releaseDate={movie.release_date}
                  overview={movie.overview}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
