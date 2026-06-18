import { useState, useEffect } from 'react'
import { movieAPI } from '../../services/api'
import MovieCard from '../../components/MovieCard'
import Spinner from '../../components/Spinner'

const GENRES = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Animation']

export default function HomePage() {
  const [movies,  setMovies]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState('')
  const [genre,   setGenre]   = useState('All')

  useEffect(() => {
    movieAPI.getAll()
      .then(({ data }) => setMovies(data))
      .catch(() => setError('Could not load movies. Make sure the backend is running on port 8080.'))
      .finally(() => setLoading(false))
  }, [])

  const dynamicGenres = ['All', ...new Set(movies.map(m => m.genre).filter(Boolean))]
  const genreList = dynamicGenres.length > 2 ? dynamicGenres : GENRES

  const filtered = movies.filter(m => {
    const matchSearch = m.title?.toLowerCase().includes(search.toLowerCase())
    const matchGenre  = genre === 'All' || m.genre === genre
    return matchSearch && matchGenre
  })

  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 px-4 text-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="absolute inset-0 noise-bg pointer-events-none" />

        {/* Floating film strip decorations */}
        <div className="absolute left-4 top-8 opacity-5 font-display text-[120px] leading-none select-none pointer-events-none">
          🎬
        </div>
        <div className="absolute right-4 bottom-4 opacity-5 font-display text-[100px] leading-none select-none pointer-events-none rotate-12">
          🎭
        </div>

        <div className="relative max-w-2xl mx-auto">
          <p className="eyebrow mb-4 animate-fadein">Now Showing</p>
          <h1 className="font-display text-7xl md:text-9xl tracking-[0.1em] text-gradient-gold mb-4 animate-fadein" style={{animationDelay:'0.1s'}}>
            CINEBOOK
          </h1>
          <p className="text-cinema-subtle text-base md:text-lg leading-relaxed max-w-md mx-auto animate-fadein" style={{animationDelay:'0.2s'}}>
            Reserve your seat for the latest blockbusters. Pick a movie, choose your time, done in seconds.
          </p>
        </div>
      </section>

      {/* ── Filters ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cinema-muted text-sm pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search movies…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Genre pills */}
          <div className="flex gap-2 flex-wrap">
            {genreList.map(g => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  genre === g
                    ? 'bg-cinema-gold border-cinema-gold text-cinema-black shadow-gold-sm'
                    : 'border-cinema-border text-cinema-muted hover:border-cinema-gold/50 hover:text-cinema-subtle'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <Spinner size="lg" />
            <p className="text-cinema-muted text-sm animate-pulse">Loading movies…</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl">⚠</div>
            <p className="text-cinema-light font-medium">{error}</p>
            <p className="text-cinema-muted text-sm">Run: <code className="bg-cinema-card px-2 py-0.5 rounded text-cinema-gold">./mvnw spring-boot:run</code></p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="text-5xl">🎬</span>
            <p className="text-cinema-light font-medium">
              {search || genre !== 'All' ? 'No movies match your filters.' : 'No movies added yet.'}
            </p>
            {(search || genre !== 'All') && (
              <button onClick={() => { setSearch(''); setGenre('All') }} className="btn-ghost text-sm !py-1.5">
                Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-cinema-muted text-sm">
                <span className="text-cinema-light font-medium">{filtered.length}</span> movie{filtered.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((movie, i) => (
                <div key={movie.id} style={{ animationDelay: `${i * 0.04}s` }}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}