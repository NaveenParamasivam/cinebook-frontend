import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import { cn, fmt, GENRES, GENRE_COLORS, FALLBACK_POSTER } from '@/utils';
import type { Movie } from '@/types';

export default function MovieCard({ movie, index = 0 }: { movie: Movie; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <Link to={`/movies/${movie.id}`} className="group block">
        <div className="card-hover">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden bg-cream-200">
            <img
              src={movie.posterUrl || FALLBACK_POSTER}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              onError={e => { (e.target as HTMLImageElement).src = FALLBACK_POSTER; }}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* IMDB badge */}
            {movie.imdbRating && (
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-charcoal/80 backdrop-blur-sm rounded px-1.5 py-0.5">
                <Star size={9} className="text-gold fill-gold" />
                <span className="text-[10px] font-700 font-mono text-white">{movie.imdbRating.toFixed(1)}</span>
              </div>
            )}

            {/* Genre on hover */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className={cn('badge text-xs', GENRE_COLORS[movie.genre] ?? 'badge-neutral')}>
                {GENRES[movie.genre] ?? movie.genre}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-serif font-600 text-[15px] text-charcoal leading-snug line-clamp-2 group-hover:text-wine transition-colors mb-1.5">
              {movie.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-charcoal-500">
              {movie.durationMinutes && (
                <span className="flex items-center gap-1">
                  <Clock size={10} />{fmt.duration(movie.durationMinutes)}
                </span>
              )}
              {movie.language && <span>{movie.language}</span>}
              {movie.rating && (
                <span className="ml-auto font-600 text-charcoal-600 border border-cream-300 px-1.5 py-0.5 rounded text-[10px]">
                  {movie.rating}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
