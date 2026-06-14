import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)  // true while we rehydrate from localStorage

  // ── Rehydrate session from localStorage on first mount ──────────────────────
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser  = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // ── Persist session to localStorage whenever it changes ─────────────────────
  const persistSession = (jwtToken, userData) => {
    localStorage.setItem('token', jwtToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(jwtToken)
    setUser(userData)
  }

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    const { data } = await authAPI.login(credentials)
    // Backend returns: { token, username, role, userId }
    persistSession(data.token, {
      id:       data.userId,
      username: data.username,
      role:     data.role,
    })
    toast.success(`Welcome back, ${data.username}!`)
    return data
  }, [])

  // ── Register ─────────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const { data } = await authAPI.register(formData)
    toast.success('Account created! Please log in.')
    return data
  }, [])

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    toast('Signed out.', { icon: '👋' })
  }, [])

  const isAdmin = user?.role === 'ADMIN'
  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}