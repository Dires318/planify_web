import axios from 'axios'

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set')
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // This is important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // The cookies will be automatically sent by the browser
    // We don't need to manually set the Authorization header
    // as the backend will read the cookies directly
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        await api.post('/api/auth/refresh/')
        
        // Retry the original request
        // The new cookies will be automatically sent
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api 