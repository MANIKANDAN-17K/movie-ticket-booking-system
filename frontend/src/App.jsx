import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar  from './components/Navbar'
import Footer  from './components/Footer'

// Public pages
import HomePage         from './pages/public/HomePage'
import LoginPage        from './pages/public/LoginPage'
import RegisterPage     from './pages/public/RegisterPage'
import MovieDetailsPage from './pages/public/MovieDetailsPage'
import MyBookingsPage   from './pages/public/MyBookingsPage'

// Admin layout + pages
import AdminLayout    from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageMovies   from './pages/admin/ManageMovies'
import ViewBookings   from './pages/admin/ViewBookings'

export default function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>

        {/* ── Public routes (with Navbar + Footer) ──────────────── */}
        <Route element={<PublicShell />}>
          <Route path="/"           element={<HomePage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/register"   element={<RegisterPage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ── Admin routes (sidebar layout, no public Navbar) ───── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index             element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard"  element={<AdminDashboard />} />
          <Route path="movies"     element={<ManageMovies />} />
          <Route path="bookings"   element={<ViewBookings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  )
}

// Shell layout for public pages
import { Outlet } from 'react-router-dom'
function PublicShell() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}