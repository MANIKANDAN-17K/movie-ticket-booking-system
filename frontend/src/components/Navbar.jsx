import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-cinema-gold font-medium'
      : 'text-cinema-muted hover:text-cinema-light transition-colors duration-150'

  return (
    <header className="sticky top-0 z-50 bg-cinema-deep/90 backdrop-blur-md border-b border-cinema-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🎬</span>
          <span className="font-display text-2xl tracking-widest text-gradient-gold">
            CINEBOOK
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          {isAuthenticated && (
            <NavLink to="/my-bookings" className={navLinkClass}>My Bookings</NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              <span className="text-cinema-gold">⚙ Admin</span>
            </NavLink>
          )}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-cinema-muted text-sm">
                Hi, <span className="text-cinema-light font-medium">{user?.username}</span>
              </span>
              <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-4">
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost text-sm py-2 px-4">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-cinema-muted hover:text-cinema-light transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-cinema-border bg-cinema-deep px-4 py-4 flex flex-col gap-4">
          <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          {isAuthenticated && (
            <NavLink to="/my-bookings" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              My Bookings
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              ⚙ Admin Dashboard
            </NavLink>
          )}
          <div className="pt-2 border-t border-cinema-border flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-cinema-muted text-sm">Signed in as <strong className="text-cinema-light">{user?.username}</strong></span>
                <button onClick={handleLogout} className="btn-ghost text-sm text-left">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost text-sm text-center" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}