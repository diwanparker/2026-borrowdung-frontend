import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { roomAPI, bookingAPI } from '../services/api';
import type { Room, Booking } from '../types';
import { BookingStatus } from '../types';
import Loading from '../components/Loading';
import { useAuth } from '../contexts/AuthContext';
import { formatDateTime, getBookingStatusText, getBookingStatusColor } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
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
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading message="Menyiapkan data dashboard..." />;

  const pendingBookings = bookings.filter((b) => b.status === BookingStatus.Pending);
  const approvedBookings = bookings.filter((b) => b.status === BookingStatus.Approved);
  const availableRoomsCount = rooms.filter((r) => r.status === 'Tersedia').length;

  const statCards = [
    {
      title: 'Total Ruangan',
      value: rooms.length,
      subtitle: `${availableRoomsCount} siap digunakan`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      bgGradient: 'from-blue-600 to-indigo-600',
      iconBg: 'bg-blue-50 text-blue-600',
      tag: 'Kapasitas Kampus',
    },
    {
      title: 'Ruangan Tersedia',
      value: availableRoomsCount,
      subtitle: `${rooms.length - availableRoomsCount} terpakai / maintenance`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgGradient: 'from-emerald-600 to-teal-600',
      iconBg: 'bg-emerald-50 text-emerald-600',
      tag: 'Status Realtime',
    },
    {
      title: 'Menunggu Review',
      value: pendingBookings.length,
      subtitle: 'Butuh tindakan persetujuan',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgGradient: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-50 text-amber-600',
      tag: 'Pending Approval',
    },
    {
      title: 'Peminjaman Aktif',
      value: approvedBookings.length,
      subtitle: 'Booking telah disetujui',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      bgGradient: 'from-purple-600 to-indigo-600',
      iconBg: 'bg-purple-50 text-purple-600',
      tag: 'Jadwal Sah',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10">
              <span>👋 Selamat datang di Portal Peminjaman</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Halo, {user?.fullName || 'Civitas PENS'}!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Pantau ketersediaan ruangan kampus dan ajukan peminjaman dengan alur approval otomatis dan bebas bentrok jadwal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/bookings"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 transition active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Ajukan Peminjaman</span>
            </Link>
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition active:scale-95 cursor-pointer"
            >
              <span>Jelajahi Ruangan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Decision-First Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-card transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.tag}
              </span>
              <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>{stat.icon}</div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-sm font-semibold text-slate-700">{stat.title}</p>
              <p className="text-xs text-slate-500">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Activity Feed & Upcoming Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Aktivitas Peminjaman Terkini</h2>
                <p className="text-xs text-slate-500 mt-0.5">Daftar booking terbaru yang masuk ke sistem</p>
              </div>
              <Link
                to="/bookings"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>Lihat Semua</span>
                <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm shrink-0 border border-slate-200">
                      {booking.room?.name?.[0] || 'R'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{booking.purpose}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBookingStatusColor(
                            booking.status
                          )}`}
                        >
                          {getBookingStatusText(booking.status)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-slate-700">{booking.bookerName}</span>
                        <span>•</span>
                        <span>{booking.room?.name || `Ruangan #${booking.roomId}`}</span>
                        <span>•</span>
                        <span>{formatDateTime(booking.startTime)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Belum ada data peminjaman di sistem.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & System Info */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Aksi Cepat</h2>
            <div className="space-y-3">
              <Link
                to="/bookings"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-800 hover:text-blue-700 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold">Buat Booking Baru</p>
                    <p className="text-xs text-slate-500">Pilih waktu & ruangan kosong</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-blue-600 transition">&rarr;</span>
              </Link>

              {user?.role === 'Admin' && (
                <Link
                  to="/rooms"
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-800 hover:text-emerald-700 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">Kelola Ruangan</p>
                      <p className="text-xs text-slate-500">Tambah atau ubah data ruang</p>
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-emerald-600 transition">&rarr;</span>
                </Link>
              )}
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-md">
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-300 mb-2">
              💡 Ketentuan Peminjaman
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                Pengajuan booking dilakukan minimal 1 hari sebelum kegiatan.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                Admin memverifikasi permohonan maksimal dalam 1x24 jam kerja.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                Wajib menjaga kebersihan dan fasilitas selama kegiatan berlangsung.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
