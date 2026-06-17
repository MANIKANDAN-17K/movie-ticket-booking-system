import { useState, useEffect, useMemo } from 'react'
import { bookingAPI } from '../../services/api'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  CONFIRMED: 'text-green-400 bg-green-400/10 border-green-400/30',
  CANCELLED: 'text-red-400  bg-red-400/10  border-red-400/30',
  PENDING:   'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
}

function SummaryBar({ bookings }) {
  const total     = bookings.length
  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length
  const cancelled = bookings.filter((b) => b.status === 'CANCELLED').length
  const revenue   = bookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((s, b) => s + (b.totalAmount || 0), 0)

  const items = [
    { label: 'Total Bookings',  value: total,                                        icon: '🎟' },
    { label: 'Confirmed',       value: confirmed,                                    icon: '✅' },
    { label: 'Cancelled',       value: cancelled,                                    icon: '❌' },
    { label: 'Revenue',         value: `₹${revenue.toLocaleString('en-IN')}`,        icon: '💰' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {items.map(({ label, value, icon }) => (
        <div key={label} className="bg-cinema-card border border-cinema-border rounded-xl px-4 py-3">
          <p className="text-cinema-muted text-xs uppercase tracking-wider mb-0.5">{icon} {label}</p>
          <p className="text-cinema-light font-bold text-xl">{value}</p>
        </div>
      ))}
    </div>
  )
}

export default function ViewBookings() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortKey,  setSortKey]  = useState('id')
  const [sortDir,  setSortDir]  = useState('desc')
  const [page,     setPage]     = useState(1)
  const PER_PAGE = 10

  useEffect(() => {
    bookingAPI.getAll()
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Failed to load bookings.'))
      .finally(() => setLoading(false))
  }, [])

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <span className="text-cinema-border ml-1">↕</span>
    return <span className="text-cinema-gold ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  const filtered = useMemo(() => {
    let result = bookings.filter((b) => {
      const matchSearch = [b.username, b.movieTitle, String(b.id)].some((f) =>
        f?.toLowerCase().includes(search.toLowerCase())
      )
      const matchStatus = statusFilter === 'ALL' || b.status === statusFilter
      return matchSearch && matchStatus
    })

    result.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === 'string') av = av?.toLowerCase()
      if (typeof bv === 'string') bv = bv?.toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ?  1 : -1
      return 0
    })

    return result
  }, [bookings, search, statusFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Reset to page 1 on filter change
  useEffect(() => setPage(1), [search, statusFilter])

  const COLS = [
    { key: 'id',            label: 'ID'      },
    { key: 'username',      label: 'User'    },
    { key: 'movieTitle',    label: 'Movie'   },
    { key: 'showDate',      label: 'Date'    },
    { key: 'showTime',      label: 'Time'    },
    { key: 'numberOfSeats', label: 'Seats'   },
    { key: 'totalAmount',   label: 'Amount'  },
    { key: 'status',        label: 'Status'  },
  ]

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <p className="text-cinema-muted text-xs uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-3xl font-semibold text-cinema-light">All Bookings</h1>
      </div>

      {/* Summary */}
      {!loading && <SummaryBar bookings={bookings} />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cinema-muted text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by user, movie, or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 text-sm"
          />
        </div>

        <div className="flex gap-2">
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-150 whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-cinema-gold border-cinema-gold text-cinema-black'
                  : 'border-cinema-border text-cinema-muted hover:border-cinema-gold hover:text-cinema-gold'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-cinema-card border border-cinema-border rounded-2xl">
          <p className="text-4xl mb-3">🎟</p>
          <p className="text-cinema-muted">No bookings match your filters.</p>
        </div>
      ) : (
        <>
          <div className="bg-cinema-card border border-cinema-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cinema-border bg-cinema-deep/50">
                    {COLS.map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => toggleSort(key)}
                        className="text-left text-cinema-muted text-xs uppercase tracking-wider px-4 py-3 font-medium whitespace-nowrap cursor-pointer hover:text-cinema-gold transition-colors select-none"
                      >
                        {label}<SortIcon k={key} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cinema-border">
                  {paginated.map((b) => (
                    <tr key={b.id} className="hover:bg-cinema-deep/40 transition-colors">
                      <td className="px-4 py-3 text-cinema-muted text-xs font-mono">#{b.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-cinema-deep border border-cinema-border flex items-center justify-center text-xs font-bold text-cinema-gold flex-shrink-0">
                            {(b.username || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="text-cinema-light text-sm">{b.username || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-cinema-light text-sm max-w-[150px] truncate">{b.movieTitle || '—'}</td>
                      <td className="px-4 py-3 text-cinema-muted text-sm whitespace-nowrap">
                        {b.showDate ? new Date(b.showDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-3 text-cinema-muted text-sm whitespace-nowrap">{b.showTime || '—'}</td>
                      <td className="px-4 py-3 text-cinema-muted text-sm">{b.numberOfSeats ?? '—'}</td>
                      <td className="px-4 py-3 text-cinema-gold font-semibold text-sm whitespace-nowrap">
                        {b.totalAmount != null ? `₹${b.totalAmount.toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        {b.status ? (
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[b.status] || 'text-cinema-muted border-cinema-border'}`}>
                            {b.status}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-cinema-border">
              <p className="text-cinema-muted text-xs">
                Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-cinema-border text-cinema-muted text-xs hover:border-cinema-gold hover:text-cinema-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push('…')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === '…' ? (
                      <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-cinema-muted text-xs">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs border transition-colors ${
                          page === p
                            ? 'bg-cinema-gold border-cinema-gold text-cinema-black font-bold'
                            : 'border-cinema-border text-cinema-muted hover:border-cinema-gold hover:text-cinema-gold'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-cinema-border text-cinema-muted text-xs hover:border-cinema-gold hover:text-cinema-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}