# 🎬 CineBook — Frontend

> **React + Vite** frontend for the CineBook Movie Ticket Booking System.  
> A dark-themed, cinematic UI for browsing movies, selecting seats, and booking tickets online.

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| 🌍 **Live App** | `https://your-frontend-url.vercel.app` |
| 🔧 **Backend Repo** | [cinebook-backend](https://github.com/NaveenParamasivam/cinebook-backend) |
| 🌐 **Backend API** | `https://your-backend-url.onrender.com/api` |

---

## 🎥 Walkthrough

### Full App Demo


![App Walkthrough](screenshots/walkthrough.gif)

---

## 📸 Page Screenshots

### 🏠 Home Page — Browse Movies
> _Browse all movies, filter by genre, search by title_

![Home Page](screenshots/home.png)

---

### 🎬 Movie Detail Page — Showtimes & Date Picker
> _View movie info, pick a date, select a showtime_

![Movie Detail](screenshots/movie-detail.gif)

---

### 💺 Seat Selection — Interactive Seat Map
> _Real-time seat availability, 10-minute lock on selection, live pricing_

![Seat Selection](screenshots/seat-selection.gif)

---

### 💳 Payment — Razorpay Checkout
> _Secure payment via Razorpay popup_

![Payment](screenshots/payment.gif)

---

### 🎟️ Booking Confirmation — Ticket View
> _Confirmed ticket with booking reference, perforated ticket design_

![Booking Ticket](screenshots/booking-ticket.png)

---

### 📋 Booking History — My Tickets
> _All past bookings with status badges (Confirmed / Cancelled / Pending)_

![Booking History](screenshots/booking-history.png)

---

### 👤 Profile Page
> _Edit profile, change password_

![Profile](screenshots/profile.png)

---

### 🔐 Login / Register Pages

![Login](screenshots/login.png)

---

### 🛡️ Admin Dashboard
> _Stats overview — total movies, theaters, active shows, cities_

![Admin Dashboard](screenshots/admin-dashboard.png)

---

### 🎞️ Admin — Movies Management (CRUD)
> _Add, edit, delete movies with poster preview_

![Admin Movies](screenshots/admin-movies.png)

---

### 🏟️ Admin — Theaters Management (CRUD)
> _Add theaters with row × seat layout, auto-calculates total seats_

![Admin Theaters](screenshots/admin-theaters.png)

---

### 📅 Admin — Shows Management
> _Create showtimes, seats auto-generated from theater layout_

![Admin Shows](screenshots/admin-shows.png)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| State Management | Zustand (with persist) |
| Data Fetching | TanStack Query v5 |
| HTTP Client | Axios |
| Routing | React Router v6 |
| Notifications | React Hot Toast |
| Icons | Lucide React |
| Fonts | Syne (display) + DM Sans (body) |
| Payment | Razorpay Web SDK |
| Deployment | Vercel / Netlify |

---

## 📁 Project Structure

```
cinebook-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── MovieCard.tsx        # Movie poster card with hover effects
│   │   │   └── LoadingStates.tsx    # Skeleton, Spinner, EmptyState
│   │   └── layout/
│   │       ├── Layout.tsx           # Public layout (Navbar + Footer)
│   │       ├── AdminLayout.tsx      # Admin layout with sidebar
│   │       ├── Navbar.tsx           # Sticky navbar with user dropdown
│   │       └── Footer.tsx
│   ├── pages/
│   │   ├── HomePage.tsx             # Browse + genre filter + search
│   │   ├── MovieDetailPage.tsx      # Movie info + date picker + showtimes
│   │   ├── SeatSelectionPage.tsx    # Interactive seat map + Razorpay
│   │   ├── BookingDetailPage.tsx    # Ticket view + cancel
│   │   ├── BookingHistoryPage.tsx   # All user bookings
│   │   ├── BookingConfirmPage.tsx   # Post-payment redirect
│   │   ├── ProfilePage.tsx          # Edit profile + change password
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── AdminRegisterPage.tsx  # Secret-key protected
│   │   └── admin/
│   │       ├── AdminDashboardPage.tsx
│   │       ├── AdminMoviesPage.tsx
│   │       ├── AdminTheatersPage.tsx
│   │       └── AdminShowsPage.tsx
│   ├── services/
│   │   ├── api.ts                   # Axios instance + JWT interceptor
│   │   └── index.ts                 # All API service functions
│   ├── store/
│   │   └── authStore.ts             # Zustand auth store (persisted)
│   ├── types/
│   │   └── index.ts                 # All TypeScript interfaces
│   ├── utils/
│   │   └── index.ts                 # cn(), formatDate(), formatCurrency() etc.
│   ├── App.tsx                      # Routes + guards
│   ├── main.tsx
│   └── index.css                    # Tailwind + custom design tokens
├── .env.example
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## ✨ Features

### User Features
- 🎬 **Browse Movies** — Grid view with genre filter pills and live search
- 📅 **Date Picker** — Horizontal scrollable date selector for available show dates
- 🪑 **Seat Selection** — Row-by-row interactive seat map with color-coded status
- 🔒 **Real-time Seat Locking** — Seats locked for 10 minutes on selection; auto-released if payment not completed
- 💳 **Razorpay Payment** — Secure checkout popup with prefilled user details
- 🎟️ **E-Ticket** — Perforated ticket design with booking reference
- 📋 **Booking History** — All bookings with status (Confirmed / Cancelled / Pending)
- ❌ **Cancel Booking** — Cancel with one click; email notification sent
- 👤 **Profile Management** — Edit name, phone; change password

### Admin Features
- 📊 **Dashboard** — Platform stats at a glance
- 🎞️ **Movies CRUD** — Add/edit/delete with poster URL preview
- 🏟️ **Theaters CRUD** — Define rows × seats per row; total seats auto-calculated
- 📅 **Shows Management** — Assign movie + theater + date/time + price; seats auto-generated

### Design
- 🌑 **Dark theme** — Deep dark background (`#0a0a0f`) with orange accent (`#f97316`)
- ✨ **Framer Motion** — Page transitions, card hover lift, modal animations
- 💀 **Skeleton loaders** — Shimmer placeholders while data loads
- 📱 **Fully responsive** — Mobile-first, works on all screen sizes

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend running at `http://localhost:8080`

### 1. Clone the repository
```bash
git clone https://github.com/NaveenParamasivam/cinebook-frontend.git
cd cinebook-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

### 4. Start dev server
```bash
npm run dev
```

App will be available at `http://localhost:5173`

---

## 🔐 How to Access Admin Panel

### Option 1 — Auto-created admin (easiest)
The backend auto-creates an admin account on first startup:
```
Email:    admin@cinebook.com
Password: Admin@123
```
Log in at `/auth/login` and you'll be redirected to `/admin` automatically.

### Option 2 — Admin Registration Page
Navigate to `/auth/register-admin` (or click **"Admin registration"** at the bottom of the login page).  
Enter your details + the `ADMIN_REGISTRATION_SECRET` from the backend `.env`.

---

## 🧭 App Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home — browse movies |
| `/movies/:id` | Public | Movie detail + showtimes |
| `/shows/:showId/seats` | 🔑 User | Seat selection + payment |
| `/bookings` | 🔑 User | Booking history |
| `/bookings/:id` | 🔑 User | Booking detail / ticket |
| `/profile` | 🔑 User | Edit profile |
| `/auth/login` | Guest | Login |
| `/auth/register` | Guest | Register |
| `/auth/register-admin` | Guest | Admin registration (secret key) |
| `/admin` | 🛡️ Admin | Dashboard |
| `/admin/movies` | 🛡️ Admin | Movies CRUD |
| `/admin/theaters` | 🛡️ Admin | Theaters CRUD |
| `/admin/shows` | 🛡️ Admin | Shows management |

---

## 👨‍💻 Author

**Naveen Paramasivam**  
GitHub: [@NaveenParamasivam](https://github.com/NaveenParamasivam)

---
