import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Loader2, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { theaterApi } from '@/services/api';
import { Modal, Field, Skeleton } from '@/components/common/UI';
import { getError } from '@/utils';
import type { Theater } from '@/types';

const EMPTY = { name:'', city:'', address:'', state:'', pincode:'', phone:'', totalRows:'8', seatsPerRow:'10' };

export default function TheatersAdminPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Theater | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);

  const { data: theaters, isLoading } = useQuery({ queryKey: ['admin-theaters'], queryFn: () => theaterApi.getAll().then(r => r.data.data) });
  const inv = () => qc.invalidateQueries({ queryKey: ['admin-theaters'] });

  const saveMut = useMutation({
    mutationFn: () => {
      const p = { ...form, totalRows: +form.totalRows, seatsPerRow: +form.seatsPerRow };
      return editing ? theaterApi.update(editing.id, p) : theaterApi.create(p);
    },
    onSuccess: () => { toast.success(editing ? 'Theater updated!' : 'Theater created!'); inv(); close(); },
    onError: e => toast.error(getError(e)),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => theaterApi.remove(id),
    onSuccess: () => { toast.success('Theater removed'); inv(); },
    onError: e => toast.error(getError(e)),
  });

  const open_ = (t?: Theater) => {
    setEditing(t || null);
    setForm(t ? { name: t.name, city: t.city, address: t.address||'', state: t.state||'', pincode: t.pincode||'', phone: t.phone||'', totalRows: t.totalRows?.toString()||'8', seatsPerRow: t.seatsPerRow?.toString()||'10' } : EMPTY);
    setOpen(true);
  };
  const close = () => { setOpen(false); setEditing(null); };
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));
  const capacity = +form.totalRows * +form.seatsPerRow;

  return (
    <div className="p-8 w-full overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif font-700 text-2xl text-charcoal">Theaters</h1>
          <p className="text-charcoal-500 text-sm mt-0.5">{theaters?.length ?? 0} venues</p>
        </div>
        <button onClick={() => open_()} className="btn-primary gap-2"><Plus size={15} />Add Theater</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? Array.from({length:6}).map((_,i)=>(
          <div key={i} className="bg-white border border-cream-200 rounded-xl p-5 space-y-3">
            <Skeleton className="h-5 w-40"/><Skeleton className="h-4 w-28"/><Skeleton className="h-4 w-32"/>
          </div>
        )) : theaters?.map(t => (
          <div key={t.id} className="bg-white border border-cream-200 rounded-xl p-5 hover:border-charcoal-600 hover:shadow-card transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                  <Building2 size={15} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-serif font-700 text-charcoal text-sm">{t.name}</p>
                  <p className="text-charcoal-500 text-xs">{t.city}{t.state ? `, ${t.state}` : ''}</p>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => open_(t)} className="w-7 h-7 rounded hover:bg-cream-100 flex items-center justify-center text-charcoal-500 hover:text-wine transition-colors"><Pencil size={12}/></button>
                <button onClick={() => { if(window.confirm('Delete theater?')) deleteMut.mutate(t.id); }} className="w-7 h-7 rounded hover:bg-red-50 flex items-center justify-center text-charcoal-500 hover:text-wine transition-colors"><Trash2 size={12}/></button>
              </div>
            </div>
            <div className="text-xs text-charcoal-500 space-y-1">
              <p>{t.totalRows} rows × {t.seatsPerRow} seats = <strong className="text-charcoal">{t.totalSeats} total</strong></p>
              {t.address && <p className="truncate">{t.address}</p>}
            </div>
            <div className="mt-3 pt-3 border-t border-cream-100">
              <span className={`badge text-[10px] ${t.active ? 'badge-green' : 'badge-neutral'}`}>{t.active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={close} title={editing ? 'Edit Theater' : 'Add Theater'}>
        <form onSubmit={e=>{e.preventDefault();saveMut.mutate()}} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name *" className="col-span-2"><input className="input" value={form.name} onChange={set('name')} required autoFocus /></Field>
            <Field label="City *"><input className="input" value={form.city} onChange={set('city')} required /></Field>
            <Field label="State"><input className="input" value={form.state} onChange={set('state')} /></Field>
            <Field label="Address" className="col-span-2"><input className="input" value={form.address} onChange={set('address')} /></Field>
            <Field label="Pincode"><input className="input" value={form.pincode} onChange={set('pincode')} /></Field>
            <Field label="Phone"><input className="input" value={form.phone} onChange={set('phone')} /></Field>
            <Field label="Rows *"><input type="number" min="1" max="26" className="input" value={form.totalRows} onChange={set('totalRows')} required /></Field>
            <Field label="Seats per row *"><input type="number" min="1" className="input" value={form.seatsPerRow} onChange={set('seatsPerRow')} required /></Field>
          </div>
          <div className="bg-cream-50 border border-cream-200 rounded-lg px-4 py-2 text-sm text-charcoal-600">
            Total capacity: <strong className="text-wine font-700">{capacity} seats</strong>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={close} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saveMut.isPending} className="btn-primary flex-1 justify-center gap-2">
              {saveMut.isPending ? <><Loader2 size={14} className="animate-spin"/>Saving…</> : editing ? 'Update' : 'Add Theater'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
