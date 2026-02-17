# Borrowdung Frontend

Frontend application untuk Sistem Peminjaman Ruangan Kampus menggunakan **React + TypeScript + Tailwind CSS**.

## Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router DOM** - Routing

## Features

### ✅ Authentication & Authorization
- JWT-based login system
- Protected routes (redirect to login if not authenticated)
- Role-based UI (Admin vs User permissions)
- Auto token refresh via Axios interceptors
- Logout functionality

### ✅ Dashboard
- Statistik real-time (total ruangan, booking pending, booking approved)
- Role-based Quick Actions (Admin dapat tambah ruangan, User hanya booking)
- List booking terbaru

### ✅ Manajemen Ruangan
- CRUD lengkap (Create, Read, Update, Delete) - Admin only untuk Create/Update/Delete
- Search ruangan
- Filter by status (Tersedia/Tidak Tersedia)
- **Time-based availability** - Filter ruangan berdasarkan waktu yang available
- Modal form untuk tambah/edit ruangan (Admin only)
- Card layout responsive

### ✅ Manajemen Peminjaman
- CRUD lengkap untuk booking
- **Two-step booking process** - Pilih waktu dulu, baru pilih dari ruangan yang tersedia
- **Approval workflow** (Pending → Approved/Rejected) - Admin only
- Search booking
- Filter by status (Pending/Approved/Rejected)
- Alasan penolakan untuk rejected bookings (Admin only)
- Real-time available room count
- Conflict detection via backend API
- Datetime picker untuk waktu booking

## Prerequisites

- Node.js >= 18.8.0
- npm atau yarn
- Backend API running di http://localhost:5240

## Installation

1. **Clone repository**
   ```bash
   cd 2026-borrowdung-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**

   File `.env` sudah ada dengan konfigurasi default:
   ```env
   VITE_API_BASE_URL=http://localhost:5240/api
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Application akan berjalan di: http://localhost:5173

## Build for Production

```bash
npm run build
```

Output ada di folder `dist/`

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── Layout.tsx     # Layout wrapper dengan Navbar
│   ├── Navbar.tsx     # Navigation bar (with role-based display)
│   ├── ProtectedRoute.tsx  # Route guard untuk authentication
│   └── Loading.tsx    # Loading spinner
├── contexts/          # React contexts
│   └── AuthContext.tsx  # Auth state management (login, logout, user info)
├── pages/             # Page components
│   ├── Login.tsx      # Login page
│   ├── Dashboard.tsx  # Dashboard page (role-based quick actions)
│   ├── Rooms.tsx      # Room management page (admin CRUD controls)
│   └── Bookings.tsx   # Booking management page (time-based availability)
├── services/          # API services
│   └── api.ts         # Axios instance with JWT interceptor & API calls
├── types/             # TypeScript types
│   └── index.ts       # Type definitions (User, Room, Booking, etc.)
├── utils/             # Utility functions
│   └── formatters.ts  # Date & status formatters
├── App.tsx            # Main app component with protected routes
├── main.tsx           # Entry point
└── index.css          # Tailwind CSS imports
```

## Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

Frontend berkomunikasi dengan backend melalui Axios. Base URL dikonfigurasi via environment variable `VITE_API_BASE_URL`.

**JWT Token Management:**
- Token disimpan di localStorage setelah login
- Axios interceptor otomatis menambahkan `Authorization: Bearer <token>` header ke setiap request
- Token dihapus saat logout

**Endpoints yang digunakan:**

### Auth API
- `POST /api/Auth/login` - User login (returns JWT token)

### Rooms API
- `GET /api/Rooms` - Get all rooms
- `GET /api/Rooms?startTime=<datetime>&endTime=<datetime>` - Get available rooms for time period
- `GET /api/Rooms/{id}` - Get room by ID
- `POST /api/Rooms` - Create room (Admin only)
- `PUT /api/Rooms/{id}` - Update room (Admin only)
- `DELETE /api/Rooms/{id}` - Delete room (Admin only)

### Bookings API
- `GET /api/Bookings` - Get all bookings
- `GET /api/Bookings/{id}` - Get booking by ID
- `POST /api/Bookings` - Create booking
- `PATCH /api/Bookings/{id}/status` - Update booking status (approve/reject) (Admin only)
- `DELETE /api/Bookings/{id}` - Delete booking (Admin only)
- `GET /api/Bookings/history` - Get booking history

## Features Highlights

### 🎨 Modern UI
- Responsive design (mobile-friendly)
- Tailwind CSS utility classes
- Modal forms untuk input
- Loading states
- Status badges dengan color coding

### 🔄 Real-time Data
- Auto-refresh setelah CRUD operations
- Optimistic UI updates
- Error handling dengan user-friendly messages

### 📱 User Experience
- Search & filter
- Pagination ready (backend support)
- Form validation
- Confirmation dialogs untuk delete
- Success/error alerts

### ⚡ Performance
- Vite untuk fast HMR (Hot Module Replacement)
- TypeScript untuk type safety
- Code splitting dengan React Router
- Lazy loading ready

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | http://localhost:5240/api |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

### Default User Accounts
Setelah backend dijalankan pertama kali, database akan memiliki 2 akun default:
- **Admin**: username `admin`, password `admin123` (full access)
- **User**: username `user`, password `user123` (limited access)

### User Roles
- **Admin**: Dapat mengelola ruangan (CRUD), approve/reject bookings, delete bookings
- **User**: Dapat membuat booking, melihat status booking, tidak bisa mengelola ruangan

### Booking Status
Status booking menggunakan enum:
- `0` - Pending (kuning)
- `1` - Approved (hijau)
- `2` - Rejected (merah)

### Date Format
Menggunakan `Intl.DateTimeFormat` dengan locale `id-ID` untuk format Indonesia.

### Error Handling
Semua API calls wrapped dengan try-catch. Error ditampilkan via `alert()` (bisa diganti dengan toast notification library seperti react-toastify).

## Future Enhancements

- Toast notifications (react-toastify)
- Form validation library (react-hook-form + yup)
- Modal library (react-modal / headlessui)
- Date picker library (react-datepicker)
- Export to PDF/Excel
- Print functionality
- Calendar view untuk bookings
- Dark mode toggle
- User preferences
- Internationalization (i18n)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License

## Credits

Developed by **PENS Students** untuk tugas Project-Based Learning (PdBL) 2026.

---

**Note**: Pastikan backend API sudah running sebelum menjalankan frontend!
