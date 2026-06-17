import { useState, useEffect, useRef } from 'react'
import { movieAPI } from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  title: '', genre: '', language: '', duration: '', releaseDate: '',
  description: '', director: '', cast: '', posterUrl: '',
  ticketPrice: '', rating: '', availableSeats: '',
}

const GENRES = ['Action','Comedy','Drama','Horror','Sci-Fi','Romance','Thriller','Animation','Documentary','Fantasy']

function MovieFormModal({ initial, onSave, onClose }) {
  const [form,   setForm]   = useState(initial || EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title)       { toast.error('Title is required.');        return }
    if (!form.ticketPrice) { toast.error('Ticket price is required.'); return }
    setSaving(true)
    try {
      await onSave({
        ...form,
        duration:       form.duration       ? Number(form.duration)       : null,
        ticketPrice:    form.ticketPrice    ? Number(form.ticketPrice)    : null,
        rating:         form.rating         ? Number(form.rating)         : null,
        availableSeats: form.availableSeats ? Number(form.availableSeats) : null,
      })
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { name: 'title',          label: 'Title *',            type: 'text',   span: 2 },
    { name: 'director',       label: 'Director',           type: 'text' },
    { name: 'language',       label: 'Language',           type: 'text' },
    { name: 'duration',       label: 'Duration (mins)',    type: 'number' },
    { name: 'releaseDate',    label: 'Release Date',       type: 'date' },
    { name: 'ticketPrice',    label: 'Ticket Price (₹) *', type: 'number' },
    { name: 'availableSeats', label: 'Available Seats',    type: 'number' },
    { name: 'rating',         label: 'Rating (0–10)',      type: 'number' },
    { name: 'posterUrl',      label: 'Poster Image URL',   type: 'url',   span: 2 },
    { name: 'cast',           label: 'Cast',               type: 'text',  span: 2 },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-cinema-card border border-cinema-border rounded-2xl w-full max-w-2xl my-4 shadow-2xl">

        {/* Header */}
        <div className="px-6 py-5 border-b border-cinema-border flex items-center justify-between">
          <div>
            <h2 className="text-cinema-light font-semibold text-lg">
              {initial ? 'Edit Movie' : 'Add New Movie'}
            </h2>
            <p className="text-cinema-muted text-xs mt-0.5">
              {initial ? 'Update movie details below' : 'Fill in the details for the new movie'}
            </p>
          </div>
          <button onClick={onClose} className="text-cinema-muted hover:text-cinema-light text-xl p-1 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {fields.map(({ name, label, type, span }) => (
              <div key={name} className={span === 2 ? 'sm:col-span-2' : ''}>
                <label className="block text-cinema-muted text-xs uppercase tracking-wider mb-1.5">{label}</label>
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  step={type === 'number' ? 'any' : undefined}
                  min={type === 'number' ? '0' : undefined}
                  className="input-field text-sm"
                  placeholder={name === 'posterUrl' ? 'https://...' : ''}
                />
              </div>
            ))}

            {/* Genre dropdown */}
            <div>
              <label className="block text-cinema-muted text-xs uppercase tracking-wider mb-1.5">Genre</label>
              <select
                name="genre"
                value={form.genre}
                onChange={handleChange}
                className="input-field text-sm"
              >
                <option value="">Select genre</option>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-cinema-muted text-xs uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="input-field text-sm resize-none"
                placeholder="Brief synopsis of the movie…"
              />
            </div>
          </div>

          {/* Poster preview */}
          {form.posterUrl && (
            <div className="mb-4 flex items-start gap-4 p-4 bg-cinema-deep rounded-xl border border-cinema-border">
              <img
                src={form.posterUrl}
                alt="Poster preview"
                className="w-16 h-24 object-cover rounded-lg border border-cinema-border"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <div>
                <p className="text-cinema-muted text-xs uppercase tracking-wider mb-1">Poster Preview</p>
                <p className="text-cinema-light text-sm font-medium">{form.title || 'Untitled'}</p>
                {form.genre && <p className="text-cinema-muted text-xs mt-0.5">{form.genre}</p>}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? (
                <><span className="w-4 h-4 border-2 border-cinema-black/30 border-t-cinema-black rounded-full animate-spin" /> Saving…</>
              ) : (initial ? 'Update Movie' : 'Add Movie')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ movie, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false)
  const handleConfirm = async () => {
    setDeleting(true)
    await onConfirm()
    setDeleting(false)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-cinema-card border border-cinema-border rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-3">🗑</span>
          <h2 className="text-cinema-light font-semibold text-lg mb-1">Delete Movie?</h2>
          <p className="text-cinema-muted text-sm">
            This will permanently remove <strong className="text-cinema-light">"{movie.title}"</strong> and all its data.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">Keep it</button>
          <button
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ManageMovies() {
  const [movies,    setMovies]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [showForm,  setShowForm]  = useState(false)
  const [editMovie, setEditMovie] = useState(null)
  const [delMovie,  setDelMovie]  = useState(null)

  const fetchMovies = () => {
    setLoading(true)
    movieAPI.getAll()
      .then(({ data }) => setMovies(data))
      .catch(() => toast.error('Failed to load movies.'))
      .finally(() => setLoading(false))
  }

  useEffect(fetchMovies, [])

  const handleSave = async (payload) => {
    try {
      if (editMovie) {
        await movieAPI.update(editMovie.id, payload)
        toast.success('Movie updated successfully.')
      } else {
        await movieAPI.create(payload)
        toast.success('Movie added successfully.')
      }
      setShowForm(false)
      setEditMovie(null)
      fetchMovies()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.')
      throw err
    }
  }

  const handleDelete = async () => {
    try {
      await movieAPI.delete(delMovie.id)
      toast.success(`"${delMovie.title}" deleted.`)
      setMovies((m) => m.filter((x) => x.id !== delMovie.id))
      setDelMovie(null)
    } catch {
      toast.error('Delete failed.')
      throw new Error('delete failed')
    }
  }

  const filtered = movies.filter((m) =>
    [m.title, m.genre, m.language, m.director].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
  )

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-cinema-muted text-xs uppercase tracking-widest mb-1">Admin</p>
          <h1 className="text-3xl font-semibold text-cinema-light">Manage Movies</h1>
          <p className="text-cinema-muted text-sm mt-1">{movies.length} movie{movies.length !== 1 ? 's' : ''} in the system</p>
        </div>
        <button
          onClick={() => { setEditMovie(null); setShowForm(true) }}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="text-lg">+</span> Add Movie
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cinema-muted text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search movies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10 text-sm"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-cinema-card border border-cinema-border rounded-2xl">
          <p className="text-4xl mb-3">🎬</p>
          <p className="text-cinema-muted">
            {search ? 'No movies match your search.' : 'No movies yet — add one!'}
          </p>
        </div>
      ) : (
        <div className="bg-cinema-card border border-cinema-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cinema-border bg-cinema-deep/50">
                  {['Poster', 'Title', 'Genre', 'Language', 'Duration', 'Price', 'Seats', 'Rating', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-cinema-muted text-xs uppercase tracking-wider px-4 py-3 font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-border">
                {filtered.map((movie) => (
                  <tr key={movie.id} className="hover:bg-cinema-deep/40 transition-colors group">
                    <td className="px-4 py-3">
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-9 h-12 object-cover rounded-md border border-cinema-border"
                          onError={(e) => { e.target.src = `https://placehold.co/40x56/1A1A27/8A8AA8?text=🎬` }}
                        />
                      ) : (
                        <div className="w-9 h-12 bg-cinema-deep rounded-md border border-cinema-border flex items-center justify-center text-base">🎬</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-cinema-light font-medium max-w-[160px] truncate">{movie.title}</p>
                      {movie.director && <p className="text-cinema-muted text-xs">{movie.director}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {movie.genre ? (
                        <span className="text-xs px-2 py-0.5 rounded-full border border-cinema-border text-cinema-muted">{movie.genre}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-cinema-muted">{movie.language || '—'}</td>
                    <td className="px-4 py-3 text-cinema-muted">{movie.duration ? `${movie.duration}m` : '—'}</td>
                    <td className="px-4 py-3 text-cinema-gold font-semibold whitespace-nowrap">
                      {movie.ticketPrice != null ? `₹${movie.ticketPrice}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-cinema-muted">{movie.availableSeats ?? '—'}</td>
                    <td className="px-4 py-3 text-cinema-muted">
                      {movie.rating ? <span className="text-cinema-gold">★ {movie.rating}</span> : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setEditMovie({ ...movie, releaseDate: movie.releaseDate?.split('T')[0] || '' })
                            setShowForm(true)
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg border border-cinema-border text-cinema-muted hover:border-cinema-gold hover:text-cinema-gold transition-colors whitespace-nowrap"
                        >
                          ✏ Edit
                        </button>
                        <button
                          onClick={() => setDelMovie(movie)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-cinema-border text-cinema-muted hover:border-red-500 hover:text-red-400 transition-colors whitespace-nowrap"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-cinema-border text-cinema-muted text-xs">
            Showing {filtered.length} of {movies.length} movies
          </div>
        </div>
      )}

      {showForm && (
        <MovieFormModal
          initial={editMovie}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditMovie(null) }}
        />
      )}

      {delMovie && (
        <DeleteConfirmModal
          movie={delMovie}
          onConfirm={handleDelete}
          onClose={() => setDelMovie(null)}
        />
      )}
    </div>
  )
}