import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export const cn = (...i: ClassValue[]) => twMerge(clsx(i));

export const fmt = {
  date: (d: string, p = 'EEE, MMM dd yyyy') => format(parseISO(d), p),
  time: (t: string) => { const [h,m]=t.split(':'); const hr=+h; return `${hr%12||12}:${m} ${hr>=12?'PM':'AM'}`; },
  currency: (n: number) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n),
  duration: (m: number) => { const h=Math.floor(m/60); const min=m%60; return h>0?`${h}h${min>0?` ${min}m`:''}` :`${min}m`; },
};

export const getError = (e: unknown): string => {
  if (e && typeof e==='object' && 'response' in e) {
    const ax = e as {response?:{data?:{message?:string}}};
    return ax.response?.data?.message || 'Something went wrong';
  }
  return e instanceof Error ? e.message : 'Something went wrong';
};

export const GENRES: Record<string, string> = {
  ACTION:'Action', ADVENTURE:'Adventure', ANIMATION:'Animation', COMEDY:'Comedy',
  CRIME:'Crime', DOCUMENTARY:'Documentary', DRAMA:'Drama', FANTASY:'Fantasy',
  HORROR:'Horror', MYSTERY:'Mystery', ROMANCE:'Romance', SCI_FI:'Sci-Fi',
  THRILLER:'Thriller', WAR:'War', WESTERN:'Western',
};

export const GENRE_COLORS: Record<string, string> = {
  ACTION:'badge-wine', ADVENTURE:'badge-gold', ANIMATION:'badge-sage',
  COMEDY:'badge-yellow', CRIME:'badge-neutral', DOCUMENTARY:'badge-neutral',
  DRAMA:'badge-neutral', FANTASY:'badge-gold', HORROR:'badge-wine',
  MYSTERY:'badge-neutral', ROMANCE:'badge-wine', SCI_FI:'badge-sage',
  THRILLER:'badge-wine', WAR:'badge-neutral', WESTERN:'badge-gold',
};

export const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80';

export const loadRazorpay = (): Promise<boolean> => new Promise(res => {
  if (document.getElementById('rzp')) return res(true);
  const s = document.createElement('script');
  s.id = 'rzp'; s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.onload = () => res(true); s.onerror = () => res(false);
  document.body.appendChild(s);
});
