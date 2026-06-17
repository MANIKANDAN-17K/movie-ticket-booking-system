import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookingAPI } from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const STATUS_COLORS = {
  CONFIRMED: 'text-green-400 bg-green-400/10 border-green-400/20',
  CANCELLED:  'text-red-400 bg-red-400/10 border-red-400/20',
  PENDING:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)

  const fetchBookings = () => {
    bookingAPI.getMyBookings()
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Could not load bookings.'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchBookings, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await bookingAPI.cancel(id)
      toast.success('Booking cancelled.')
      setBookings((b) => b.filter((x) => x.id !== id))
    } catch {
      toast.error('Could not cancel booking.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-cinema-light">My Bookings</h1>
          <p className="text-cinema-muted text-sm mt-1">{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/" className="btn-ghost text-sm">Browse Movies</Link>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-cinema-card border border-cinema-border rounded-2xl">
          <p className="text-5xl mb-4">🎟</p>
          <p className="text-cinema-muted mb-4">No bookings yet.</p>
          <Link to="/" className="btn-primary">Book Your First Ticket</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="bg-cinema-card border border-cinema-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 sm:items-center"
            >
              {/* Movie info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cinema-deep flex items-center justify-center text-xl flex-shrink-0">
                    🎬
                  </div>
                  <div>
                    <h3 className="text-cinema-light font-semibold truncate">{booking.movieTitle || 'Movie'}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-cinema-muted">
                      {booking.showDate && <span>📅 {new Date(booking.showDate).toLocaleDateString()}</span>}
                      {booking.showTime && <span>🕐 {booking.showTime}</span>}
                      <span>🎟 {booking.numberOfSeats} seat{booking.numberOfSeats > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount + status */}
              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                {booking.totalAmount != null && (
                  <span className="text-cinema-gold font-bold">₹{booking.totalAmount}</span>
                )}
                {booking.status && (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_COLORS[booking.status] || 'text-cinema-muted border-cinema-border'}`}>
                    {booking.status}
                  </span>
                )}
              </div>

              {/* Cancel button */}
              {booking.status !== 'CANCELLED' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="sm:ml-2 text-cinema-muted hover:text-cinema-red transition-colors text-sm whitespace-nowrap"
                >
                  Cancel
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}