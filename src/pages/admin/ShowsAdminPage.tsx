import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Loader2, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { showApi, movieApi, theaterApi } from '@/services/api';
import { Modal, Field, Skeleton, Empty } from '@/components/common/UI';
import { fmt, getError } from '@/utils';
import type { Show } from '@/types';

const EMPTY_FORM = { movieId: '', theaterId: '', showDate: '', showTime: '18:00', ticketPrice: '150' };

export default function ShowsAdminPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const today = new Date().toISOString().split('T')[0];

  const { data: movies } = useQuery({ queryKey: ['admin-movies'], queryFn: () => movieApi.getAll().then(r => r.data.data) });
  const { data: theaters } = useQuery({ queryKey: ['admin-theaters'], queryFn: () => theaterApi.getAll().then(r => r.data.data) });

  const { data: shows, isLoading } = useQuery({
    queryKey: ['admin-shows', movies?.map(m => m.id)],
    queryFn: async () => {
      if (!movies?.length) return [];
      const res = await Promise.allSettled(
        movies.filter(m => m.active).map(m => showApi.upcoming(m.id).then(r => r.data.data))
      );
      return res.flatMap(r => r.status === 'fulfilled' ? r.value : [])
        .sort((a, b) => a.showDate.localeCompare(b.showDate) || a.showTime.localeCompare(b.showTime));
    },
    enabled: !!movies?.length,
  });

  const inv = () => qc.invalidateQueries({ queryKey: ['admin-shows'] });

  const createMut = useMutation({
    mutationFn: () => showApi.create({ ...form, movieId: +form.movieId, theaterId: +form.theaterId, ticketPrice: +form.ticketPrice }),
    onSuccess: () => { toast.success('Show created! Seats auto-generated.'); inv(); setOpen(false); setForm(EMPTY_FORM); },
    onError: e => toast.error(getError(e)),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => showApi.remove(id),
    onSuccess: () => { toast.success('Show removed'); inv(); },
    onError: e => toast.error(getError(e)),
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  const selectedTheater = theaters?.find(t => t.id === +form.theaterId);

  return (
    <div className="p-8 w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-700 text-2xl text-charcoal">Shows</h1>
          <p className="text-charcoal-500 text-sm mt-0.5">{shows?.length ?? 0} upcoming showtimes</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary gap-2"><Plus size={15} />Add Show</button>
      </div>

      <div className="bg-white border border-cream-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 border-b border-cream-200">
              <tr>{['Film', 'Theater', 'Date', 'Time', 'Price', 'Availability', ''].map(h=>(
                <th key={h} className="text-left text-[10px] font-700 uppercase tracking-wider text-charcoal-500 px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {isLoading ? Array.from({length:5}).map((_,i)=>(
                <tr key={i}>{Array.from({length:7}).map((_,j)=><td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20"/></td>)}</tr>
              )) : shows?.map(show => (
                <tr key={show.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {show.movie.posterUrl && <img src={show.movie.posterUrl} alt="" className="w-7 h-10 object-cover rounded shrink-0"/>}
                      <div>
                        <p className="font-600 text-charcoal">{show.movie.title}</p>
                        <p className="text-xs text-charcoal-500">{show.movie.language}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal-600">{show.theater.name}<br/><span className="text-xs text-charcoal-500">{show.theater.city}</span></td>
                  <td className="px-4 py-3 text-charcoal-600 whitespace-nowrap">{fmt.date(show.showDate, 'MMM dd, yyyy')}</td>
                  <td className="px-4 py-3 font-600 text-charcoal whitespace-nowrap">{fmt.time(show.showTime)}</td>
                  <td className="px-4 py-3 font-serif font-700 text-charcoal">{fmt.currency(show.ticketPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-600 text-sm ${show.availableSeats > 20 ? 'text-sage' : show.availableSeats > 0 ? 'text-gold' : 'text-wine'}`}>
                      {show.availableSeats}/{show.totalSeats}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={()=>{if(window.confirm('Remove show?'))deleteMut.mutate(show.id)}} className="w-7 h-7 rounded hover:bg-red-50 flex items-center justify-center text-charcoal-500 hover:text-wine transition-colors"><Trash2 size={13}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && !shows?.length && (
            <Empty icon={<Calendar size={24}/>} title="No upcoming shows" desc="Add a show to get started." />
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => { setOpen(false); setForm(EMPTY_FORM); }} title="Add New Show">
        <form onSubmit={e=>{e.preventDefault();createMut.mutate()}} className="p-6 space-y-4">
          <Field label="Movie *">
            <select className="input" value={form.movieId} onChange={set('movieId')} required>
              <option value="">Select a movie</option>
              {movies?.filter(m => m.active).map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </Field>
          <Field label="Theater *">
            <select className="input" value={form.theaterId} onChange={set('theaterId')} required>
              <option value="">Select a theater</option>
              {theaters?.filter(t => t.active).map(t => <option key={t.id} value={t.id}>{t.name} — {t.city}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date *"><input type="date" className="input" min={today} value={form.showDate} onChange={set('showDate')} required /></Field>
            <Field label="Time *"><input type="time" className="input" value={form.showTime} onChange={set('showTime')} required /></Field>
          </div>
          <Field label="Ticket Price (₹) *">
            <input type="number" min="1" step="0.01" className="input" value={form.ticketPrice} onChange={set('ticketPrice')} required />
          </Field>
          {selectedTheater && (
            <div className="bg-cream-50 border border-cream-200 rounded-lg px-4 py-2 text-xs text-charcoal-600">
              Seats auto-generated from theater layout — <strong className="text-wine">{selectedTheater.totalSeats} seats</strong>
            </div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={() => { setOpen(false); setForm(EMPTY_FORM); }} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={createMut.isPending} className="btn-primary flex-1 justify-center gap-2">
              {createMut.isPending ? <><Loader2 size={14} className="animate-spin"/>Creating…</> : 'Create Show'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
