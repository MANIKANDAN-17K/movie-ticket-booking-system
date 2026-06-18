import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard'     },
  { to: '/admin/movies',    icon: '🎬', label: 'Movies'        },
  { to: '/admin/bookings',  icon: '🎟', label: 'Bookings'      },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
      isActive
        ? 'bg-cinema-gold text-cinema-black shadow-gold-sm'
        : 'text-cinema-muted hover:bg-white/5 hover:text-cinema-light'
    }`

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-sidebar-glow">
      {/* Logo */}
      <div className={`flex items-center gap-3 h-16 px-4 border-b border-cinema-border/60 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-cinema-gold/15 border border-cinema-gold/30 flex items-center justify-center flex-shrink-0">
          <span className="text-base">🎬</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-base tracking-[0.15em] text-gradient-gold leading-none">CINEBOOK</p>
            <p className="text-[9px] text-cinema-muted uppercase tracking-[0.2em] mt-0.5">Admin</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={linkCls} onClick={() => setMobileOpen(false)} title={collapsed ? label : undefined}>
            <span className="text-lg flex-shrink-0 leading-none">{icon}</span>
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User + actions */}
      <div className="p-3 border-t border-cinema-border/60 space-y-1 flex-shrink-0">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1 bg-cinema-card/60 rounded-xl border border-cinema-border/50">
            <div className="w-8 h-8 rounded-full bg-cinema-gold/20 border border-cinema-gold/40 flex items-center justify-center text-sm font-bold text-cinema-gold flex-shrink-0">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-cinema-light text-xs font-medium truncate">{user.username}</p>
              <p className="text-cinema-gold text-[10px] uppercase tracking-wider">Admin</p>
            </div>
          </div>
        )}
        <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-cinema-muted hover:bg-white/5 hover:text-cinema-light transition-all" title={collapsed ? 'View Site' : undefined}>
          <span className="text-base flex-shrink-0">🌐</span>
          {!collapsed && <span>View Site</span>}
        </NavLink>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-cinema-muted hover:bg-red-500/10 hover:text-red-400 transition-all" title={collapsed ? 'Sign Out' : undefined}>
          <span className="text-base flex-shrink-0">🚪</span>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-cinema-black overflow-hidden">

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 border-r border-cinema-border/60 bg-cinema-deep transition-all duration-300 relative ${collapsed ? 'w-[64px]' : 'w-56'}`}>
        <Sidebar />
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3 top-20 w-6 h-6 bg-cinema-elevated border border-cinema-border rounded-full flex items-center justify-center text-cinema-muted hover:text-cinema-gold hover:border-cinema-gold transition-all text-xs shadow-card"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 h-full w-56 bg-cinema-deep border-r border-cinema-border z-50" onClick={e => e.stopPropagation()}>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 h-14 px-4 bg-cinema-deep/95 border-b border-cinema-border/60 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-cinema-card text-cinema-muted hover:text-cinema-light transition-colors">
            ☰
          </button>
          <span className="font-display text-lg tracking-[0.15em] text-gradient-gold">CINEBOOK</span>
          <span className="ml-auto badge-gold text-[10px]">ADMIN</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}