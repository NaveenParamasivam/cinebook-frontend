import { useQuery } from '@tanstack/react-query';
import { Film, Building2, Calendar, TrendingUp } from 'lucide-react';
import { movieApi, theaterApi } from '@/services/api';
import { Skeleton } from '@/components/common/UI';

export default function DashboardPage() {
  const { data: movies } = useQuery({ queryKey: ['admin-movies'], queryFn: () => movieApi.getAll().then(r => r.data.data) });
  const { data: theaters } = useQuery({ queryKey: ['admin-theaters'], queryFn: () => theaterApi.getAll().then(r => r.data.data) });

  const stats = [
    { label: 'Total Movies',    value: movies?.length,                                           icon: Film,        color: 'text-blue-600',  bg: 'bg-blue-50 border-blue-100' },
    { label: 'Active Movies',   value: movies?.filter(m => m.active).length,                    icon: TrendingUp,  color: 'text-wine',       bg: 'bg-red-50 border-red-100' },
    { label: 'Theaters',        value: theaters?.length,                                         icon: Building2,   color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
    { label: 'Cities',          value: theaters ? new Set(theaters.map(t => t.city)).size : undefined, icon: Calendar,    color: 'text-sage',       bg: 'bg-emerald-50 border-emerald-100' },
  ];

  return (
    <div className="p-8 w-full overflow-x-hidden">
      <div className="mb-8">
        <h1 className="font-serif font-700 text-2xl text-charcoal">Dashboard</h1>
        <p className="text-charcoal-500 text-sm mt-1">Platform overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`bg-white border rounded-xl p-5 ${bg}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-700 uppercase tracking-widest text-charcoal-500">{label}</p>
              <div className={`w-8 h-8 rounded-lg ${bg} border flex items-center justify-center`}>
                <Icon size={15} className={color} />
              </div>
            </div>
            {value !== undefined
              ? <p className={`font-serif font-700 text-3xl ${color}`}>{value}</p>
              : <Skeleton className="h-8 w-12" />}
          </div>
        ))}
      </div>

      {/* Recent movies */}
      <div className="bg-white border border-cream-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-cream-100">
          <h2 className="font-serif font-700 text-charcoal">Recent Films</h2>
        </div>
        <div className="divide-y divide-cream-100">
          {movies?.slice(0, 6).map(movie => (
            <div key={movie.id} className="flex items-center gap-4 px-5 py-3">
              <div className="w-9 h-12 rounded-lg overflow-hidden bg-cream-100 shrink-0">
                {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-600 text-charcoal text-sm truncate">{movie.title}</p>
                <p className="text-charcoal-500 text-xs">{movie.genre} · {movie.language}</p>
              </div>
              <span className={`badge ${movie.active ? 'badge-green' : 'badge-neutral'}`}>{movie.active ? 'Active' : 'Inactive'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
