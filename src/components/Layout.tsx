import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>&copy; 2026 Borrowdung - PENS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
