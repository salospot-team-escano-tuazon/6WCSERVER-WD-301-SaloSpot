import axios from 'axios'
import { token, clearSession } from './auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

// Send the admin token with every request when logged in.
api.interceptors.request.use((config) => {
  if (token.value) config.headers.Authorization = `Bearer ${token.value}`
  return config
})

// If the server says the token is no longer valid, log out locally.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isLogin = err.config?.url?.includes('/auth/login')
    if (err.response?.status === 401 && token.value && !isLogin) {
      clearSession(true)
    }
    return Promise.reject(err)
  }
)

// Public (read only)
export const getRestaurants = (params = {}) =>
  api.get('/restaurants', { params }).then((res) => res.data)

export const getCuisines = () =>
  api.get('/restaurants/cuisines').then((res) => res.data)

export const getRestaurant = (id) =>
  api.get(`/restaurants/${id}`).then((res) => res.data)

// Auth
export const loginRequest = (username, password) =>
  api.post('/auth/login', { username, password }).then((res) => res.data)

// Admin only (the server checks the token)
export const getAdminRestaurants = (params = {}) =>
  api.get('/restaurants/admin/all', { params }).then((res) => res.data)

export const createRestaurant = (data) =>
  api.post('/restaurants', data).then((res) => res.data)

export const updateRestaurant = (id, data) =>
  api.put(`/restaurants/${id}`, data).then((res) => res.data)

export const deleteRestaurant = (id) =>
  api.delete(`/restaurants/${id}`).then((res) => res.data)

// Turns an axios error into a readable message.
export const errorMessage = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || fallback

export default api