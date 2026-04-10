import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Loader2, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import { movieApi } from '@/services/api';
import { Modal, Field, Skeleton } from '@/components/common/UI';
import { GENRES, GENRE_COLORS, cn, getError } from '@/utils';
import type { Movie, Genre } from '@/types';

const GENRE_LIST = Object.keys(GENRES) as Genre[];
const EMPTY = { title:'', description:'', genre:'ACTION' as Genre, durationMinutes:'', rating:'', imdbRating:'', language:'', posterUrl:'', trailerUrl:'', releaseDate:'', director:'', cast:'' };

export default function MoviesAdminPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Movie | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);

  const { data: movies, isLoading } = useQuery({ queryKey: ['admin-movies'], queryFn: () => movieApi.getAll().then(r => r.data.data) });
  const inv = () => qc.invalidateQueries({ queryKey: ['admin-movies'] });

  const saveMut = useMutation({
    mutationFn: () => {
      const payload = { ...form, durationMinutes: form.durationMinutes ? +form.durationMinutes : undefined, imdbRating: form.imdbRating ? +form.imdbRating : undefined };
      return editing ? movieApi.update(editing.id, payload) : movieApi.create(payload);
    },
    onSuccess: () => { toast.success(editing ? 'Movie updated!' : 'Movie created!'); inv(); close(); },
    onError: e => toast.error(getError(e)),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => movieApi.remove(id),
    onSuccess: () => { toast.success('Movie removed'); inv(); },
    onError: e => toast.error(getError(e)),
  });

  const open_ = (m?: Movie) => {
    setEditing(m || null);
    setForm(m ? { title: m.title, description: m.description||'', genre: m.genre, durationMinutes: m.durationMinutes?.toString()||'', rating: m.rating||'', imdbRating: m.imdbRating?.toString()||'', language: m.language||'', posterUrl: m.posterUrl||'', trailerUrl: m.trailerUrl||'', releaseDate: m.releaseDate||'', director: m.director||'', cast: m.cast||'' } : EMPTY);
    setOpen(true);
  };
  const close = () => { setOpen(false); setEditing(null); };
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="p-8 w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-700 text-2xl text-charcoal">Movies</h1>
          <p className="text-charcoal-500 text-sm mt-0.5">{movies?.length ?? 0} films in the system</p>
        </div>
        <button onClick={() => open_()} className="btn-primary gap-2"><Plus size={15} />Add Movie</button>
      </div>

      <div className="bg-white border border-cream-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 border-b border-cream-200">
              <tr>{['Film', 'Genre', 'Duration', 'Language', 'Rating', 'IMDB', 'Status', ''].map(h => (
                <th key={h} className="text-left text-[10px] font-700 uppercase tracking-wider text-charcoal-500 px-4 py-3">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {isLoading ? Array.from({length:5}).map((_,i)=>(
                <tr key={i}>{Array.from({length:8}).map((_,j)=><td key={j} className="px-4 py-3"><Skeleton className="h-4 w-20"/></td>)}</tr>
              )) : movies?.map(m => (
                <tr key={m.id} className="hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-11 rounded overflow-hidden bg-cream-100 shrink-0">
                        {m.posterUrl && <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover"/>}
                      </div>
                      <div>
                        <p className="font-600 text-charcoal">{m.title}</p>
                        {m.director && <p className="text-xs text-charcoal-500">{m.director}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={cn('badge text-[10px]', GENRE_COLORS[m.genre]??'badge-neutral')}>{GENRES[m.genre]}</span></td>
                  <td className="px-4 py-3 text-charcoal-600">{m.durationMinutes ? `${m.durationMinutes}m` : '—'}</td>
                  <td className="px-4 py-3 text-charcoal-600">{m.language||'—'}</td>
                  <td className="px-4 py-3 text-charcoal-600">{m.rating||'—'}</td>
                  <td className="px-4 py-3 text-charcoal-600">{m.imdbRating??'—'}</td>
                  <td className="px-4 py-3"><span className={`badge ${m.active?'badge-green':'badge-neutral'}`}>{m.active?'Active':'Inactive'}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={()=>open_(m)} className="w-7 h-7 rounded hover:bg-cream-100 flex items-center justify-center text-charcoal-500 hover:text-wine transition-colors"><Pencil size={13}/></button>
                      <button onClick={()=>{if(window.confirm('Delete this movie?'))deleteMut.mutate(m.id)}} className="w-7 h-7 rounded hover:bg-red-50 flex items-center justify-center text-charcoal-500 hover:text-wine transition-colors"><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && !movies?.length && (
            <div className="text-center py-12"><p className="text-charcoal-500 text-sm">No movies yet.</p></div>
          )}
        </div>
      </div>

      <Modal open={open} onClose={close} title={editing ? 'Edit Movie' : 'Add New Movie'} maxWidth="max-w-2xl">
        <form onSubmit={e=>{e.preventDefault();saveMut.mutate()}} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title *" className="sm:col-span-2"><input className="input" value={form.title} onChange={set('title')} required autoFocus /></Field>
            <Field label="Genre *"><select className="input" value={form.genre} onChange={set('genre')}>{GENRE_LIST.map(g=><option key={g} value={g}>{GENRES[g]}</option>)}</select></Field>
            <Field label="Language"><input className="input" placeholder="English, Hindi…" value={form.language} onChange={set('language')} /></Field>
            <Field label="Duration (min)"><input type="number" min="1" className="input" placeholder="120" value={form.durationMinutes} onChange={set('durationMinutes')} /></Field>
            <Field label="Certificate (U/A, A…)"><input className="input" placeholder="U/A" value={form.rating} onChange={set('rating')} /></Field>
            <Field label="IMDB Rating"><input type="number" step="0.1" min="0" max="10" className="input" placeholder="7.5" value={form.imdbRating} onChange={set('imdbRating')} /></Field>
            <Field label="Release Date"><input type="date" className="input" value={form.releaseDate} onChange={set('releaseDate')} /></Field>
            <Field label="Director" className="sm:col-span-2"><input className="input" value={form.director} onChange={set('director')} /></Field>
            <Field label="Cast" className="sm:col-span-2"><input className="input" placeholder="Actor 1, Actor 2…" value={form.cast} onChange={set('cast')} /></Field>
            <Field label="Poster URL" className="sm:col-span-2"><input className="input" placeholder="https://…" value={form.posterUrl} onChange={set('posterUrl')} /></Field>
            {form.posterUrl && (
              <div className="sm:col-span-2 flex items-center gap-3 bg-cream-50 border border-cream-200 rounded-lg p-3">
                <img src={form.posterUrl} alt="" className="w-10 h-14 object-cover rounded" onError={e=>{(e.target as HTMLImageElement).style.display='none'}}/>
                <p className="text-xs text-charcoal-500">Poster preview</p>
              </div>
            )}
            <Field label="Trailer URL (YouTube)" className="sm:col-span-2"><input className="input" placeholder="https://youtube.com/watch?v=…" value={form.trailerUrl} onChange={set('trailerUrl')} /></Field>
            <Field label="Description" className="sm:col-span-2"><textarea rows={3} className="input resize-none" value={form.description} onChange={set('description')} /></Field>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={close} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saveMut.isPending} className="btn-primary flex-1 justify-center gap-2">
              {saveMut.isPending ? <><Loader2 size={14} className="animate-spin"/>Saving…</> : editing ? 'Update Movie' : 'Add Movie'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
