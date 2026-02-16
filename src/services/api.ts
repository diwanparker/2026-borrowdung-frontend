import axios from 'axios';
import type {
  Room,
  Booking,
  CreateRoomRequest,
  UpdateRoomRequest,
  CreateBookingRequest,
  UpdateBookingRequest,
  UpdateBookingStatusRequest,
  RoomFilters,
  BookingFilters,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5240/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Room API
export const roomAPI = {
  getAll: async (filters?: RoomFilters) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);

    const response = await api.get<Room[]>(`/Room?${params.toString()}`);
    return {
      data: response.data,
     headers: response.headers,
    };
  },

  getById: async (id: number) => {
    const response = await api.get<Room>(`/Room/${id}`);
    return response.data;
  },

  create: async (data: CreateRoomRequest) => {
    const response = await api.post<Room>('/Room', data);
    return response.data;
  },

  update: async (id: number, data: UpdateRoomRequest) => {
    const response = await api.put<Room>(`/Room/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/Room/${id}`);
    return response.data;
  },
};

// Booking API
export const bookingAPI = {
  getAll: async (filters?: BookingFilters) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status !== undefined) params.append('status', filters.status.toString());
    if (filters?.roomId) params.append('roomId', filters.roomId.toString());

    const response = await api.get<Booking[]>(`/Booking?${params.toString()}`);
    return {
      data: response.data,
      headers: response.headers,
    };
  },

  getById: async (id: number) => {
    const response = await api.get<Booking>(`/Booking/${id}`);
    return response.data;
  },

  create: async (data: CreateBookingRequest) => {
    const response = await api.post<Booking>('/Booking', data);
    return response.data;
  },

  update: async (id: number, data: UpdateBookingRequest) => {
    const response = await api.put<Booking>(`/Booking/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, data: UpdateBookingStatusRequest) => {
    const response = await api.put<Booking>(`/Booking/${id}/status`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/Booking/${id}`);
    return response.data;
  },

  getHistory: async (filters?: BookingFilters) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status !== undefined) params.append('status', filters.status.toString());
    if (filters?.roomId) params.append('roomId', filters.roomId.toString());

    const response = await api.get<Booking[]>(`/Booking/history?${params.toString()}`);
    return {
      data: response.data,
      headers: response.headers,
    };
  },
};

export default api;
