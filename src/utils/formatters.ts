import { BookingStatus } from '../types';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getBookingStatusText = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.Pending:
      return 'Menunggu Review';
    case BookingStatus.Approved:
      return 'Disetujui';
    case BookingStatus.Rejected:
      return 'Ditolak';
    default:
      return 'Unknown';
  }
};

export const getBookingStatusColor = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.Pending:
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    case BookingStatus.Approved:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case BookingStatus.Rejected:
      return 'bg-rose-50 text-rose-700 border-rose-200/80';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200/80';
  }
};

export const getRoomStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'tersedia':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'terpakai':
    case 'tidak tersedia':
      return 'bg-rose-50 text-rose-700 border-rose-200/80';
    case 'maintenance':
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200/80';
  }
};
