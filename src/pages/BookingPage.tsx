import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Loader2, MapPin, Calendar, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { bookingApi } from '@/services/api';
import { PageSpinner, Spinner } from '@/components/common/UI';
import { fmt, cn, getError } from '@/utils';

const STATUS = {
  CONFIRMED: { icon: CheckCircle2, color: 'text-sage',    bg: 'bg-emerald-50 border-emerald-200',  label: 'Confirmed' },
  PENDING:   { icon: AlertCircle,  color: 'text-gold',    bg: 'bg-amber-50 border-amber-200',       label: 'Pending' },
  CANCELLED: { icon: XCircle,      color: 'text-wine',    bg: 'bg-red-50 border-red-200',           label: 'Cancelled' },
  EXPIRED:   { icon: XCircle,      color: 'text-charcoal-500', bg: 'bg-cream-100 border-cream-200', label: 'Expired' },
};

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.getById(Number(id)).then(r => r.data.data),
    enabled: !!id,
  });

  const cancelMut = useMutation({
    mutationFn: () => bookingApi.cancel(Number(id)).then(r => r.data.data),
    onSuccess: () => {
      toast.success('Booking cancelled');
      qc.invalidateQueries({ queryKey: ['booking', id] });
      qc.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: e => toast.error(getError(e)),
  });

  if (isLoading) return <PageSpinner />;
  if (!booking) return null;

  const s = STATUS[booking.bookingStatus] ?? STATUS.EXPIRED;
  const StatusIcon = s.icon;
  const confirmed = booking.bookingStatus === 'CONFIRMED';
  const cancellable = booking.bookingStatus === 'CONFIRMED' || booking.bookingStatus === 'PENDING';

  return (
    <div className="w-full min-h-screen bg-cream-50 overflow-x-hidden">
      <div className="container-app py-10 max-w-2xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate('/bookings')} className="flex items-center gap-2 text-charcoal-500 hover:text-charcoal text-sm font-500 mb-8 transition-colors">
          <ArrowLeft size={15} /> My Tickets
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Ticket card */}
          <div className="bg-white border border-cream-200 rounded-2xl overflow-hidden shadow-card-lg">

            {/* Status bar */}
            <div className={cn('flex items-center gap-3 px-6 py-4 border-b', s.bg)}>
              <StatusIcon size={18} className={s.color} />
              <div className="flex-1">
                <p className={cn('font-600 text-sm', s.color)}>{s.label}</p>
                <p className="text-xs text-charcoal-500">Ref: <strong className="font-mono text-charcoal">{booking.bookingReference}</strong></p>
              </div>
              {booking.paymentStatus === 'SUCCESS' && <span className="badge badge-green">Paid</span>}
              {booking.paymentStatus === 'REFUNDED' && <span className="badge badge-neutral">Refunded</span>}
            </div>

            {/* Movie header */}
            <div className="flex gap-4 p-6 border-b border-cream-100">
              <div className="w-16 h-24 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                {booking.show.movie.posterUrl && (
                  <img src={booking.show.movie.posterUrl} alt={booking.show.movie.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-serif font-700 text-xl text-charcoal leading-tight">{booking.show.movie.title}</h2>
                <p className="text-charcoal-500 text-sm mt-1">{booking.show.movie.genre} · {booking.show.movie.language}</p>
              </div>
            </div>

            {/* Perforation */}
            <div className="perforate mx-4 my-1" />

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-5 p-6">
              {[
                [<Calendar size={14} />, 'Date',    fmt.date(booking.show.showDate)],
                [<Clock size={14} />,    'Time',    fmt.time(booking.show.showTime)],
                [<MapPin size={14} />,   'Theater', `${booking.show.theater.name}, ${booking.show.theater.city}`],
                [<Users size={14} />,    'Seats',   booking.seats?.map(s => s.seatLabel).join(', ') || `${booking.seatCount} seat(s)`],
              ].map(([icon, label, value]) => (
                <div key={label as string}>
                  <p className="flex items-center gap-1.5 text-[10px] font-700 uppercase tracking-widest text-charcoal-500 mb-1">
                    {icon as React.ReactNode}{label as string}
                  </p>
                  <p className="text-charcoal font-600 text-sm leading-snug">{value as string}</p>
                </div>
              ))}
            </div>

            {/* Perforation */}
            <div className="perforate mx-4 my-1" />

            {/* Total */}
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-[10px] font-700 uppercase tracking-widest text-charcoal-500 mb-1">Total Paid</p>
                <p className="font-serif font-900 text-3xl text-charcoal">{fmt.currency(booking.totalAmount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-700 uppercase tracking-widest text-charcoal-500 mb-1">Tickets</p>
                <p className="font-serif font-700 text-2xl text-charcoal">{booking.seatCount}</p>
              </div>
            </div>

            {/* Big reference (confirmed only) */}
            {confirmed && (
              <div className="mx-6 mb-6 bg-cream-50 border border-dashed border-cream-300 rounded-xl py-5 text-center">
                <p className="text-[10px] font-700 uppercase tracking-[0.3em] text-charcoal-500 mb-2">Show at entrance</p>
                <p className="font-mono font-700 text-2xl sm:text-3xl text-wine tracking-[0.15em]">{booking.bookingReference}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 px-6 pb-6">
              <Link to="/" className="btn-secondary text-sm flex-1 justify-center">Browse More</Link>
              {cancellable && (
                <button
                  onClick={() => { if (window.confirm('Cancel this booking?')) cancelMut.mutate(); }}
                  disabled={cancelMut.isPending}
                  className="btn text-sm text-wine border border-wine/30 hover:border-wine hover:bg-wine/5 flex-1 justify-center gap-2"
                >
                  {cancelMut.isPending ? <><Spinner size={13} className="text-wine" />Cancelling…</> : 'Cancel Booking'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
