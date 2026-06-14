import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email:    '',
    password: '',
    confirm:  '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password || !form.confirm) {
      toast.error('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await register({ username: form.username, email: form.email, password: form.password })
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try a different username.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const PasswordStrength = () => {
    const len = form.password.length
    if (!len) return null
    const strength = len < 6 ? 'Weak' : len < 10 ? 'Fair' : 'Strong'
    const colors   = { Weak: 'text-red-400', Fair: 'text-yellow-400', Strong: 'text-green-400' }
    return <p className={`text-xs mt-1 ${colors[strength]}`}>{strength} password</p>
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <span className="text-4xl block mb-4">🍿</span>
          <h1 className="text-2xl font-semibold text-cinema-light mb-1">Create an account</h1>
          <p className="text-cinema-muted text-sm">Start booking your favourite movies</p>
        </div>

        <div className="bg-cinema-card border border-cinema-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-cinema-muted text-sm mb-2">Username</label>
              <input
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                placeholder="movie_fan_42"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-cinema-muted text-sm mb-2">Email</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-cinema-muted text-sm mb-2">Password</label>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="input-field"
              />
              <PasswordStrength />
            </div>

            <div>
              <label className="block text-cinema-muted text-sm mb-2">Confirm Password</label>
              <input
                name="confirm"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat password"
                className="input-field"
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-red-400 text-xs mt-1">Passwords don't match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-cinema-muted text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cinema-gold hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}