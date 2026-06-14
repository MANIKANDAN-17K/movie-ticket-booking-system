import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally — token expired or invalid
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
}

// ─── Movies ──────────────────────────────────────────────────────────────────
export const movieAPI = {
  getAll:  ()       => API.get('/movies'),
  getById: (id)     => API.get(`/movies/${id}`),
  create:  (data)   => API.post('/movies', data),
  update:  (id, data) => API.put(`/movies/${id}`, data),
  delete:  (id)     => API.delete(`/movies/${id}`),
}

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingAPI = {
  create:   (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my'),
  getAll:   ()     => API.get('/bookings'),
  cancel:   (id)   => API.delete(`/bookings/${id}`),
}

export default API