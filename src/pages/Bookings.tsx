import { useEffect, useState, useCallback } from 'react';
import { bookingAPI, roomAPI } from '../services/api';
import type { Booking, Room, CreateBookingRequest } from '../types';
import { BookingStatus } from '../types';
import Loading from '../components/Loading';
import { formatDateTime, getBookingStatusText, getBookingStatusColor } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const Bookings = () => {
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateBookingRequest>({
    roomId: 0,
    bookerName: user?.fullName || '',
    bookerEmail: user?.email || '',
    bookerPhone: '',
    purpose: '',
    startTime: '',
    endTime: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const bookingsRes = await bookingAPI.getAll({
        search,
        status: statusFilter === '' ? undefined : statusFilter,
        pageSize: 100,
      });
      setBookings(bookingsRes.data);
    } catch (error: unknown) {
      console.error('Error fetching bookings:', error);
      showError('Gagal memuat data peminjaman');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, showError]);

  const fetchAvailableRooms = useCallback(async () => {
    if (!formData.startTime || !formData.endTime) {
      setAvailableRooms([]);
      return;
    }

    try {
      setLoadingRooms(true);
      const roomsRes = await roomAPI.getAll({
        pageSize: 100,
        status: 'Tersedia',
        startTime: formData.startTime,
        endTime: formData.endTime,
      });
      setAvailableRooms(roomsRes.data);
    } catch (error: unknown) {
      console.error('Error fetching available rooms:', error);
      showError('Gagal memeriksa ketersediaan ruangan');
    } finally {
      setLoadingRooms(false);
    }
  }, [formData.startTime, formData.endTime, showError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      fetchAvailableRooms();
    }
  }, [formData.startTime, formData.endTime, fetchAvailableRooms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomId) {
      showWarning('Silakan pilih salah satu ruangan yang tersedia');
      return;
    }

    setSubmitting(true);
    try {
      await bookingAPI.create(formData);
      showSuccess('Pengajuan peminjaman berhasil dikirim! Menunggu persetujuan admin.', 'Booking Terkirim');
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: unknown) {
      console.error('Error creating booking:', error);
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showError(message || 'Gagal mengajukan peminjaman');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenActionModal = (booking: Booking, type: 'approve' | 'reject') => {
    setSelectedBooking(booking);
    setActionType(type);
    setRejectionReason('');
    setShowApprovalModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedBooking) return;

    if (actionType === 'reject' && !rejectionReason.trim()) {
      showWarning('Harap isi alasan penolakan peminjaman');
      return;
    }

    setSubmitting(true);
    try {
      const newStatus = actionType === 'approve' ? BookingStatus.Approved : BookingStatus.Rejected;
      await bookingAPI.updateStatus(selectedBooking.id, {
        status: newStatus,
        rejectionReason: actionType === 'reject' ? rejectionReason : undefined,
      });

      showSuccess(
        actionType === 'approve'
          ? `Booking #${selectedBooking.id} berhasil disetujui!`
          : `Booking #${selectedBooking.id} berhasil ditolak.`,
        actionType === 'approve' ? 'Peminjaman Disetujui' : 'Peminjaman Ditolak'
      );

      setShowApprovalModal(false);
      setSelectedBooking(null);
      fetchData();
    } catch (error: unknown) {
      console.error('Error updating booking status:', error);
      showError('Gagal memperbarui status peminjaman');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      roomId: 0,
      bookerName: user?.fullName || '',
      bookerEmail: user?.email || '',
      bookerPhone: '',
      purpose: '',
      startTime: '',
      endTime: '',
    });
    setAvailableRooms([]);
  };

  // Status counts for tab badges
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === BookingStatus.Pending).length;
  const approvedCount = bookings.filter((b) => b.status === BookingStatus.Approved).length;
  const rejectedCount = bookings.filter((b) => b.status === BookingStatus.Rejected).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Peminjaman Ruangan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Ajukan permohonan baru dan kelola jadwal peminjaman ruangan
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Ajukan Peminjaman</span>
        </button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: '', label: 'Semua Status', count: totalCount },
            { id: BookingStatus.Pending, label: 'Menunggu Review', count: pendingCount, color: 'text-amber-700 bg-amber-50' },
            { id: BookingStatus.Approved, label: 'Disetujui', count: approvedCount, color: 'text-emerald-700 bg-emerald-50' },
            { id: BookingStatus.Rejected, label: 'Ditolak', count: rejectedCount, color: 'text-rose-700 bg-rose-50' },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={String(tab.id)}
                onClick={() => setStatusFilter(tab.id as BookingStatus | '')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan nama peminjam, kegiatan, atau ruangan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && <Loading message="Memuat daftar peminjaman..." />}

      {/* Bookings List */}
      {!loading && (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isPending = booking.status === BookingStatus.Pending;
            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-card transition-all duration-200 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm">
                      {booking.room?.name?.[0] || 'R'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">{booking.purpose}</h3>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getBookingStatusColor(
                            booking.status
                          )}`}
                        >
                          {getBookingStatusText(booking.status)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-700">{booking.bookerName}</span>
                        <span>•</span>
                        <span>{booking.bookerEmail}</span>
                        {booking.bookerPhone && (
                          <>
                            <span>•</span>
                            <span>{booking.bookerPhone}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {user?.role === 'Admin' && isPending && (
                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenActionModal(booking, 'approve')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Setujui</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenActionModal(booking, 'reject')}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Tolak</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Details Bar: Room & Time Window */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl">
                    <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>
                      Ruangan:{' '}
                      <strong className="text-slate-800 font-semibold">
                        {booking.room?.name || `Ruangan #${booking.roomId}`}
                      </strong>{' '}
                      {booking.room?.location && `(${booking.room.location})`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl">
                    <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Jadwal:{' '}
                      <strong className="text-slate-800 font-semibold">
                        {formatDateTime(booking.startTime)}
                      </strong>{' '}
                      s/d{' '}
                      <strong className="text-slate-800 font-semibold">
                        {formatDateTime(booking.endTime)}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && bookings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-800 font-bold text-base">Tidak ada data peminjaman</p>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Belum ada permohonan yang sesuai dengan filter yang aktif saat ini.
          </p>
        </div>
      )}

      {/* 2-Step Create Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-modal border border-slate-100 animate-slide-up space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Ajukan Peminjaman Ruangan</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tentukan waktu peminjaman untuk menemukan ruangan yang tersedia
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Time Selection */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <span>📅 Langkah 1: Pilih Waktu Peminjaman</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Waktu Mulai *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Waktu Selesai *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Room Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                  <span>🏢 Langkah 2: Pilih Ruangan Tersedia *</span>
                  {loadingRooms && <span className="text-blue-600 font-normal">Mengecek jadwal...</span>}
                </label>

                {(!formData.startTime || !formData.endTime) && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    ℹ️ Silakan isi waktu mulai dan selesai terlebih dahulu untuk melihat ruangan yang siap digunakan.
                  </p>
                )}

                {formData.startTime && formData.endTime && availableRooms.length === 0 && !loadingRooms && (
                  <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                    ⚠️ Tidak ada ruangan yang tersedia pada rentang waktu ini. Silakan coba waktu lain.
                  </p>
                )}

                {availableRooms.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
                    {availableRooms.map((room) => {
                      const isSelected = formData.roomId === room.id;
                      return (
                        <div
                          key={room.id}
                          onClick={() => setFormData({ ...formData, roomId: room.id })}
                          className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/20 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-slate-900">{room.name}</span>
                            {isSelected && (
                              <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {room.location} • Kapasitas {room.capacity} orang
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 3: Booker Info */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  📝 Langkah 3: Informasi Peminjam
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tujuan / Nama Kegiatan *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rapat Himpunan Mahasiswa TI, Sidang Akhir"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Peminjam *
                    </label>
                    <input
                      type="text"
                      value={formData.bookerName}
                      onChange={(e) => setFormData({ ...formData, bookerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      No. WhatsApp / HP
                    </label>
                    <input
                      type="tel"
                      placeholder="081234567890"
                      value={formData.bookerPhone}
                      onChange={(e) => setFormData({ ...formData, bookerPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.roomId}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Mengirim Pengajuan...' : 'Kirim Pengajuan Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Approval / Rejection Modal */}
      {showApprovalModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-modal border border-slate-100 animate-slide-up space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {actionType === 'approve' ? 'Konfirmasi Persetujuan' : 'Tolak Peminjaman'}
              </h2>
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Kegiatan:</span> {selectedBooking.purpose}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Peminjam:</span> {selectedBooking.bookerName}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Ruangan:</span>{' '}
                {selectedBooking.room?.name || `Ruangan #${selectedBooking.roomId}`}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Waktu:</span>{' '}
                {formatDateTime(selectedBooking.startTime)} s/d {formatDateTime(selectedBooking.endTime)}
              </p>
            </div>

            {actionType === 'reject' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Alasan Penolakan *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Ruangan akan digunakan untuk ujian dinas kampus."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition resize-none"
                  required
                ></textarea>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={submitting}
                className={`px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition active:scale-95 cursor-pointer ${
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {submitting ? 'Memproses...' : actionType === 'approve' ? 'Ya, Setujui' : 'Tolak Peminjaman'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
