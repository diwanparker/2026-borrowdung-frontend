import { useEffect, useState } from 'react';
import { bookingAPI, roomAPI } from '../services/api';
import { Booking, Room, CreateBookingRequest, BookingStatus } from '../types';
import Loading from '../components/Loading';
import { formatDateTime, getBookingStatusText, getBookingStatusColor } from '../utils/formatters';

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [showModal, setShowModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [formData, setFormData] = useState<CreateBookingRequest>({
    roomId: 0,
    bookerName: '',
    bookerEmail: '',
    bookerPhone: '',
    purpose: '',
    startTime: '',
    endTime: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, roomsRes] = await Promise.all([
        bookingAPI.getAll({ search, status: statusFilter === '' ? undefined : statusFilter, pageSize: 100 }),
        roomAPI.getAll({ pageSize: 100 }),
      ]);
      setBookings(bookingsRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bookingAPI.create(formData);
      alert('Booking berhasil dibuat!');
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.message || 'Gagal membuat booking');
    }
  };

  const handleApprove = async () => {
    if (!selectedBooking) return;
    try {
      await bookingAPI.updateStatus(selectedBooking.id, { status: BookingStatus.Approved });
      alert('Booking berhasil disetujui!');
      setShowApprovalModal(false);
      setSelectedBooking(null);
      fetchData();
    } catch (error) {
      console.error('Error approving booking:', error);
      alert('Gagal menyetujui booking');
    }
  };

  const handleReject = async () => {
    if (!selectedBooking || !rejectionReason) {
      alert('Alasan penolakan harus diisi!');
      return;
    }
    try {
      await bookingAPI.updateStatus(selectedBooking.id, {
        status: BookingStatus.Rejected,
        rejectionReason,
      });
      alert('Booking berhasil ditolak!');
      setShowApprovalModal(false);
      setSelectedBooking(null);
      setRejectionReason('');
      fetchData();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Gagal menolak booking');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus booking ini?')) return;
    try {
      await bookingAPI.delete(id);
      alert('Booking berhasil dihapus!');
      fetchData();
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Gagal menghapus booking');
    }
  };

  const resetForm = () => {
    setFormData({
      roomId: 0,
      bookerName: '',
      bookerEmail: '',
      bookerPhone: '',
      purpose: '',
      startTime: '',
      endTime: '',
    });
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Peminjaman</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Buat Booking
        </button>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Cari booking..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value === '' ? '' : parseInt(e.target.value))}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value={BookingStatus.Pending}>Pending</option>
          <option value={BookingStatus.Approved}>Disetujui</option>
          <option value={BookingStatus.Rejected}>Ditolak</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{booking.purpose}</h3>
                <p className="text-gray-600">{booking.room?.name || `Room ID: ${booking.roomId}`}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBookingStatusColor(booking.status)}`}>
                {getBookingStatusText(booking.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Peminjam</p>
                <p className="font-semibold">{booking.bookerName}</p>
                <p className="text-sm text-gray-600">{booking.bookerEmail}</p>
                {booking.bookerPhone && <p className="text-sm text-gray-600">{booking.bookerPhone}</p>}
              </div>
              <div>
                <p className="text-sm text-gray-500">Waktu</p>
                <p className="font-semibold">{formatDateTime(booking.startTime)}</p>
                <p className="text-gray-600">sampai</p>
                <p className="font-semibold">{formatDateTime(booking.endTime)}</p>
              </div>
            </div>

            {booking.rejectionReason && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                <p className="text-sm font-semibold text-red-800">Alasan Penolakan:</p>
                <p className="text-sm text-red-700">{booking.rejectionReason}</p>
              </div>
            )}

            <div className="flex gap-2">
              {booking.status === BookingStatus.Pending && (
                <button
                  onClick={() => { setSelectedBooking(booking); setShowApprovalModal(true); }}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
                >
                  Proses
                </button>
              )}
              <button
                onClick={() => handleDelete(booking.id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition ml-auto"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Tidak ada booking ditemukan</p>
        </div>
      )}

      {/* Create Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Buat Booking Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ruangan *</label>
                <select
                  required
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value={0}>Pilih Ruangan</option>
                  {rooms.filter(r => r.status === 'Tersedia').map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name} - {room.location} (Kapasitas: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Peminjam *</label>
                <input
                  type="text"
                  required
                  value={formData.bookerName}
                  onChange={(e) => setFormData({ ...formData, bookerName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.bookerEmail}
                  onChange={(e) => setFormData({ ...formData, bookerEmail: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">No. Telepon</label>
                <input
                  type="tel"
                  value={formData.bookerPhone}
                  onChange={(e) => setFormData({ ...formData, bookerPhone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tujuan Peminjaman *</label>
                <textarea
                  required
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Waktu Mulai *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Waktu Selesai *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Proses Booking</h2>
            <div className="mb-4">
              <p className="font-semibold">{selectedBooking.purpose}</p>
              <p className="text-sm text-gray-600">{selectedBooking.bookerName}</p>
              <p className="text-sm text-gray-600">{formatDateTime(selectedBooking.startTime)} - {formatDateTime(selectedBooking.endTime)}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Alasan Penolakan (jika ditolak)</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={3}
                placeholder="Isi jika ingin menolak booking..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setShowApprovalModal(false); setSelectedBooking(null); setRejectionReason(''); }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Tutup
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Tolak
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Setujui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
