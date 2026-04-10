import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-cream-200 bg-cream-100 mt-20">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-wine rounded flex items-center justify-center">
                <Film size={13} className="text-white" />
              </div>
              <span className="font-serif font-700 text-lg text-charcoal">Cine<span className="text-wine">Book</span></span>
            </Link>
            <p className="text-sm text-charcoal-500 leading-relaxed max-w-xs">
              The refined way to book movie tickets. Browse, pick your seats, and experience cinema.
            </p>
          </div>
          <div>
            <p className="text-xs font-700 uppercase tracking-widest text-charcoal-500 mb-4">Explore</p>
            <div className="space-y-2.5">
              {[['/', 'Browse Movies'], ['/bookings', 'My Tickets'], ['/profile', 'Account']].map(([to, l]) => (
                <Link key={to} to={to} className="block text-sm text-charcoal-600 hover:text-wine transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-700 uppercase tracking-widest text-charcoal-500 mb-4">Support</p>
            <div className="space-y-2.5">
              {['Help Center', 'Cancellation Policy', 'Privacy Policy', 'Terms of Service'].map(l => (
                <a key={l} href="#" className="block text-sm text-charcoal-600 hover:text-wine transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-charcoal-500">© {new Date().getFullYear()} CineBook. All rights reserved.</p>
          <p className="text-xs text-charcoal-500">Made with care for cinema lovers</p>
        </div>
      </div>
    </footer>
  );
}
