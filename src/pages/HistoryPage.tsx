import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Ticket, Calendar, MapPin, ChevronRight, Clock } from 'lucide-react';
import { bookingApi } from '@/services/api';
import { PageSpinner, NoTickets } from '@/components/common/UI';
import { fmt, cn } from '@/utils';
import type { Booking } from '@/types';

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: 'badge-green', PENDING: 'badge-yellow', CANCELLED: 'badge-red', EXPIRED: 'badge-neutral',
};

export default function HistoryPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingApi.myBookings().then(r => r.data.data),
  });

  if (isLoading) return <PageSpinner />;

  return (
    <div className="w-full min-h-screen bg-cream-50 overflow-x-hidden">
      <div className="container-app py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-wine/10 border border-wine/20 rounded-xl flex items-center justify-center">
            <Ticket size={17} className="text-wine" />
          </div>
          <div>
            <h1 className="font-serif font-700 text-2xl text-charcoal">My Tickets</h1>
            <p className="text-charcoal-500 text-sm">{bookings?.length ?? 0} booking{bookings?.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {!bookings || bookings.length === 0 ? (
          <NoTickets />
        ) : (
          <div className="space-y-3 max-w-3xl">
            {bookings.map((b, i) => <BookingRow key={b.id} booking={b} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingRow({ booking, index }: { booking: Booking; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <Link
        to={`/bookings/${booking.id}`}
        className={cn('group flex gap-4 bg-white border rounded-xl p-4 transition-all hover:shadow-card hover:-translate-y-0.5',
          booking.bookingStatus === 'CANCELLED' ? 'border-cream-200 opacity-60' : 'border-cream-200 hover:border-charcoal-600'
        )}
      >
        {/* Poster */}
        <div className="w-14 h-20 shrink-0 bg-cream-100 rounded-lg overflow-hidden">
          {booking.show.movie.posterUrl ? (
            <img src={booking.show.movie.posterUrl} alt={booking.show.movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Ticket size={16} className="text-cream-300" /></div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif font-700 text-[15px] text-charcoal leading-snug truncate group-hover:text-wine transition-colors">
              {booking.show.movie.title}
            </h3>
            <span className={cn('badge shrink-0', STATUS_BADGE[booking.bookingStatus] ?? 'badge-neutral')}>
              {booking.bookingStatus}
            </span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal-500">
            <span className="flex items-center gap-1"><Calendar size={11} />{fmt.date(booking.show.showDate, 'MMM dd, yyyy')}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{fmt.time(booking.show.showTime)}</span>
            <span className="flex items-center gap-1"><MapPin size={11} />{booking.show.theater.name}</span>
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <span className="font-mono text-[10px] bg-cream-100 text-charcoal-600 px-2 py-0.5 rounded border border-cream-200 font-600">
              {booking.bookingReference}
            </span>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-serif font-700 text-charcoal">{fmt.currency(booking.totalAmount)}</span>
              <ChevronRight size={14} className="text-charcoal-400 group-hover:text-wine transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
