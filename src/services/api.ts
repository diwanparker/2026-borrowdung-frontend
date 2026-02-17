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
  LoginRequest,
  LoginResponse,
  User,
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
  getAll: async (filters?: RoomFilters & { startTime?: string; endTime?: string }) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startTime) params.append('startTime', filters.startTime);
    if (filters?.endTime) params.append('endTime', filters.endTime);

    const response = await api.get<Room[]>(`/Rooms?${params.toString()}`);
    return {
      data: response.data,
     headers: response.headers,
    };
  },

  getById: async (id: number) => {
    const response = await api.get<Room>(`/Rooms/${id}`);
    return response.data;
  },

  create: async (data: CreateRoomRequest) => {
    const response = await api.post<Room>('/Rooms', data);
    return response.data;
  },

  update: async (id: number, data: UpdateRoomRequest) => {
    const response = await api.put<Room>(`/Rooms/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/Rooms/${id}`);
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

    const response = await api.get<Booking[]>(`/Bookings?${params.toString()}`);
    return {
      data: response.data,
      headers: response.headers,
    };
  },

  getById: async (id: number) => {
    const response = await api.get<Booking>(`/Bookings/${id}`);
    return response.data;
  },

  create: async (data: CreateBookingRequest) => {
    const response = await api.post<Booking>('/Bookings', data);
    return response.data;
  },

  update: async (id: number, data: UpdateBookingRequest) => {
    const response = await api.put<Booking>(`/Bookings/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, data: UpdateBookingStatusRequest) => {
    const response = await api.patch<Booking>(`/Bookings/${id}/status`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/Bookings/${id}`);
    return response.data;
  },

  getHistory: async (filters?: BookingFilters) => {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status !== undefined) params.append('status', filters.status.toString());
    if (filters?.roomId) params.append('roomId', filters.roomId.toString());

    const response = await api.get<Booking[]>(`/Bookings/history?${params.toString()}`);
    return {
      data: response.data,
      headers: response.headers,
    };
  },
};

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>('/Auth/login', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<User>('/Auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default api;
