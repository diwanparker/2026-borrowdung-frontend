import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roomAPI, bookingAPI } from '../services/api';
import { Room, Booking, BookingStatus } from '../types';
import Loading from '../components/Loading';

const Dashboard = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          roomAPI.getAll({ pageSize: 100 }),
          bookingAPI.getAll({ pageSize: 100 }),
        ]);
        setRooms(roomsRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  const pendingCount = bookings.filter(b => b.status === BookingStatus.Pending).length;
  const approvedCount = bookings.filter(b => b.status === BookingStatus.Approved).length;
  const availableRooms = rooms.filter(r => r.status === 'Tersedia').length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Ruangan</p>
              <p className="text-3xl font-bold text-blue-600">{rooms.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{availableRooms} tersedia</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Booking Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Menunggu persetujuan</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Booking Disetujui</p>
              <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Booking aktif</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/bookings/new"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition"
            >
              + Buat Booking Baru
            </Link>
            <Link
              to="/rooms/new"
              className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition"
            >
              + Tambah Ruangan Baru
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Booking Terbaru</h2>
          <div className="space-y-3">
            {bookings.slice(0, 5).map(booking => (
              <div key={booking.id} className="border-l-4 border-blue-500 pl-3 py-2">
                <p className="font-semibold">{booking.purpose}</p>
                <p className="text-sm text-gray-600">{booking.bookerName}</p>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-gray-500">Belum ada booking</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
