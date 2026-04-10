import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, Clock, Globe, Calendar, MapPin, Play, ChevronRight, ArrowLeft } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { movieApi, showApi } from '@/services/api';
import { PageSpinner, Spinner, Empty } from '@/components/common/UI';
import { fmt, GENRES, GENRE_COLORS, cn, FALLBACK_POSTER } from '@/utils';
import { useAuth } from '@/store/authStore';

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => movieApi.getById(movieId).then(r => r.data.data),
    enabled: !!movieId,
  });

  const { data: dates } = useQuery({
    queryKey: ['movie-dates', movieId],
    queryFn: () => showApi.dates(movieId).then(r => r.data.data),
    enabled: !!movieId,
  });

  useEffect(() => {
    if (dates && dates.length > 0 && !selectedDate) setSelectedDate(dates[0]);
  }, [dates]);

  const { data: shows, isLoading: showsLoading } = useQuery({
    queryKey: ['shows', movieId, selectedDate],
    queryFn: () => showApi.byMovieAndDate(movieId, selectedDate!).then(r => r.data.data),
    enabled: !!movieId && !!selectedDate,
  });

  const handleSelectShow = (showId: number) => {
    if (!isAuth) return navigate('/login', { state: { from: `/movies/${movieId}` } });
    navigate(`/shows/${showId}/seats`);
  };

  if (isLoading) return <PageSpinner />;
  if (!movie) return null;

  return (
    <div className="w-full min-h-screen bg-cream-50 overflow-x-hidden">

      {/* ── Hero banner ─────────────────────────────── */}
      <div className="relative w-full bg-charcoal overflow-hidden" style={{ minHeight: '440px' }}>
        {movie.posterUrl && (
          <>
            <img
              src={movie.posterUrl} alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-105"
              onError={e => { (e.target as HTMLImageElement).src = FALLBACK_POSTER; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 to-transparent" />
          </>
        )}

        <div className="relative z-10 container-app py-12 flex flex-col justify-end" style={{ minHeight: '440px' }}>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-500 mb-8 w-fit transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="shrink-0 w-36 sm:w-44 rounded-xl overflow-hidden shadow-lift border border-white/10"
            >
              <img
                src={movie.posterUrl || FALLBACK_POSTER} alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
                onError={e => { (e.target as HTMLImageElement).src = FALLBACK_POSTER; }}
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="flex-1"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {movie.genre && (
                  <span className={cn('badge', GENRE_COLORS[movie.genre] ?? 'badge-neutral')}>
                    {GENRES[movie.genre]}
                  </span>
                )}
                {movie.rating && <span className="badge badge-neutral">{movie.rating}</span>}
              </div>

              <h1 className="font-serif font-900 text-3xl sm:text-4xl text-white leading-tight mb-3">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-sm text-white/60 mb-5">
                {movie.imdbRating && (
                  <span className="flex items-center gap-1.5">
                    <Star size={13} className="text-gold fill-gold" />
                    <strong className="text-white font-700">{movie.imdbRating.toFixed(1)}</strong>/10
                  </span>
                )}
                {movie.durationMinutes && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />{movie.durationMinutes ? fmt.duration(movie.durationMinutes) : ""}
                  </span>
                )}
                {movie.language && (
                  <span className="flex items-center gap-1.5">
                    <Globe size={13} />{movie.language}
                  </span>
                )}
                {movie.releaseDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />{movie.releaseDate ? format(parseISO(movie.releaseDate), 'yyyy') : ''}
                  </span>
                )}
              </div>

              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-600 text-white border border-white/20 px-4 py-2 rounded hover:bg-white/10 transition-colors"
                >
                  <Play size={13} fill="currentColor" /> Watch Trailer
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="container-app py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left */}
          <div className="lg:col-span-2 space-y-10">

            {movie.description && (
              <section>
                <h2 className="font-serif font-700 text-xl text-charcoal mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-wine rounded-full inline-block" />About
                </h2>
                <p className="text-charcoal-600 leading-relaxed">{movie.description}</p>
              </section>
            )}

            {(movie.director || movie.cast) && (
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {movie.director && (
                  <div>
                    <p className="text-xs font-700 uppercase tracking-widest text-charcoal-500 mb-1">Director</p>
                    <p className="text-charcoal font-600">{movie.director}</p>
                  </div>
                )}
                {movie.cast && (
                  <div>
                    <p className="text-xs font-700 uppercase tracking-widest text-charcoal-500 mb-1">Cast</p>
                    <p className="text-charcoal-600 text-sm">{movie.cast}</p>
                  </div>
                )}
              </section>
            )}

            {/* Book Tickets */}
            <section>
              <h2 className="font-serif font-700 text-xl text-charcoal mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-wine rounded-full inline-block" />Book Tickets
              </h2>

              {dates && dates.length > 0 ? (
                <>
                  {/* Date pills */}
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
                    {dates.map(date => {
                      const d = parseISO(date);
                      const active = date === selectedDate;
                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={cn(
                            'shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border text-center transition-all',
                            active
                              ? 'bg-charcoal border-charcoal text-white'
                              : 'bg-white border-cream-200 text-charcoal hover:border-charcoal-600'
                          )}
                          style={{ minWidth: '68px' }}
                        >
                          <span className="text-[10px] font-700 uppercase tracking-wider opacity-70">
                            {format(d, 'EEE')}
                          </span>
                          <span className="font-serif font-700 text-xl leading-none mt-0.5">
                            {format(d, 'd')}
                          </span>
                          <span className="text-[10px] font-600 opacity-70 mt-0.5">
                            {format(d, 'MMM')}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Show listings */}
                  {showsLoading ? (
                    <div className="flex items-center gap-2 text-charcoal-500 text-sm">
                      <Spinner size={14} />Loading showtimes…
                    </div>
                  ) : shows && shows.length > 0 ? (
                    <div className="space-y-3">
                      {shows.map(show => (
                        <motion.div
                          key={show.id}
                          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                          className="bg-white border border-cream-200 rounded-xl p-4 hover:border-charcoal-600 hover:shadow-card transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex-1 flex flex-wrap items-center gap-4">
                              <span className="font-serif font-700 text-2xl text-charcoal">
                                {fmt.time(show.showTime)}
                              </span>
                              <span className="flex items-center gap-1.5 text-charcoal-500 text-sm">
                                <MapPin size={13} />
                                {show.theater.name}, {show.theater.city}
                              </span>
                              <span className={cn(
                                'font-600 text-sm',
                                show.availableSeats > 20 ? 'text-sage' :
                                show.availableSeats > 0  ? 'text-gold' : 'text-wine'
                              )}>
                                {show.availableSeats === 0
                                  ? 'Houseful'
                                  : `${show.availableSeats} seats left`}
                              </span>
                              <span className="font-serif font-700 text-charcoal text-lg">
                                {fmt.currency(show.ticketPrice)}
                              </span>
                            </div>
                            <button
                              onClick={() => handleSelectShow(show.id)}
                              disabled={show.availableSeats === 0}
                              className="btn-primary btn-sm shrink-0 gap-1"
                            >
                              Select Seats <ChevronRight size={13} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-charcoal-500 text-sm">No shows available for this date.</p>
                  )}
                </>
              ) : (
                <div className="bg-cream-100 border border-cream-200 rounded-xl p-6 text-center">
                  <p className="text-charcoal-500 text-sm">No upcoming shows scheduled for this film.</p>
                </div>
              )}
            </section>
          </div>

          {/* Right sidebar */}
          <div>
            <div className="bg-white border border-cream-200 rounded-xl p-5 sticky top-24">
              <h3 className="font-serif font-600 text-charcoal text-lg mb-4">Film Details</h3>
              <div className="space-y-0">
                {[
                  ['Genre',    movie.genre ? GENRES[movie.genre] : null],
                  ['Duration', movie.durationMinutes ? fmt.duration(movie.durationMinutes) : null],
                  ['Language', movie.language],
                  ['Rating',   movie.rating],
                  ['IMDB',     movie.imdbRating ? `${movie.imdbRating.toFixed(1)} / 10` : null],
                  ['Released', movie.releaseDate ? format(parseISO(movie.releaseDate), 'MMMM dd, yyyy') : null],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label as string} className="flex justify-between gap-2 py-2.5 border-b border-cream-100 last:border-0">
                    <span className="text-sm text-charcoal-500 font-500">{label}</span>
                    <span className="text-sm text-charcoal font-600 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
