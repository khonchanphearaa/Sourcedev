import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/composables/useApi'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('sourcedev_token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const setAuth = (newToken: string, newUser: User) => {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('sourcedev_token', newToken)
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('sourcedev_token')
  }

  /* Handler register */
  const register = async (name: string, email: string, password: string) => {
    loading.value = true
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      setAuth(data.token, data.user)
      return { success: true }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      return { success: false, message: e.response?.data?.message || 'Registration failed' }
    } finally {
      loading.value = false
    }
  }


  /* Handler login */
  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.token, data.user)
      return { success: true }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      return { success: false, message: e.response?.data?.message || 'Login failed' }
    } finally {
      loading.value = false
    }
  }

  const fetchMe = async () => {
    if (!token.value) return
    try {
      const { data } = await api.get('/auth/me')
      user.value = data.user
    } catch {
      logout()
    }
  }

  const updateProfile = async (payload: Partial<User>) => {
    const { data } = await api.put('/auth/profile', payload)
    user.value = data.user
    return data.user
  }

  return { user, token, loading, isAuthenticated, register, login, logout, fetchMe, updateProfile }
})