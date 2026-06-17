import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard'      },
  { to: '/admin/movies',    icon: '🎬', label: 'Manage Movies'  },
  { to: '/admin/bookings',  icon: '🎟', label: 'All Bookings'   },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-cinema-gold text-cinema-black'
        : 'text-cinema-muted hover:bg-cinema-card hover:text-cinema-light'
    }`

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-cinema-border ${collapsed ? 'justify-center' : ''}`}>
        <span className="text-2xl flex-shrink-0">🎬</span>
        {!collapsed && (
          <div>
            <span className="font-display text-lg tracking-widest text-gradient-gold">CINEBOOK</span>
            <p className="text-[10px] text-cinema-muted uppercase tracking-widest -mt-0.5">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={linkClass}
            onClick={() => setMobileOpen(false)}
            title={collapsed ? label : undefined}
          >
            <span className="text-lg flex-shrink-0">{icon}</span>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: user + logout */}
      <div className="p-3 border-t border-cinema-border space-y-1">
        {!collapsed && (
          <div className="px-4 py-2 rounded-xl bg-cinema-card border border-cinema-border mb-2">
            <p className="text-[10px] text-cinema-muted uppercase tracking-widest">Signed in as</p>
            <p className="text-cinema-light text-sm font-semibold truncate">{user?.username}</p>
            <p className="text-cinema-gold text-[10px] uppercase tracking-widest">{user?.role}</p>
          </div>
        )}
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cinema-muted hover:bg-cinema-card hover:text-cinema-light transition-all duration-150"
          title={collapsed ? 'View Site' : undefined}
        >
          <span className="text-base flex-shrink-0">🌐</span>
          {!collapsed && <span>View Site</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-cinema-muted hover:bg-red-900/20 hover:text-red-400 transition-all duration-150"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <span className="text-base flex-shrink-0">🚪</span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-cinema-black">

      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 bg-cinema-deep border-r border-cinema-border transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute left-0 top-20 translate-x-full z-10 hidden md:flex items-center justify-center w-5 h-10 bg-cinema-border rounded-r-lg text-cinema-muted hover:text-cinema-gold transition-colors"
          style={{ marginLeft: collapsed ? '4rem' : '15rem', transition: 'margin 0.3s' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      {/* ── Mobile Sidebar overlay ──────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-cinema-deep border-r border-cinema-border z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── Main content area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar (mobile) */}
        <header className="md:hidden sticky top-0 z-30 flex items-center gap-4 px-4 h-14 bg-cinema-deep/90 backdrop-blur-md border-b border-cinema-border">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-cinema-muted hover:text-cinema-light transition-colors"
            aria-label="Open menu"
          >
            ☰
          </button>
          <span className="font-display text-lg tracking-widest text-gradient-gold">CINEBOOK</span>
          <span className="ml-auto text-xs text-cinema-muted bg-cinema-card px-2 py-1 rounded-md border border-cinema-border uppercase tracking-wider">Admin</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}