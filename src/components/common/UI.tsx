import { cn } from '@/utils';
import { Loader2, Inbox, Ticket, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Skeleton ──────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

export function MovieCardSkeleton() {
  return (
    <div className="bg-white border border-cream-200 rounded-xl overflow-hidden">
      <Skeleton className="aspect-[2/3] rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {Array.from({ length: count }).map((_, i) => <MovieCardSkeleton key={i} />)}
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────
export function Spinner({ size = 18, className }: { size?: number; className?: string }) {
  return <Loader2 size={size} className={cn('animate-spin text-wine', className)} />;
}

export function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-12 h-12 bg-wine rounded-xl flex items-center justify-center">
        <Film size={22} className="text-white animate-pulse" />
      </div>
      <p className="text-sm text-charcoal-500 font-500">Loading…</p>
    </div>
  );
}

// ── Empty ─────────────────────────────────────────────
export function Empty({ icon, title, desc, action }: {
  icon?: React.ReactNode; title: string; desc?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-cream-100 border border-cream-200 flex items-center justify-center text-charcoal-500">
        {icon ?? <Inbox size={26} />}
      </div>
      <div>
        <p className="font-serif font-600 text-lg text-charcoal">{title}</p>
        {desc && <p className="text-sm text-charcoal-500 mt-1 max-w-xs">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function NoTickets() {
  return <Empty icon={<Ticket size={26} />} title="No bookings yet" desc="Book your first movie and it will appear here." />;
}

// ── Modal ─────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-xl' }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn('bg-white rounded-2xl shadow-lift w-full overflow-hidden', maxWidth)}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-100">
              <h3 className="font-serif font-600 text-lg text-charcoal">{title}</h3>
              <button onClick={onClose} className="w-8 h-8 rounded flex items-center justify-center text-charcoal-500 hover:bg-cream-100 hover:text-charcoal transition-colors text-xl leading-none">×</button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Form Field ────────────────────────────────────────
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="input-label">{label}</label>
      {children}
      {hint && <p className="text-xs text-charcoal-500 mt-1">{hint}</p>}
    </div>
  );
}
