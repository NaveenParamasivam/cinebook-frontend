import axios from 'axios';
import type { ApiResponse, AuthResponse, Movie, Theater, Show, Seat, Booking, User, RazorpayOrderResponse } from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('cb_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('cb_token');
    localStorage.removeItem('cb_user');
    window.location.href = '/login';
  }
  return Promise.reject(err);
});

export default api;

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  login:         (d:{email:string;password:string}) => api.post<ApiResponse<AuthResponse>>('/auth/login', d),
  register:      (d:object) => api.post<ApiResponse<AuthResponse>>('/auth/register', d),
  registerAdmin: (d:object) => api.post<ApiResponse<AuthResponse>>('/auth/register-admin', d),
};

// ── User ──────────────────────────────────────────────
export const userApi = {
  me:             () => api.get<ApiResponse<User>>('/users/me'),
  updateProfile:  (d:object) => api.put<ApiResponse<User>>('/users/me', d),
  changePassword: (d:object) => api.put<ApiResponse<void>>('/users/me/password', d),
};

// ── Movies ────────────────────────────────────────────
export const movieApi = {
  getAll:    () => api.get<ApiResponse<Movie[]>>('/movies'),
  getById:   (id:number) => api.get<ApiResponse<Movie>>(`/movies/${id}`),
  search:    (q:string) => api.get<ApiResponse<Movie[]>>(`/movies/search?q=${encodeURIComponent(q)}`),
  byGenre:   (g:string) => api.get<ApiResponse<Movie[]>>(`/movies/genre/${g}`),
  create:    (d:object) => api.post<ApiResponse<Movie>>('/movies', d),
  update:    (id:number, d:object) => api.put<ApiResponse<Movie>>(`/movies/${id}`, d),
  remove:    (id:number) => api.delete<ApiResponse<void>>(`/movies/${id}`),
};

// ── Theaters ──────────────────────────────────────────
export const theaterApi = {
  getAll:  () => api.get<ApiResponse<Theater[]>>('/theaters'),
  getById: (id:number) => api.get<ApiResponse<Theater>>(`/theaters/${id}`),
  create:  (d:object) => api.post<ApiResponse<Theater>>('/theaters', d),
  update:  (id:number, d:object) => api.put<ApiResponse<Theater>>(`/theaters/${id}`, d),
  remove:  (id:number) => api.delete<ApiResponse<void>>(`/theaters/${id}`),
};

// ── Shows ─────────────────────────────────────────────
export const showApi = {
  byMovieAndDate: (movieId:number, date:string) => api.get<ApiResponse<Show[]>>(`/shows/movie/${movieId}?date=${date}`),
  upcoming:       (movieId:number) => api.get<ApiResponse<Show[]>>(`/shows/movie/${movieId}/upcoming`),
  dates:          (movieId:number) => api.get<ApiResponse<string[]>>(`/shows/movie/${movieId}/dates`),
  getById:        (id:number) => api.get<ApiResponse<Show>>(`/shows/${id}`),
  create:         (d:object) => api.post<ApiResponse<Show>>('/shows', d),
  remove:         (id:number) => api.delete<ApiResponse<void>>(`/shows/${id}`),
};

// ── Seats ─────────────────────────────────────────────
export const seatApi = {
  byShow:    (showId:number) => api.get<ApiResponse<Seat[]>>(`/seats/show/${showId}`),
  lockSeats: (showId:number, seatIds:number[]) => api.post<ApiResponse<{lockedSeats:Seat[];lockExpiresAt:string;message:string}>>(`/seats/show/${showId}/lock`, { seatIds }),
};

// ── Bookings ──────────────────────────────────────────
export const bookingApi = {
  initiate:      (d:{showId:number;seatIds:number[]}) => api.post<ApiResponse<RazorpayOrderResponse>>('/bookings/initiate', d),
  verifyPayment: (d:object) => api.post<ApiResponse<Booking>>('/bookings/verify-payment', d),
  myBookings:    () => api.get<ApiResponse<Booking[]>>('/bookings/my'),
  getById:       (id:number) => api.get<ApiResponse<Booking>>(`/bookings/${id}`),
  cancel:        (id:number) => api.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`),
};
