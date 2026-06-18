import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location.pathname])

  const handleLogout = () => { logout(); navigate('/') }

  const linkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-cinema-gold' : 'text-cinema-subtle hover:text-cinema-light'
    }`

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-cinema-deep/95 backdrop-blur-xl border-b border-cinema-border shadow-card'
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-cinema-gold/10 border border-cinema-gold/30 flex items-center justify-center group-hover:bg-cinema-gold/20 transition-colors">
            <span className="text-base">🎬</span>
          </div>
          <span className="font-display text-xl tracking-[0.15em] text-gradient-gold">CINEBOOK</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7 flex-1">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          {isAuthenticated && <NavLink to="/my-bookings" className={linkClass}>My Bookings</NavLink>}
          {isAdmin && (
            <NavLink to="/admin/dashboard" className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-cinema-gold' : 'text-cinema-gold/70 hover:text-cinema-gold'}`
            }>
              ⚙ Admin
            </NavLink>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cinema-card border border-cinema-border">
                <div className="w-6 h-6 rounded-full bg-cinema-gold/20 border border-cinema-gold/40 flex items-center justify-center text-xs font-bold text-cinema-gold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-cinema-light text-sm font-medium">{user?.username}</span>
              </div>
              <button onClick={handleLogout} className="btn-ghost text-sm !py-1.5 !px-4">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost text-sm !py-1.5 !px-4">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm !py-1.5 !px-4 shine">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-cinema-card transition-colors"
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className={`block w-5 h-px bg-cinema-subtle transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-px bg-cinema-subtle transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-px bg-cinema-subtle transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <div className="border-t border-cinema-border bg-cinema-deep/98 backdrop-blur-xl px-4 py-4 space-y-1">
          {[
            { to: '/', label: 'Home', end: true },
            ...(isAuthenticated ? [{ to: '/my-bookings', label: 'My Bookings' }] : []),
            ...(isAdmin ? [{ to: '/admin/dashboard', label: '⚙ Admin Panel' }] : []),
          ].map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) =>
              `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-cinema-gold/10 text-cinema-gold' : 'text-cinema-subtle hover:bg-cinema-card hover:text-cinema-light'
              }`
            }>{label}</NavLink>
          ))}
          <div className="pt-3 mt-3 border-t border-cinema-border flex flex-col gap-2">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn-ghost w-full text-sm">Sign Out</button>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost w-full text-sm text-center">Sign In</Link>
                <Link to="/register" className="btn-primary w-full text-sm text-center">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}