# Changelog

All notable changes to the Borrowdung Frontend project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-02-17

### Added

#### Core Application
- Initial project setup with Vite + React 18 + TypeScript
- Tailwind CSS configuration for styling
- React Router DOM for client-side routing
- Axios for HTTP client communication with backend API

#### Components
- **Layout Component** - Main layout wrapper with navigation
- **Navbar Component** - Top navigation bar with links
- **Loading Component** - Reusable loading spinner

#### Pages
- **Dashboard Page**:
  - Real-time statistics (total rooms, pending bookings, approved bookings)
  - Quick action buttons for creating bookings and rooms
  - Latest bookings list display

- **Rooms Page**:
  - Full CRUD operations for room management
  - Search functionality for finding rooms
  - Filter by room status (Tersedia/Tidak Tersedia)
  - Modal form for create/edit operations
  - Responsive card layout
  - Delete confirmation

- **Bookings Page**:
  - Full CRUD operations for booking management
  - Approval workflow (Pending → Approved/Rejected)
  - Search functionality
  - Filter by booking status (Pending/Approved/Rejected)
  - Rejection reason input for rejected bookings
  - Datetime picker for booking time selection
  - Conflict detection via backend API integration

#### Services
- **API Service** (`api.ts`):
  - Axios instance with base URL configuration
  - Complete API methods for Rooms and Bookings
  - Error handling and response interception

#### Types & Utils
- TypeScript type definitions for:
  - Room entity
  - Booking entity
  - BookingStatus enum
  - Create/Update DTOs
- Utility functions for:
  - Date formatting (Indonesian locale)
  - Status formatting with color coding
  - Status badge rendering

#### Features
- **Real-time Data Updates**:
  - Auto-refresh after CRUD operations
  - Optimistic UI updates

- **User Experience**:
  - Search and filter functionality
  - Form validation
  - Confirmation dialogs for delete operations
  - Success/error alert messages
  - Loading states during API calls

- **Responsive Design**:
  - Mobile-friendly layout
  - Tailwind CSS utility classes
  - Grid and flex layouts

- **Performance**:
  - Fast Hot Module Replacement (HMR) with Vite
  - Type-safe development with TypeScript
  - Code splitting ready with React Router
  - Lazy loading capability

#### Configuration
- Environment variables via `.env.example`:
  - `VITE_API_BASE_URL` - Backend API endpoint
- ESLint configuration for code quality
- TypeScript strict mode enabled
- Tailwind CSS with PostCSS

#### Documentation
- Comprehensive README.md with:
  - Tech stack overview
  - Features list
  - Installation guide
  - Project structure
  - API integration details
  - Development scripts
  - Browser support
  - Future enhancements roadmap
- .gitignore for Node.js, build artifacts, and environment files
- .env.example for environment configuration template

### Changed
- N/A (Initial release)

### Deprecated
- N/A (Initial release)

### Removed
- N/A (Initial release)

### Fixed
- N/A (Initial release)

### Security
- Environment variables properly excluded from version control
- .env file removed from tracking
- .env.example provided as template
- API base URL configurable via environment
- Input validation on all forms
- XSS protection via React's built-in escaping

---

## Version History

- **v1.0.0** (2026-02-17) - Initial release with Room Booking Management System

---

## Semantic Versioning Guide

Given a version number MAJOR.MINOR.PATCH, increment the:

1. **MAJOR** version when you make incompatible API changes
2. **MINOR** version when you add functionality in a backward compatible manner
3. **PATCH** version when you make backward compatible bug fixes

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

---

## Migration Notes

This is the initial release. No migration required.

---

## Features Roadmap

Future enhancements may include:
- Toast notifications (react-toastify)
- Form validation library (react-hook-form + yup/zod)
- Modal library (headlessui/radix-ui)
- Date picker library (react-datepicker)
- Export to PDF/Excel functionality
- Print functionality
- Calendar view for bookings
- Dark mode toggle
- User authentication and authorization
- User profile management
- Email notifications
- Internationalization (i18n)
- Progressive Web App (PWA) support
- Unit and integration testing
- E2E testing with Cypress/Playwright

[Unreleased]: https://github.com/diwanparker/2026-borrowdung-frontend/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/diwanparker/2026-borrowdung-frontend/releases/tag/v1.0.0
