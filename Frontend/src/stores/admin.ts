import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/composables/useApi'
import type { User } from '@/types'
import type { ApiErrorResponse } from '@/types/api'

type UserPayload = User & { _id?: string; createdAt?: string }

export const useAdminStore = defineStore('admin', () => {
    const users = ref<User[]>([])
    const loading = ref(false)
    const updating = ref<string | null>(null)
    const error = ref<string | null>(null)
    const success = ref('')

    const normalizeUser = (payload: UserPayload): User => ({
        ...payload,
        id: payload.id || payload._id || '',
    })

    const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length)
    const userCount = computed(() => users.value.filter(u => u.role === 'user').length)

    /** Fetch all users */
    const fetchUsers = async () => {
        loading.value = true
        error.value = null
        try {
            const { data } = await api.get('/auth/users')
            users.value = Array.isArray(data.users) ? data.users.map(normalizeUser) : []
        } catch (err) {
            error.value = (err as ApiErrorResponse).response?.data?.message ?? 'Failed to load users.'
        } finally {
            loading.value = false
        }
    }

    /** Toggle role */
    const updateUserRole = async (user: User): Promise<string | null> => {
        updating.value = user.id
        error.value = null
        success.value = ''

        try {
            const newRole = user.role === 'admin' ? 'user' : 'admin'
            const { data } = await api.put(`/auth/users/${user.id}/role`, { role: newRole })
            const updatedUser = normalizeUser(data.user)

            const index = users.value.findIndex(u => u.id === user.id)
            const existing = users.value[index]
            if (index !== -1 && existing) {
                users.value[index] = { ...existing, ...updatedUser }
            }

            success.value = `${user.name} is now a ${newRole}.`
            setTimeout(() => (success.value = ''), 3000)
            return null
        } catch (err) {
            const msg = (err as ApiErrorResponse).response?.data?.message ?? 'Failed to update role.'
            error.value = msg
            return msg
        } finally {
            updating.value = null
        }
    }

    return {
        users, loading, updating, error, success,
        adminCount, userCount, fetchUsers, updateUserRole
    }
})