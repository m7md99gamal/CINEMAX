"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface Cast {
  id: number
  name: string
  character: string
  profile_path: string
}

interface MovieDetails {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
  release_date: string
  runtime: number
  budget: number
  revenue: number
  genres: { id: number; name: string }[]
  cast: Cast[]
}

function MovieDetailsContent() {
  const params = useParams()
  const router = useRouter()
  const movieId = params.id as string

  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/movie/${movieId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch movie details")
        }

        const data = await response.json()
        setMovie(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [movieId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4" />
          <p className="text-slate-400">Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-300 mb-2">Error</h2>
            <p className="text-red-300 mb-4">{error || "Movie not found"}</p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/placeholder.svg"
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.svg"

  const formatCurrency = (value: number) => {
    if (!value) return "N/A"
    return `$${(value / 1000000).toFixed(1)}M`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const director = movie.crew?.find((member: any) => member.job === "Director")
  const topCast = movie.cast?.slice(0, 6) || []

  return (
    <main className="min-h-screen">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-96 md:h-[500px] overflow-hidden"
      >
        <Image src={backdropUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 -mt-32 relative z-10 mb-16">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1"
          >
            <div className="rounded-lg overflow-hidden shadow-2xl border border-slate-700">
              <Image
                src={posterUrl || "/placeholder.svg"}
                alt={movie.title}
                width={300}
                height={450}
                className="w-full object-cover"
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-3 space-y-6"
          >
            {/* Title and Rating */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{movie.title}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-red-500 rounded-full px-4 py-2">
                  <span className="text-yellow-300 text-xl">★</span>
                  <span className="font-bold text-white">{(movie.vote_average / 2).toFixed(1)}/5</span>
                </div>
                <span className="text-slate-400">{formatDate(movie.release_date)}</span>
                <span className="text-slate-400">{movie.runtime} minutes</span>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-sm font-medium hover:border-red-500 transition-colors"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Overview</h2>
              <p className="text-slate-300 leading-relaxed text-lg">{movie.overview || "No overview available."}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Budget</h3>
                <p className="text-xl font-bold text-white">{formatCurrency(movie.budget)}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-400 mb-1">Revenue</h3>
                <p className="text-xl font-bold text-white">{formatCurrency(movie.revenue)}</p>
              </div>
              {director && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-1">Director</h3>
                  <p className="text-lg font-semibold text-white">{director.name}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Cast Section */}
        {topCast.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {topCast.map((actor) => (
                <div
                  key={actor.id}
                  className="group rounded-lg overflow-hidden bg-slate-800 border border-slate-700 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                >
                  {actor.profile_path && (
                    <div className="relative h-32 sm:h-40 overflow-hidden">
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-1">{actor.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-1">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-16"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <span>←</span>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

export default function MoviePage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <MovieDetailsContent />
    </Suspense>
  )
}
