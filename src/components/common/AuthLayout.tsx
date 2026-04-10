import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children, footer }: {
  title: string; subtitle: string; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex overflow-x-hidden" style={{ background: '#FDFCF9' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[48%] shrink-0 relative overflow-hidden"
        style={{ background: '#1C1917' }}>
        {/* Grid pattern */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #F5F0E8 0, #F5F0E8 1px, transparent 0, transparent 50%)',
            backgroundSize: '24px 24px',
            opacity: 0.06,
          }} />
        {/* Gradient overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(139,26,43,0.25) 0%, transparent 50%, rgba(28,25,23,0.8) 100%)' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-wine rounded-lg flex items-center justify-center">
              <Film size={17} className="text-white" />
            </div>
            <span className="font-serif font-700 text-xl text-white">
              Cine<span className="text-wine-muted">Book</span>
            </span>
          </Link>

          <div>
            <p className="font-serif italic text-2xl leading-relaxed max-w-xs"
              style={{ color: 'rgba(245,240,232,0.65)' }}>
              "Cinema is a mirror by which we often see ourselves."
            </p>
            <p className="text-sm mt-3 font-500" style={{ color: 'rgba(245,240,232,0.35)' }}>
              — Martin Scorsese
            </p>
          </div>

          <p className="text-xs" style={{ color: 'rgba(245,240,232,0.25)' }}>
            © {new Date().getFullYear()} CineBook
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 min-h-screen"
        style={{ background: '#FDFCF9' }}>
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link to="/" className="flex items-center gap-2.5 justify-center">
            <div className="w-8 h-8 bg-wine rounded flex items-center justify-center">
              <Film size={15} className="text-white" />
            </div>
            <span className="font-serif font-700 text-xl text-charcoal">
              Cine<span className="text-wine">Book</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <h1 className="font-serif font-700 text-3xl text-charcoal">{title}</h1>
            <p className="text-charcoal-500 mt-2 text-sm leading-relaxed">{subtitle}</p>
          </div>
          {children}
          {footer && (
            <div className="mt-6 text-center text-sm text-charcoal-500">{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}
