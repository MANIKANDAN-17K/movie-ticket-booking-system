import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from?.pathname || '/'

  const [form,    setForm]    = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { toast.error('Please fill in all fields.'); return }
    setLoading(true)
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      <div className="w-full max-w-sm relative animate-fadein">

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-cinema-gold/10 border border-cinema-gold/30 flex items-center justify-center text-3xl shadow-gold-sm">
            🎬
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-cinema-light mb-1.5">Welcome back</h1>
          <p className="text-cinema-muted text-sm">Sign in to your CineBook account</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 shadow-card-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-cinema-subtle text-xs font-medium uppercase tracking-wider mb-2">Username</label>
              <input
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="your_username"
                className="input-field"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-cinema-subtle text-xs font-medium uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cinema-muted hover:text-cinema-subtle transition-colors text-sm"
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full shine mt-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-cinema-black/30 border-t-cinema-black rounded-full animate-spin" /> Signing in…</>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-cinema-muted text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-cinema-gold hover:text-cinema-gold/80 font-medium transition-colors">
            Create one →
          </Link>
        </p>
      </div>
    </div>
  )
}