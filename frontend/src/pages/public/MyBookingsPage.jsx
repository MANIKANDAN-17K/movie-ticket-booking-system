import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookingAPI } from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const STATUS = {
  CONFIRMED: { label: 'Confirmed', cls: 'badge-green' },
  CANCELLED: { label: 'Cancelled', cls: 'badge-red'   },
  PENDING:   { label: 'Pending',   cls: 'badge-yellow' },
}

function BookingCard({ booking, onCancel }) {
  const s = STATUS[booking.status] || { label: booking.status, cls: 'badge-muted' }

  return (
    <article className="glow-card p-5 animate-fadein">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-cinema-gold/10 border border-cinema-gold/20 flex items-center justify-center text-xl flex-shrink-0">
          🎬
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-cinema-light font-semibold text-base leading-tight truncate">{booking.movieTitle || 'Movie'}</h3>
            <span className={`${s.cls} flex-shrink-0`}>{s.label}</span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-cinema-muted mb-3">
            {booking.showDate && (
              <span className="flex items-center gap-1.5">
                📅 {new Date(booking.showDate).toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric' })}
              </span>
            )}
            {booking.showTime && <span className="flex items-center gap-1.5">🕐 {booking.showTime}</span>}
            <span className="flex items-center gap-1.5">🪑 {booking.numberOfSeats} seat{booking.numberOfSeats !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex items-center justify-between">
            {booking.totalAmount != null && (
              <span className="text-cinema-gold font-bold text-lg">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
            )}
            {booking.status !== 'CANCELLED' && (
              <button onClick={() => onCancel(booking.id)}
                className="text-xs text-cinema-muted hover:text-red-400 transition-colors border border-cinema-border hover:border-red-500/50 rounded-lg px-3 py-1.5">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ticket stub decorative bottom */}
      <div className="mt-4 pt-3 border-t border-dashed border-cinema-border/50 flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: booking.numberOfSeats || 0 }, (_, i) => (
            <div key={i} className="w-5 h-5 bg-cinema-gold/20 border border-cinema-gold/30 rounded text-cinema-gold text-[9px] flex items-center justify-center">🎟</div>
          ))}
        </div>
        <span className="text-cinema-muted/50 text-[10px] font-mono">ID #{booking.id}</span>
      </div>
    </article>
  )
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('ALL')

  useEffect(() => {
    bookingAPI.getMyBookings()
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Could not load bookings.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await bookingAPI.cancel(id)
      toast.success('Booking cancelled.')
      setBookings(b => b.map(x => x.id === id ? { ...x, status: 'CANCELLED' } : x))
    } catch {
      toast.error('Could not cancel booking.')
    }
  }

  const filtered = bookings.filter(b => filter === 'ALL' || b.status === filter)
  const totalSpent = bookings.filter(b => b.status !== 'CANCELLED').reduce((s, b) => s + (b.totalAmount || 0), 0)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-2">Your Account</p>
          <h1 className="page-title">My Bookings</h1>
          {!loading && bookings.length > 0 && (
            <p className="text-cinema-muted text-sm mt-1">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} ·{' '}
              <span className="text-cinema-gold font-medium">₹{totalSpent.toLocaleString('en-IN')} spent</span>
            </p>
          )}
        </div>
        <Link to="/" className="btn-ghost text-sm self-start sm:self-auto">Browse Movies</Link>
      </div>

      {/* Filter tabs */}
      {!loading && bookings.length > 0 && (
        <div className="flex gap-2 mb-6">
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                filter === s
                  ? 'bg-cinema-gold border-cinema-gold text-cinema-black'
                  : 'border-cinema-border text-cinema-muted hover:border-cinema-gold/40 hover:text-cinema-subtle'
              }`}>
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="text-center py-20 glow-card">
          <p className="text-5xl mb-4 animate-float">🎟</p>
          <p className="text-cinema-light font-semibold mb-2">No bookings yet</p>
          <p className="text-cinema-muted text-sm mb-6">Pick a movie and book your first ticket</p>
          <Link to="/" className="btn-primary shine">Browse Movies</Link>
        </div>
      )}

      {!loading && filtered.length === 0 && bookings.length > 0 && (
        <div className="text-center py-12 text-cinema-muted">No {filter.toLowerCase()} bookings.</div>
      )}

      <div className="space-y-4">
        {filtered.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />)}
      </div>
    </div>
  )
}