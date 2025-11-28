"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import MovieCard from "@/components/movie-card"
import SearchBar from "@/components/search-bar"
import { motion } from "framer-motion"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
  overview: string
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q")
  const page = searchParams.get("page") || "1"

  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(!!query)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(Number.parseInt(page))

  useEffect(() => {
    if (!query) return

    const fetchSearchResults = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&page=${page}`)

        if (!response.ok) {
          throw new Error("Failed to fetch search results")
        }

        const data = await response.json()
        setMovies(data.results || [])
        setTotalPages(data.total_pages || 0)
        setCurrentPage(data.page || 1)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query, page])

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      router.push(`/search?q=${encodeURIComponent(query!)}&page=${currentPage + 1}`)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      router.push(`/search?q=${encodeURIComponent(query!)}&page=${currentPage - 1}`)
    }
  }

  return (
    <main className="min-h-screen">
      {/* Search Bar Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 py-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <SearchBar />
          </motion.div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!query ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <h2 className="text-3xl font-bold text-slate-300 mb-4">Start Searching for Movies</h2>
            <p className="text-slate-400">Use the search bar above to find movies by title</p>
          </motion.div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Search Results for "{query}"</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-red-500 to-orange-500 rounded" />
              <p className="text-slate-400 mt-3">{loading ? "Loading..." : `Found ${movies.length} results`}</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center mb-8">
                <p className="text-red-300">{error}</p>
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
            ) : movies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {movies.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-6 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-lg font-medium transition-all duration-300"
                    >
                      Previous
                    </motion.button>
                    <span className="text-slate-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                      className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-lg font-medium transition-all duration-300"
                    >
                      Next
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <h3 className="text-2xl font-bold text-slate-300 mb-2">No movies found</h3>
                <p className="text-slate-400">Try searching with different keywords</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
