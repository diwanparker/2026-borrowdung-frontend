export interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  bookings?: Booking[];
}

export interface CreateRoomRequest {
  name: string;
  location: string;
  capacity: number;
  description?: string;
  status?: string;
}

export interface UpdateRoomRequest {
  name: string;
  location: string;
  capacity: number;
  description?: string;
  status?: string;
}

export interface Booking {
  id: number;
  roomId: number;
  bookerName: string;
  bookerEmail: string;
  bookerPhone: string | null;
  purpose: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  room?: Room;
}

export const BookingStatus = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export interface CreateBookingRequest {
  roomId: number;
  bookerName: string;
  bookerEmail: string;
  bookerPhone?: string;
  purpose: string;
  startTime: string;
  endTime: string;
}

export interface UpdateBookingRequest {
  roomId: number;
  bookerName: string;
  bookerEmail: string;
  bookerPhone?: string;
  purpose: string;
  startTime: string;
  endTime: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  rejectionReason?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface RoomFilters extends PaginationParams {
  status?: string;
}

export interface BookingFilters extends PaginationParams {
  status?: BookingStatus;
  roomId?: number;
}

// Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}
