import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Film, Building2, Calendar, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/store/authStore';
import { cn } from '@/utils';

const nav = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/movies',     icon: Film,            label: 'Movies' },
  { to: '/admin/theaters',   icon: Building2,       label: 'Theaters' },
  { to: '/admin/shows',      icon: Calendar,        label: 'Shows' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full bg-cream-50 overflow-x-hidden">
      <aside className="w-60 shrink-0 border-r border-cream-200 bg-white flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-cream-100">
          <p className="font-serif font-700 text-base text-charcoal">CineBook</p>
          <p className="text-xs text-wine font-600 uppercase tracking-wider mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded text-sm font-500 transition-all group',
              isActive ? 'bg-wine text-white' : 'text-charcoal-600 hover:text-charcoal hover:bg-cream-100'
            )}>
              <Icon size={15} className="shrink-0" />
              <span className="flex-1">{label}</span>
              <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-cream-100">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-600 text-charcoal">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-charcoal-500 truncate">{user?.email}</p>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded text-sm text-wine hover:bg-wine/5 transition-colors font-500">
            <LogOut size={14} />Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-x-hidden"><Outlet /></main>
    </div>
  );
}
