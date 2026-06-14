import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookingAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function BookTicketModal({ movie, onClose }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [seats,    setSeats]    = useState(1)
  const [showDate, setShowDate] = useState('')
  const [showTime, setShowTime] = useState('')
  const [loading,  setLoading]  = useState(false)

  const maxSeats    = 10
  const totalAmount = seats * (movie.ticketPrice || 0)

  const showTimes = ['10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '10:00 PM']

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to book tickets.')
      navigate('/login')
      return
    }
    if (!showDate) { toast.error('Please select a show date.'); return }
    if (!showTime) { toast.error('Please select a show time.'); return }

    setLoading(true)
    try {
      await bookingAPI.create({
        movieId:      movie.id,
        numberOfSeats: seats,
        showDate,
        showTime,
        totalAmount,
      })
      toast.success(`🎟 ${seats} seat${seats > 1 ? 's' : ''} booked for ${movie.title}!`)
      onClose()
      navigate('/my-bookings')
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-cinema-card border border-cinema-border rounded-2xl w-full max-w-md shadow-2xl animate-in">

        {/* Header */}
        <div className="p-6 border-b border-cinema-border flex items-start justify-between">
          <div>
            <p className="text-cinema-muted text-xs uppercase tracking-widest mb-1">Now Booking</p>
            <h2 className="text-cinema-light font-semibold text-lg leading-tight">{movie.title}</h2>
            {movie.genre && (
              <p className="text-cinema-muted text-sm mt-0.5">{movie.genre} · {movie.language}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-cinema-muted hover:text-cinema-light transition-colors text-xl leading-none p-1"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Date picker */}
          <div>
            <label className="block text-cinema-muted text-sm mb-2">Show Date</label>
            <input
              type="date"
              value={showDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setShowDate(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Time picker */}
          <div>
            <label className="block text-cinema-muted text-sm mb-2">Show Time</label>
            <div className="grid grid-cols-3 gap-2">
              {showTimes.map((t) => (
                <button
                  key={t}
                  onClick={() => setShowTime(t)}
                  className={`py-2 text-sm rounded-lg border transition-all duration-150 ${
                    showTime === t
                      ? 'bg-cinema-gold border-cinema-gold text-cinema-black font-semibold'
                      : 'border-cinema-border text-cinema-muted hover:border-cinema-gold hover:text-cinema-gold'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Seat selector */}
          <div>
            <label className="block text-cinema-muted text-sm mb-2">Number of Seats</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSeats((s) => Math.max(1, s - 1))}
                className="w-10 h-10 rounded-lg border border-cinema-border text-cinema-light hover:border-cinema-gold hover:text-cinema-gold transition-colors text-xl leading-none"
                disabled={seats === 1}
              >
                −
              </button>
              <span className="text-cinema-light font-bold text-2xl w-8 text-center">{seats}</span>
              <button
                onClick={() => setSeats((s) => Math.min(maxSeats, s + 1))}
                className="w-10 h-10 rounded-lg border border-cinema-border text-cinema-light hover:border-cinema-gold hover:text-cinema-gold transition-colors text-xl leading-none"
                disabled={seats === maxSeats}
              >
                +
              </button>
              <span className="text-cinema-muted text-sm ml-2">max {maxSeats}</span>
            </div>
          </div>

          {/* Price summary */}
          {movie.ticketPrice != null && (
            <div className="bg-cinema-deep rounded-xl p-4 flex items-center justify-between border border-cinema-border">
              <div className="text-cinema-muted text-sm">
                {seats} seat{seats > 1 ? 's' : ''} × ₹{movie.ticketPrice}
              </div>
              <div className="text-cinema-gold font-bold text-lg">₹{totalAmount}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button
            onClick={handleBook}
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Booking…
              </span>
            ) : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  )
}