import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { movieAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import BookTicketModal from '../../components/BookTicketModal'
import Spinner from '../../components/Spinner'

function InfoPill({ label, value }) {
  if (!value) return null
  return (
    <div className="bg-cinema-deep/80 border border-cinema-border/60 rounded-xl px-4 py-3">
      <p className="text-cinema-muted text-[10px] uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-cinema-light text-sm font-medium">{value}</p>
    </div>
  )
}

export default function MovieDetailsPage() {
  const { id }              = useParams()
  const navigate            = useNavigate()
  const { isAuthenticated } = useAuth()

  const [movie,   setMovie]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [modal,   setModal]   = useState(false)

  useEffect(() => {
    movieAPI.getById(id)
      .then(({ data }) => setMovie(data))
      .catch(() => setError('Movie not found.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>

  if (error || !movie) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="text-4xl">🎬</span>
      <p className="text-cinema-light font-medium">{error || 'Movie not found.'}</p>
      <Link to="/" className="btn-ghost">← All Movies</Link>
    </div>
  )

  return (
    <>
      <div className="min-h-screen">
        {/* Backdrop */}
        {movie.posterUrl && (
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 blur-3xl opacity-[0.07]"
              style={{ backgroundImage: `url(${movie.posterUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-cinema-black/60 via-cinema-black/90 to-cinema-black" />
          </div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-20 animate-fadein">
          <Link to="/" className="inline-flex items-center gap-2 text-cinema-muted hover:text-cinema-light text-sm mb-10 transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> All Movies
          </Link>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-52 md:w-64 rounded-2xl overflow-hidden border border-cinema-border/60 shadow-card-lg relative">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                    onError={e => { e.target.src = `https://placehold.co/300x450/141421/6B6B8A?text=${encodeURIComponent(movie.title[0])}` }}
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-cinema-card flex items-center justify-center text-6xl">🎬</div>
                )}
                {/* Shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Rating badge below poster */}
              {movie.rating && (
                <div className="mt-3 flex items-center justify-center gap-1.5 bg-cinema-card border border-cinema-gold/30 rounded-xl py-2 px-4">
                  <span className="text-cinema-gold">★★★★★</span>
                  <span className="text-cinema-gold font-bold">{movie.rating}</span>
                  <span className="text-cinema-muted text-xs">/10</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {/* Genre badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre    && <span className="badge-muted">{movie.genre}</span>}
                {movie.language && <span className="badge-muted">{movie.language}</span>}
                {movie.duration && <span className="badge-muted">{movie.duration} min</span>}
              </div>

              <h1 className="font-display text-5xl md:text-6xl tracking-wider text-cinema-light mb-2 leading-none">
                {movie.title.toUpperCase()}
              </h1>

              {movie.releaseDate && (
                <p className="text-cinema-muted text-sm mb-5">
                  Released {new Date(movie.releaseDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}

              {movie.description && (
                <p className="text-cinema-subtle leading-relaxed text-[15px] mb-6 max-w-lg">
                  {movie.description}
                </p>
              )}

              {/* Info pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                <InfoPill label="Director"  value={movie.director} />
                <InfoPill label="Cast"      value={movie.cast} />
                <InfoPill label="Available" value={movie.availableSeats ? `${movie.availableSeats} seats` : null} />
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 border-t border-cinema-border/50">
                <div>
                  <p className="text-cinema-muted text-xs uppercase tracking-widest mb-0.5">Ticket Price</p>
                  <p className="text-cinema-gold text-3xl font-bold">
                    {movie.ticketPrice != null ? `₹${movie.ticketPrice}` : 'Free'}
                  </p>
                </div>
                <button
                  onClick={() => isAuthenticated ? setModal(true) : navigate('/login')}
                  className="btn-primary text-base px-8 py-3 shine animate-pulse-gold"
                >
                  🎟 Book Tickets
                </button>
                {!isAuthenticated && (
                  <p className="text-cinema-muted text-xs">Sign in required</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal && <BookTicketModal movie={movie} onClose={() => setModal(false)} />}
    </>
  )
}