import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { movieAPI, bookingAPI } from '../../services/api'
import Spinner from '../../components/Spinner'

function StatCard({ icon, label, value, sub, to, color = 'gold' }) {
  const colors = {
    gold:  'border-cinema-gold/30 hover:border-cinema-gold hover:shadow-gold',
    green: 'border-green-500/30 hover:border-green-500',
    blue:  'border-blue-500/30 hover:border-blue-500',
  }
  return (
    <Link
      to={to}
      className={`bg-cinema-card border rounded-2xl p-6 transition-all duration-200 group block ${colors[color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-xs text-cinema-muted bg-cinema-deep px-2 py-1 rounded-lg border border-cinema-border group-hover:text-cinema-gold transition-colors">
          View →
        </span>
      </div>
      <p className="text-cinema-muted text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className="text-cinema-light text-3xl font-bold group-hover:text-cinema-gold transition-colors">{value}</p>
      {sub && <p className="text-cinema-muted text-xs mt-1">{sub}</p>}
    </Link>
  )
}

function RecentBookingRow({ booking }) {
  const STATUS = {
    CONFIRMED: 'text-green-400 bg-green-400/10 border-green-400/20',
    CANCELLED: 'text-red-400 bg-red-400/10 border-red-400/20',
    PENDING:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  }
  return (
    <tr className="border-b border-cinema-border hover:bg-cinema-deep/40 transition-colors">
      <td className="px-4 py-3 text-cinema-muted text-xs font-mono">#{booking.id}</td>
      <td className="px-4 py-3 text-cinema-light text-sm">{booking.username || '—'}</td>
      <td className="px-4 py-3 text-cinema-light text-sm max-w-[140px] truncate">{booking.movieTitle || '—'}</td>
      <td className="px-4 py-3 text-cinema-gold text-sm font-semibold">
        {booking.totalAmount != null ? `₹${booking.totalAmount}` : '—'}
      </td>
      <td className="px-4 py-3">
        {booking.status && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS[booking.status] || 'text-cinema-muted border-cinema-border'}`}>
            {booking.status}
          </span>
        )}
      </td>
    </tr>
  )
}

export default function AdminDashboard() {
  const [stats,    setStats]    = useState({ movies: 0, bookings: 0, revenue: 0, confirmed: 0 })
  const [recent,   setRecent]   = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([movieAPI.getAll(), bookingAPI.getAll()])
      .then(([mRes, bRes]) => {
        const movies   = mRes.data
        const bookings = bRes.data
        const revenue  = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0)
        const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length
        setStats({ movies: movies.length, bookings: bookings.length, revenue, confirmed })
        setRecent(bookings.slice(0, 6))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-cinema-muted text-xs uppercase tracking-widest mb-1">Overview</p>
        <h1 className="text-3xl font-semibold text-cinema-light">Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon="🎬" label="Total Movies"    value={stats.movies}   to="/admin/movies"   color="gold"  />
        <StatCard icon="🎟" label="Total Bookings"  value={stats.bookings} to="/admin/bookings" color="blue"  />
        <StatCard
          icon="✅"
          label="Confirmed"
          value={stats.confirmed}
          sub={`${stats.bookings ? Math.round((stats.confirmed / stats.bookings) * 100) : 0}% of total`}
          to="/admin/bookings"
          color="green"
        />
        <StatCard
          icon="💰"
          label="Revenue"
          value={`₹${stats.revenue.toLocaleString('en-IN')}`}
          to="/admin/bookings"
          color="gold"
        />
      </div>

      {/* Recent bookings table */}
      <div className="bg-cinema-card border border-cinema-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cinema-border">
          <h2 className="text-cinema-light font-semibold">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-cinema-gold text-sm hover:underline">
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-12 text-cinema-muted">No bookings yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cinema-border">
                  {['ID', 'User', 'Movie', 'Amount', 'Status'].map((h) => (
                    <th key={h} className="text-left text-cinema-muted text-xs uppercase tracking-wider px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => <RecentBookingRow key={b.id} booking={b} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}