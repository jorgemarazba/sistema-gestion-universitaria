import axios from 'axios'

const baseURL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage)
      const token = parsed?.state?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // Ignorar si el storage está corrupto
    }
  }
  return config
})

export default api
