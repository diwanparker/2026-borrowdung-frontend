import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Borrowdung - Sistem Peminjaman Ruangan
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/rooms"
              className="px-3 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Ruangan
            </Link>
            <Link
              to="/bookings"
              className="px-3 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Peminjaman
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
