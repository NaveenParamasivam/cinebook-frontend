import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuth: boolean;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (u: User) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null, token: null, isAuth: false, isAdmin: false,
      setAuth: (user, token) => {
        localStorage.setItem('cb_token', token);
        set({ user, token, isAuth: true, isAdmin: user.role === 'ROLE_ADMIN' });
      },
      logout: () => {
        localStorage.removeItem('cb_token');
        set({ user: null, token: null, isAuth: false, isAdmin: false });
      },
      updateUser: (u) => set({ user: u, isAdmin: u.role === 'ROLE_ADMIN' }),
    }),
    { name: 'cb_auth', partialize: s => ({ user: s.user, token: s.token }) }
  )
);
