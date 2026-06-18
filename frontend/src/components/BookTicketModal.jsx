import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { bookingAPI } from '../services/api'
import toast from 'react-hot-toast'

const SHOW_TIMES = ['10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '10:00 PM']

export default function BookTicketModal({ movie, onClose }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [seats,    setSeats]    = useState(2)
  const [showDate, setShowDate] = useState('')
  const [showTime, setShowTime] = useState('')
  const [loading,  setLoading]  = useState(false)

  const total = seats * (movie.ticketPrice || 0)
  const today = new Date().toISOString().split('T')[0]

  const handleBook = async () => {
    if (!isAuthenticated) { toast.error('Please sign in.'); navigate('/login'); return }
    if (!showDate) { toast.error('Select a date.'); return }
    if (!showTime) { toast.error('Select a show time.'); return }
    setLoading(true)
    try {
      await bookingAPI.create({ movieId: movie.id, numberOfSeats: seats, showDate, showTime, totalAmount: total })
      toast.success(`🎟 Booked ${seats} seat${seats > 1 ? 's' : ''} for ${movie.title}!`)
      onClose()
      navigate('/my-bookings')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="bg-cinema-elevated border border-cinema-border rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-card-lg animate-scalein">

        {/* Handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-cinema-border rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pt-4 pb-5 border-b border-cinema-border/60 flex items-center gap-4">
          {movie.posterUrl && (
            <img src={movie.posterUrl} alt={movie.title}
              className="w-12 h-16 object-cover rounded-xl border border-cinema-border flex-shrink-0"
              onError={e => e.target.style.display='none'} />
          )}
          <div className="flex-1 min-w-0">
            <p className="eyebrow text-[10px] mb-0.5">Now Booking</p>
            <h2 className="text-cinema-light font-semibold text-base leading-tight truncate">{movie.title}</h2>
            {movie.genre && <p className="text-cinema-muted text-xs mt-0.5">{movie.genre} · {movie.language}</p>}
          </div>
          <button onClick={onClose} className="text-cinema-muted hover:text-cinema-light transition-colors p-1 rounded-lg hover:bg-cinema-card flex-shrink-0">✕</button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Date */}
          <div>
            <label className="block text-cinema-subtle text-xs font-medium uppercase tracking-wider mb-2.5">Show Date</label>
            <input type="date" value={showDate} min={today}
              onChange={e => setShowDate(e.target.value)} className="input-field" />
          </div>

          {/* Time slots */}
          <div>
            <label className="block text-cinema-subtle text-xs font-medium uppercase tracking-wider mb-2.5">Show Time</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {SHOW_TIMES.map(t => (
                <button key={t} onClick={() => setShowTime(t)}
                  className={`py-2.5 text-xs font-medium rounded-xl border transition-all duration-150 ${
                    showTime === t
                      ? 'bg-cinema-gold border-cinema-gold text-cinema-black shadow-gold-sm'
                      : 'border-cinema-border text-cinema-muted hover:border-cinema-gold/50 hover:text-cinema-subtle'
                  }`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Seats */}
          <div>
            <label className="block text-cinema-subtle text-xs font-medium uppercase tracking-wider mb-2.5">Seats</label>
            <div className="flex items-center gap-4">
              <button onClick={() => setSeats(s => Math.max(1, s - 1))} disabled={seats === 1}
                className="w-10 h-10 rounded-xl border border-cinema-border text-cinema-light text-lg hover:border-cinema-gold hover:text-cinema-gold disabled:opacity-30 transition-all">−</button>
              <span className="text-cinema-light font-bold text-2xl w-8 text-center tabular-nums">{seats}</span>
              <button onClick={() => setSeats(s => Math.min(10, s + 1))} disabled={seats === 10}
                className="w-10 h-10 rounded-xl border border-cinema-border text-cinema-light text-lg hover:border-cinema-gold hover:text-cinema-gold disabled:opacity-30 transition-all">+</button>
              <div className="flex gap-1 ml-2">
                {Array.from({length: 10}, (_,i) => (
                  <button key={i} onClick={() => setSeats(i+1)}
                    className={`w-5 h-5 rounded text-[10px] transition-colors ${
                      i < seats ? 'bg-cinema-gold text-cinema-black' : 'bg-cinema-deep border border-cinema-border text-cinema-muted hover:border-cinema-gold/50'
                    }`}>{i+1}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-cinema-deep rounded-2xl p-4 border border-cinema-border/60 flex items-center justify-between">
            <div className="text-cinema-muted text-sm">
              {seats} × ₹{movie.ticketPrice || 0}
              {showDate && <span className="block text-xs mt-0.5 text-cinema-muted/70">{new Date(showDate).toDateString()} · {showTime || '—'}</span>}
            </div>
            <div>
              <p className="text-cinema-muted text-xs text-right mb-0.5">Total</p>
              <p className="text-cinema-gold font-bold text-2xl">₹{total}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={handleBook} disabled={loading} className="btn-primary flex-1 shine">
            {loading
              ? <><span className="w-4 h-4 border-2 border-cinema-black/30 border-t-cinema-black rounded-full animate-spin"/>Booking…</>
              : '🎟 Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  )
}