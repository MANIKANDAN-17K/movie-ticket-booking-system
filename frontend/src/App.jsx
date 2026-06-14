import { Routes, Route, Navigate } from 'react-router-dom'
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

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageMovies   from './pages/admin/ManageMovies'
import ViewBookings   from './pages/admin/ViewBookings'

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/"           element={<HomePage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />
            <Route path="/movies/:id" element={<MovieDetailsPage />} />

            {/* Authenticated user */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />

            {/* Admin-only */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/movies"
              element={
                <ProtectedRoute adminOnly>
                  <ManageMovies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute adminOnly>
                  <ViewBookings />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  )
}