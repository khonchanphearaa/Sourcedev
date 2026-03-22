import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sourcedev_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => {
    if (
      res.data && typeof res.data === 'object' && 'success' in res.data && 'data' in res.data
    ) {
      res.data = res.data.data
    }
    return res
  },
  (err) => {
    const requestUrl = String(err.config?.url || '')
    const isAuthAttempt = /\/auth\/(login|register)$/.test(requestUrl)

    if (err.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem('sourcedev_token')
      if (window.location.pathname !== '/login') window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api