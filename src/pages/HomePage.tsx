import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp, Film, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { movieApi } from '@/services/api';
import MovieCard from '@/components/common/MovieCard';
import { GridSkeleton, Empty } from '@/components/common/UI';
import { GENRES, cn, FALLBACK_POSTER } from '@/utils';
import type { Genre } from '@/types';

const GENRE_LIST = Object.keys(GENRES) as Genre[];

export default function HomePage() {
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null);

  const { data: movies, isLoading } = useQuery({
    queryKey: ['movies'],
    queryFn: () => movieApi.getAll().then(r => r.data.data),
  });

  const featured = useMemo(() => movies?.slice(0, 3) ?? [], [movies]);

  const filtered = useMemo(() => {
    if (!movies) return [];
    return activeGenre ? movies.filter(m => m.genre === activeGenre) : movies;
  }, [movies, activeGenre]);

  return (
    <div className="w-full min-h-screen bg-cream-50 overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative w-full bg-charcoal overflow-hidden" style={{ minHeight: '520px' }}>
        {/* Background poster blur collage */}
        <div className="absolute inset-0 flex overflow-hidden">
          {featured.map(m => (
            <div key={m.id} className="flex-1 relative overflow-hidden">
              <img
                src={m.posterUrl || FALLBACK_POSTER}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-20"
                onError={e => { (e.target as HTMLImageElement).src = FALLBACK_POSTER; }}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 container-app flex flex-col lg:flex-row items-center justify-between gap-10 py-20" style={{ minHeight: '520px' }}>
          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-px bg-wine" />
              <span className="text-wine text-xs font-700 uppercase tracking-[0.2em]">Now Showing</span>
            </div>
            <h1 className="font-serif font-900 text-5xl sm:text-6xl text-white leading-[1.05] mb-5">
              Your Seat,<br />
              <em className="italic text-gold">Your Story.</em>
            </h1>
            <p className="text-white/60 text-base leading-relaxed mb-8 max-w-md">
              Browse the latest films, handpick your seats, and book your next unforgettable cinematic experience.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#movies" className="btn-primary btn-lg">
                Browse Films <ChevronRight size={16} />
              </a>
              <Link to="/register"
                className="btn px-8 py-4 text-base border border-white/20 text-white hover:bg-white/10 rounded-[var(--radius)]"
              >
                Get Started
              </Link>
            </div>
          </motion.div>

          {/* Right poster stack */}
          {featured.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hidden lg:flex items-center gap-3 shrink-0"
            >
              {featured.slice(0, 3).map((m, i) => (
                <Link
                  to={`/movies/${m.id}`}
                  key={m.id}
                  className="group relative overflow-hidden rounded-xl shadow-lift"
                  style={{
                    width: i === 1 ? '120px' : '96px',
                    transform: i === 1 ? 'translateY(-16px)' : i === 2 ? 'translateY(-6px)' : 'translateY(0px)',
                  }}
                >
                  <div className="aspect-[2/3]">
                    <img
                      src={m.posterUrl || FALLBACK_POSTER}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { (e.target as HTMLImageElement).src = FALLBACK_POSTER; }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Marquee genre ticker ──────────────────────── */}
      <div className="w-full bg-wine py-3 overflow-hidden">
        <div
          className="flex whitespace-nowrap gap-12 text-white/80 text-xs font-700 uppercase tracking-[0.15em]"
          className="flex animate-marquee whitespace-nowrap"
        >
          {[...Array(3)].flatMap(() =>
            Object.values(GENRES).map((g, i) => (
              <span key={`${g}-${i}`} className="flex items-center gap-3 shrink-0">
                <span className="text-white/30">◆</span> {g}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── Genre filter ──────────────────────────────── */}
      <div id="movies" className="sticky top-16 z-30 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200 w-full">
        <div className="container-app">
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveGenre(null)}
              className={cn(
                'shrink-0 px-4 py-1.5 rounded-full text-xs font-600 border transition-all',
                !activeGenre
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'bg-transparent text-charcoal-600 border-cream-300 hover:border-charcoal-600'
              )}
            >
              All Films
            </button>
            {GENRE_LIST.map(g => (
              <button
                key={g}
                onClick={() => setActiveGenre(prev => prev === g ? null : g)}
                className={cn(
                  'shrink-0 px-4 py-1.5 rounded-full text-xs font-600 border transition-all',
                  activeGenre === g
                    ? 'bg-wine text-white border-wine'
                    : 'bg-transparent text-charcoal-600 border-cream-300 hover:border-charcoal-600'
                )}
              >
                {GENRES[g]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Movies grid ───────────────────────────────── */}
      <section className="container-app py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {activeGenre
              ? <Film size={18} className="text-wine" />
              : <TrendingUp size={18} className="text-wine" />
            }
            <h2 className="font-serif font-700 text-2xl text-charcoal">
              {activeGenre ? GENRES[activeGenre] : 'Now Showing'}
            </h2>
            {!isLoading && (
              <span className="text-charcoal-500 text-sm">({filtered.length})</span>
            )}
          </div>
          {activeGenre && (
            <button
              onClick={() => setActiveGenre(null)}
              className="text-xs text-wine hover:underline font-600"
            >
              Clear filter
            </button>
          )}
        </div>

        {isLoading ? (
          <GridSkeleton count={10} />
        ) : filtered.length === 0 ? (
          <Empty
            icon={<Film size={26} />}
            title="No films found"
            desc="Try a different genre or check back later."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filtered.map((m, i) => (
              <MovieCard key={m.id} movie={m} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
