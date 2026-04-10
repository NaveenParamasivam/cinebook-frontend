import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function RootLayout() {
  const { pathname } = useLocation();
  const noFooter = pathname.includes('/seats');
  return (
    <div className="flex flex-col min-h-screen w-full bg-cream-50 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full pt-[64px]">
        <Outlet />
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}
