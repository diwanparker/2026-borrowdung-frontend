import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1">
            <span className="font-semibold text-slate-700">Borrowdung</span> &copy; 2026 — Politeknik Elektronika Negeri Surabaya (PENS)
          </p>
          <p className="text-slate-400">
            Project-Based Learning (PdBL) · Enterprise Room Booking System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
