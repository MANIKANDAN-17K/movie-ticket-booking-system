import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { movieAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import BookTicketModal from '../../components/BookTicketModal'
import Spinner from '../../components/Spinner'

export default function MovieDetailsPage() {
  const { id }               = useParams()
  const navigate             = useNavigate()
  const { isAuthenticated }  = useAuth()

  const [movie,   setMovie]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [modal,   setModal]   = useState(false)

  useEffect(() => {
    movieAPI.getById(id)
      .then(({ data }) => setMovie(data))
      .catch(() => setError('Movie not found or server is unavailable.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-cinema-red text-lg">⚠ {error || 'Movie not found.'}</p>
        <Link to="/" className="btn-ghost">← Back to Movies</Link>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen">

        {/* Backdrop blur hero */}
        <div className="relative">
          {movie.posterUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl scale-105"
              style={{ backgroundImage: `url(${movie.posterUrl})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-cinema-black/50 via-cinema-black/80 to-cinema-black" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-12">

            {/* Back link */}
            <Link to="/" className="inline-flex items-center gap-2 text-cinema-muted hover:text-cinema-gold transition-colors text-sm mb-8">
              ← All Movies
            </Link>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12">

              {/* Poster */}
              <div className="flex-shrink-0 w-48 md:w-64 mx-auto md:mx-0">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={`${movie.title} poster`}
                    className="w-full rounded-xl shadow-card border border-cinema-border"
                    onError={(e) => { e.target.src = `https://placehold.co/300x450/1A1A27/8A8AA8?text=${encodeURIComponent(movie.title)}` }}
                  />
                ) : (
                  <div className="w-full aspect-[2/3] rounded-xl bg-cinema-card border border-cinema-border flex items-center justify-center text-5xl">
                    🎬
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col">
                {/* Genre / Language */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {movie.genre && (
                    <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-cinema-card border border-cinema-border text-cinema-muted">
                      {movie.genre}
                    </span>
                  )}
                  {movie.language && (
                    <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-cinema-card border border-cinema-border text-cinema-muted">
                      {movie.language}
                    </span>
                  )}
                </div>

                <h1 className="font-display text-4xl md:text-5xl tracking-wider text-cinema-light mb-2">
                  {movie.title.toUpperCase()}
                </h1>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-cinema-muted text-sm mb-4">
                  {movie.rating && (
                    <span className="flex items-center gap-1 text-cinema-gold font-semibold">
                      ★ {movie.rating}
                    </span>
                  )}
                  {movie.duration && <span>{movie.duration} min</span>}
                  {movie.releaseDate && (
                    <span>{new Date(movie.releaseDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  )}
                </div>

                {/* Description */}
                {movie.description && (
                  <p className="text-cinema-muted leading-relaxed mb-6 max-w-lg">
                    {movie.description}
                  </p>
                )}

                {/* Additional info */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {movie.director && (
                    <div>
                      <p className="text-cinema-muted text-xs uppercase tracking-wider mb-1">Director</p>
                      <p className="text-cinema-light text-sm font-medium">{movie.director}</p>
                    </div>
                  )}
                  {movie.cast && (
                    <div>
                      <p className="text-cinema-muted text-xs uppercase tracking-wider mb-1">Cast</p>
                      <p className="text-cinema-light text-sm font-medium">{movie.cast}</p>
                    </div>
                  )}
                </div>

                {/* Price + CTA */}
                <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {movie.ticketPrice != null && (
                    <div>
                      <p className="text-cinema-muted text-xs mb-0.5">Ticket Price</p>
                      <p className="text-cinema-gold text-2xl font-bold">₹{movie.ticketPrice}</p>
                    </div>
                  )}
                  <button
                    onClick={() => isAuthenticated ? setModal(true) : navigate('/login')}
                    className="btn-primary px-8 py-3 text-base"
                  >
                    🎟 Book Tickets
                  </button>
                  {!isAuthenticated && (
                    <p className="text-cinema-muted text-xs">Sign in required to book</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && <BookTicketModal movie={movie} onClose={() => setModal(false)} />}
    </>
  )
}