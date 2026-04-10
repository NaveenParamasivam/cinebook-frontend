import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/store/authStore';
import RootLayout from '@/components/layout/RootLayout';
import AdminLayout from '@/components/layout/AdminLayout';

import HomePage from '@/pages/HomePage';
import MoviePage from '@/pages/MoviePage';
import SeatPage from '@/pages/SeatPage';
import BookingPage from '@/pages/BookingPage';
import HistoryPage from '@/pages/HistoryPage';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import AdminRegisterPage from '@/pages/auth/AdminRegisterPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import MoviesAdminPage from '@/pages/admin/MoviesAdminPage';
import TheatersAdminPage from '@/pages/admin/TheatersAdminPage';
import ShowsAdminPage from '@/pages/admin/ShowsAdminPage';

const Guard = ({ children, admin }: { children: React.ReactNode; admin?: boolean }) => {
  const { isAuth, isAdmin } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  if (admin && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const GuestOnly = ({ children }: { children: React.ReactNode }) => {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to="/" replace /> : <>{children}</>;
};

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/"               element={<HomePage />} />
        <Route path="/movies/:id"     element={<MoviePage />} />
        <Route path="/shows/:id/seats" element={<Guard><SeatPage /></Guard>} />
        <Route path="/bookings/:id"   element={<Guard><BookingPage /></Guard>} />
        <Route path="/bookings"       element={<Guard><HistoryPage /></Guard>} />
        <Route path="/profile"        element={<Guard><ProfilePage /></Guard>} />
      </Route>

      <Route path="/login"          element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register"       element={<GuestOnly><RegisterPage /></GuestOnly>} />
      <Route path="/admin-register" element={<GuestOnly><AdminRegisterPage /></GuestOnly>} />

      <Route path="/admin" element={<Guard admin><AdminLayout /></Guard>}>
        <Route index       element={<DashboardPage />} />
        <Route path="movies"   element={<MoviesAdminPage />} />
        <Route path="theaters" element={<TheatersAdminPage />} />
        <Route path="shows"    element={<ShowsAdminPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
