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

### ✅ Dashboard
- Statistik real-time (total ruangan, booking pending, booking approved)
- Quick actions untuk create booking dan ruangan
- List booking terbaru

### ✅ Manajemen Ruangan
- CRUD lengkap (Create, Read, Update, Delete)
- Search ruangan
- Filter by status (Tersedia/Tidak Tersedia)
- Modal form untuk tambah/edit ruangan
- Card layout responsive

### ✅ Manajemen Peminjaman
- CRUD lengkap untuk booking
- **Approval workflow** (Pending → Approved/Rejected)
- Search booking
- Filter by status (Pending/Approved/Rejected)
- Alasan penolakan untuk rejected bookings
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
│   ├── Navbar.tsx     # Navigation bar
│   └── Loading.tsx    # Loading spinner
├── pages/             # Page components
│   ├── Dashboard.tsx  # Dashboard page
│   ├── Rooms.tsx      # Room management page
│   └── Bookings.tsx   # Booking management page
├── services/          # API services
│   └── api.ts         # Axios instance & API calls
├── types/             # TypeScript types
│   └── index.ts       # Type definitions
├── utils/             # Utility functions
│   └── formatters.ts  # Date & status formatters
├── App.tsx            # Main app component with routes
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

**Endpoints yang digunakan:**

### Rooms API
- `GET /api/Room` - Get all rooms
- `GET /api/Room/{id}` - Get room by ID
- `POST /api/Room` - Create room
- `PUT /api/Room/{id}` - Update room
- `DELETE /api/Room/{id}` - Delete room

### Bookings API
- `GET /api/Booking` - Get all bookings
- `GET /api/Booking/{id}` - Get booking by ID
- `POST /api/Booking` - Create booking
- `PUT /api/Booking/{id}/status` - Update booking status (approve/reject)
- `DELETE /api/Booking/{id}` - Delete booking
- `GET /api/Booking/history` - Get booking history

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
