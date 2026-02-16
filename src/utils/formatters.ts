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
    month: 'long',
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
      return 'Pending';
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
      return 'bg-yellow-100 text-yellow-800';
    case BookingStatus.Approved:
      return 'bg-green-100 text-green-800';
    case BookingStatus.Rejected:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getRoomStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'tersedia':
      return 'bg-green-100 text-green-800';
    case 'tidak tersedia':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
