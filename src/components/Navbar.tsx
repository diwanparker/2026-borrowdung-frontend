import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Borrowdung - Sistem Peminjaman Ruangan
          </Link>
          <div className="flex items-center space-x-4">
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

            {/* User Info & Logout */}
            <div className="flex items-center space-x-3 ml-4 border-l border-blue-500 pl-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-blue-200">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
