import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { showApi, seatApi, bookingApi } from '@/services/api';
import { PageSpinner, Spinner } from '@/components/common/UI';
import { fmt, cn, loadRazorpay, getError } from '@/utils';
import { useAuth } from '@/store/authStore';
import type { Seat, RazorpayPaymentResponse } from '@/types';

export default function SeatPage() {
  const { id } = useParams<{ id: string }>();
  const showId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selected, setSelected] = useState<number[]>([]);
  const [paying, setPaying] = useState(false);

  const { data: show, isLoading: showLoading } = useQuery({
    queryKey: ['show', showId],
    queryFn: () => showApi.getById(showId).then(r => r.data.data),
    enabled: !!showId,
  });

  const { data: seats, isLoading: seatsLoading, refetch: refetchSeats } = useQuery({
    queryKey: ['seats', showId],
    queryFn: () => seatApi.byShow(showId).then(r => r.data.data),
    enabled: !!showId,
    refetchInterval: 15000,
  });

  // Group by row
  const byRow = seats?.reduce((acc, s) => {
    if (!acc[s.rowLabel]) acc[s.rowLabel] = [];
    acc[s.rowLabel].push(s);
    return acc;
  }, {} as Record<string, Seat[]>) ?? {};
  const rows = Object.keys(byRow).sort();

  const toggle = (seat: Seat) => {
    if (seat.status === 'BOOKED' || seat.status === 'LOCKED') return;
    setSelected(prev => prev.includes(seat.id) ? prev.filter(x => x !== seat.id) : [...prev, seat.id]);
  };

  const total = show ? show.ticketPrice * selected.length : 0;

  const handlePay = async () => {
    if (!selected.length) return toast.error('Select at least one seat');
    if (selected.length > 10) return toast.error('Maximum 10 seats per booking');
    setPaying(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Payment gateway unavailable'); setPaying(false); return; }

      const { data: orderData } = await bookingApi.initiate({ showId, seatIds: selected });
      const order = orderData.data;

      new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount * 100,
        currency: order.currency,
        name: 'CineBook',
        description: `${show?.movie.title} — ${selected.length} seat(s)`,
        order_id: order.orderId,
        prefill: { name: `${user?.firstName} ${user?.lastName}`, email: user?.email, contact: user?.phone },
        theme: { color: '#8B1A2B' },
        handler: async (resp: RazorpayPaymentResponse) => {
          try {
            const { data } = await bookingApi.verifyPayment({
              razorpayOrderId: resp.razorpay_order_id,
              razorpayPaymentId: resp.razorpay_payment_id,
              razorpaySignature: resp.razorpay_signature,
              bookingId: order.bookingId,
            });
            toast.success('Booking confirmed! 🎉');
            navigate(`/bookings/${data.data.id}`);
          } catch (e) {
            toast.error(getError(e));
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => { setPaying(false); refetchSeats(); } },
      }).open();
    } catch (e) {
      toast.error(getError(e));
      setPaying(false);
    }
  };

  if (showLoading || seatsLoading) return <PageSpinner />;
  if (!show) return null;

  const available = seats?.filter(s => s.status === 'AVAILABLE').length ?? 0;
  const selectedSeats = seats?.filter(s => selected.includes(s.id)) ?? [];

  return (
    <div className="w-full min-h-screen bg-cream-50 pb-36 overflow-x-hidden">
      {/* Header bar */}
      <div className="w-full bg-white border-b border-cream-200 sticky top-16 z-30">
        <div className="container-app py-3 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded hover:bg-cream-100 text-charcoal-600 hover:text-charcoal transition-colors shrink-0">
            <ArrowLeft size={17} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-serif font-700 text-base text-charcoal truncate">{show.movie.title}</p>
            <p className="text-xs text-charcoal-500">{show.theater.name}, {show.theater.city} · {fmt.time(show.showTime)} · {fmt.date(show.showDate, 'EEE MMM d')}</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-charcoal-500 shrink-0">
            <Users size={14} /><span className="font-600">{available}</span><span>available</span>
          </div>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
          {[
            { label: 'Available', cls: 'bg-cream-50 border-cream-300' },
            { label: 'Selected', cls: 'bg-wine border-wine' },
            { label: 'Booked', cls: 'bg-cream-200 border-cream-200 opacity-50' },
            { label: 'Held', cls: 'bg-amber-50 border-amber-200' },
          ].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-charcoal-600">
              <div className={cn('w-5 h-5 rounded border', cls)} />{label}
            </div>
          ))}
        </div>

        {/* Screen */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="w-72 sm:w-96 h-2 rounded-b-[50%] mx-auto"
              style={{ background: 'linear-gradient(90deg, transparent, #8B1A2B40, #8B1A2B80, #8B1A2B40, transparent)', boxShadow: '0 4px 20px rgba(139,26,43,0.2)' }} />
            <p className="text-[10px] font-700 uppercase tracking-[0.3em] text-charcoal-500 mt-2">Screen This Way</p>
          </div>
        </div>

        {/* Seat grid */}
        {/* <div className="overflow-x-auto pb-4">
          <div className="inline-flex flex-col items-center min-w-max mx-auto space-y-2 px-4"> */}
              <div className="w-full overflow-x-auto pb-4 flex justify-center">
  <div className="flex flex-col items-center space-y-2 px-4">
            {rows.map(row => (
              <div key={row} className="flex items-center gap-2">
                <span className="w-5 text-center text-xs font-700 font-mono text-charcoal-500 shrink-0">{row}</span>
                <div className="flex gap-1.5">
                  {byRow[row].map(seat => (
                    <motion.button
                      key={seat.id}
                      whileHover={seat.status === 'AVAILABLE' ? { scale: 1.15 } : {}}
                      whileTap={seat.status === 'AVAILABLE' ? { scale: 0.9 } : {}}
                      onClick={() => toggle(seat)}
                      title={`${seat.seatLabel}`}
                      className={cn(
                        seat.status === 'BOOKED' ? 'seat-booked' :
                        seat.status === 'LOCKED' ? 'seat-locked' :
                        selected.includes(seat.id) ? 'seat-selected' : 'seat-available'
                      )}
                    >
                      {seat.seatNumber}
                    </motion.button>
                  ))}
                </div>
                <span className="w-5 text-center text-xs font-700 font-mono text-charcoal-500 shrink-0">{row}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-charcoal-500 mt-4">
          <Info size={11} /> Seat availability refreshes every 15 seconds
        </div>
      </div>

      {/* Checkout bar */}
      {selected.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-200 shadow-lift z-40"
        >
          <div className="container-app py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-charcoal-500 mb-0.5">
                  {selected.length} seat{selected.length > 1 ? 's' : ''} —{' '}
                  <span className="font-mono">{selectedSeats.map(s => s.seatLabel).join(', ')}</span>
                </p>
                <p className="font-serif font-700 text-2xl text-charcoal">{fmt.currency(total)}</p>
              </div>
              <button onClick={handlePay} disabled={paying} className="btn-primary btn-lg gap-2 shrink-0">
                {paying ? <><Spinner size={15} className="text-white" />Processing…</> : `Pay ${fmt.currency(total)}`}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
