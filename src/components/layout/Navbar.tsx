import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Menu, X, User, Ticket, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '@/store/authStore';
import { cn } from '@/utils';
import { movieApi } from '@/services/api';
import type { Movie } from '@/types';

interface NavItem { to: string; label: string }
interface DropdownItem { to: string; label: string; icon: React.ReactNode }

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userOpen, setUserOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [query, setQuery]             = useState('');
  const [results, setResults]         = useState<Movie[]>([]);
  const searchRef                     = useRef<HTMLDivElement>(null);
  const { isAuth, isAdmin, user, logout } = useAuth();
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      try { const { data } = await movieApi.search(query); setResults(data.data.slice(0, 5)); }
      catch { setResults([]); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false); setQuery(''); setResults([]);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const navItems: NavItem[] = [
    { to: '/', label: 'Browse' },
    ...(isAuth ? [{ to: '/bookings', label: 'My Tickets' }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
  ];

  const mobileItems: NavItem[] = [
    { to: '/', label: 'Browse Movies' },
    ...(isAuth ? [{ to: '/bookings', label: 'My Tickets' }, { to: '/profile', label: 'Profile' }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel' }] : []),
  ];

  const dropdownItems: DropdownItem[] = [
    { to: '/profile', label: 'Profile',    icon: <User size={13} /> },
    { to: '/bookings', label: 'My Tickets', icon: <Ticket size={13} /> },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel', icon: <Shield size={13} /> }] : []),
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full',
      scrolled
        ? 'bg-cream-50/95 backdrop-blur-md border-b border-cream-200 shadow-sm'
        : 'bg-cream-50/80 backdrop-blur-sm'
    )}>
      <div className="container-app">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 bg-wine rounded flex items-center justify-center group-hover:bg-wine-light transition-colors">
              <Film size={15} className="text-white" />
            </div>
            <span className="font-serif font-700 text-xl text-charcoal tracking-tight">
              Cine<span className="text-wine">Book</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map(({ to, label }) => (
              <Link key={to} to={to} className={cn(
                'px-3.5 py-2 rounded text-sm font-500 transition-colors',
                pathname === to
                  ? 'text-wine bg-wine/8'
                  : 'text-charcoal-600 hover:text-charcoal hover:bg-cream-200'
              )}>{label}</Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(v => !v)}
                className={cn(
                  'w-9 h-9 rounded border flex items-center justify-center text-charcoal-600 hover:text-charcoal transition-all',
                  searchOpen ? 'border-charcoal bg-cream-100' : 'border-cream-200 hover:border-charcoal-600 bg-transparent'
                )}
              >
                <Search size={15} />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-cream-200 rounded-xl shadow-card-lg overflow-hidden z-50">
                  <div className="p-3 border-b border-cream-100">
                    <input
                      autoFocus
                      className="input border-0 bg-cream-50 text-sm py-2"
                      placeholder="Search movies, directors…"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                    />
                  </div>
                  {results.length > 0 ? (
                    <div>
                      {results.map(m => (
                        <button
                          key={m.id}
                          onClick={() => { navigate(`/movies/${m.id}`); setSearchOpen(false); setQuery(''); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cream-50 text-left transition-colors"
                        >
                          <div className="w-8 h-11 bg-cream-200 rounded shrink-0 overflow-hidden">
                            {m.posterUrl && (
                              <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-600 text-charcoal truncate">{m.title}</p>
                            <p className="text-xs text-charcoal-500">{m.language} · {m.genre}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : query.length > 1 ? (
                    <p className="p-4 text-sm text-charcoal-500 text-center">No results for "{query}"</p>
                  ) : null}
                </div>
              )}
            </div>

            {/* User dropdown */}
            {isAuth ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded border border-cream-200 hover:border-charcoal-600 transition-all text-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-wine text-white flex items-center justify-center text-xs font-700 font-serif shrink-0">
                    {user?.firstName?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-500 text-charcoal">{user?.firstName}</span>
                  <ChevronDown size={13} className={cn('text-charcoal-500 transition-transform duration-200', userOpen && 'rotate-180')} />
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-cream-200 rounded-xl shadow-card-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-cream-100">
                      <p className="text-sm font-600 text-charcoal">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-charcoal-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      {dropdownItems.map(({ to, label, icon }) => (
                        <button
                          key={to}
                          onClick={() => { navigate(to); setUserOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-charcoal-600 hover:text-charcoal hover:bg-cream-50 transition-colors"
                        >
                          {icon}{label}
                        </button>
                      ))}
                      <div className="border-t border-cream-100 mt-1 pt-1">
                        <button
                          onClick={() => { logout(); navigate('/'); setUserOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-wine hover:bg-wine/5 transition-colors"
                        >
                          <LogOut size={13} />Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
                <Link to="/register" className="btn-primary btn-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden w-9 h-9 rounded border border-cream-200 flex items-center justify-center text-charcoal"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cream-50 border-t border-cream-200 w-full">
          <div className="container-app py-4 space-y-1">
            {mobileItems.map(({ to, label }) => (
              <Link
                key={to} to={to}
                className="block px-3 py-2.5 rounded text-sm font-500 text-charcoal-600 hover:text-charcoal hover:bg-cream-200 transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="pt-3 flex gap-2">
              {isAuth ? (
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="btn-wine-outline text-sm w-full justify-center"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-sm flex-1 justify-center">Sign In</Link>
                  <Link to="/register" className="btn-primary text-sm flex-1 justify-center">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
