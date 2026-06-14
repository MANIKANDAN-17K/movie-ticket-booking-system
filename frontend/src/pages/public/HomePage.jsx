import { useState, useEffect } from 'react'
import { movieAPI } from '../../services/api'
import MovieCard from '../../components/MovieCard'
import Spinner from '../../components/Spinner'

export default function HomePage() {
  const [movies,  setMovies]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')
  const [genre,   setGenre]   = useState('All')

  useEffect(() => {
    movieAPI.getAll()
      .then(({ data }) => setMovies(data))
      .catch(() => setError('Could not load movies. Check the server is running.'))
      .finally(() => setLoading(false))
  }, [])

  // Derive genre list from movies
  const genres = ['All', ...new Set(movies.map((m) => m.genre).filter(Boolean))]

  const filtered = movies.filter((m) => {
    const matchSearch = m.title?.toLowerCase().includes(search.toLowerCase())
    const matchGenre  = genre === 'All' || m.genre === genre
    return matchSearch && matchGenre
  })

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,197,24,0.07)_0%,_transparent_60%)] pointer-events-none" />
        <p className="text-cinema-muted uppercase tracking-[0.3em] text-sm mb-4">Now Showing</p>
        <h1 className="font-display text-6xl md:text-8xl tracking-widest text-gradient-gold mb-4">
          CINEBOOK
        </h1>
        <p className="text-cinema-muted max-w-md mx-auto">
          Reserve your seat for the latest blockbusters. Pick a movie, choose your show, done.
        </p>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cinema-muted">🔍</span>
            <input
              type="text"
              placeholder="Search movies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Genre filter */}
          <div className="flex gap-2 flex-wrap">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-4 py-2.5 rounded-lg text-sm border transition-all duration-150 ${
                  genre === g
                    ? 'bg-cinema-gold border-cinema-gold text-cinema-black font-semibold'
                    : 'border-cinema-border text-cinema-muted hover:border-cinema-gold hover:text-cinema-gold'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Movie grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {loading && (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-cinema-red mb-2">⚠ {error}</p>
            <p className="text-cinema-muted text-sm">Make sure the Spring Boot backend is running on port 8080.</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🎬</p>
            <p className="text-cinema-muted">
              {search || genre !== 'All' ? 'No movies match your filters.' : 'No movies available yet.'}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-cinema-muted text-sm mb-6">
              {filtered.length} movie{filtered.length !== 1 ? 's' : ''} available
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filtered.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}