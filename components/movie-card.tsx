"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface MovieCardProps {
  id: number
  title: string
  posterPath: string
  rating: number
  releaseDate: string
  overview: string
}

export default function MovieCard({ id, title, posterPath, rating, releaseDate, overview }: MovieCardProps) {
  const imageUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : "/abstract-movie-poster.png"

  const year = new Date(releaseDate).getFullYear()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group h-full"
    >
      <Link href={`/movie/${id}`}>
        <div className="relative h-full rounded-lg overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 hover:border-red-500 transition-colors duration-300 shadow-lg hover:shadow-red-500/20 cursor-pointer">
          {/* Poster Image */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

            {/* Rating Badge */}
            <div className="absolute top-3 right-3 bg-red-500 rounded-full w-12 h-12 flex items-center justify-center font-bold text-white shadow-lg">
              {(rating / 2).toFixed(1)}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 space-y-3">
            {/* Title */}
            <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-red-400 transition-colors duration-300 line-clamp-2">
              {title}
            </h3>

            {/* Year */}
            <p className="text-sm text-slate-400">{year || "N/A"}</p>

            {/* Overview */}
            <p className="text-sm text-slate-300 line-clamp-3 group-hover:line-clamp-4 transition-all duration-300">
              {overview || "No description available."}
            </p>

            {/* View Details Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 transform"
            >
              View Details
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
