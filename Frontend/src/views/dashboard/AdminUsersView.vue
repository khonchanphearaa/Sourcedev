<template>
  <div class="max-w-5xl mx-auto px-6 py-12">
    <div class="mb-10">
      <h1 class="font-serif text-3xl text-ink">Manage Users</h1>
      <p class="text-sm text-ink-muted font-sans mt-1">View and update user roles</p>
    </div>

    <BaseAlert :message="error" class="mb-5" />
    <BaseAlert :message="success" variant="success" class="mb-5" />

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
      <div class="bg-white rounded-xl border border-paper-border p-5 text-center">
        <p class="font-serif text-4xl font-bold text-ink">{{ users.length }}</p>
        <p class="text-sm text-ink-muted font-sans mt-1">Total Users</p>
      </div>
      <div class="bg-white rounded-xl border border-paper-border p-5 text-center">
        <p class="font-serif text-4xl font-bold text-accent">{{ adminCount }}</p>
        <p class="text-sm text-ink-muted font-sans mt-1">Admins</p>
      </div>
      <div class="bg-white rounded-xl border border-paper-border p-5 text-center">
        <p class="font-serif text-4xl font-bold text-ink">{{ userCount }}</p>
        <p class="text-sm text-ink-muted font-sans mt-1">Readers</p>
      </div>
    </div>

    <BaseModal v-model="confirmModal" title="Change User Role"
      :description="pendingUser ? `Are you sure you want to make ${pendingUser.name} a ${pendingUser.role === 'admin' ? 'Reader' : 'Admin'}? ${pendingUser.role === 'admin' ? 'They will lose all admin privileges and can no longer manage users or content.' : 'They will gain full admin access: manage users, publish and delete any article.'}` : ''"
      confirm-text="Yes, change role" cancel-text="Cancel" @confirm="confirmToggle" @cancel="pendingUser = null" />

    <BaseSpinner v-if="loading" full-page />

    <div v-else class="bg-white rounded-xl border border-paper-border overflow-hidden">
      <table class="w-full text-sm font-sans">
        <thead>
          <tr class="border-b border-paper-border bg-paper-warm">
            <th class="text-left px-5 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">User</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide hidden sm:table-cell">
              Email</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide hidden md:table-cell">
              Joined</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Role</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wide">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-paper-border">
          <tr v-for="u in users" :key="u.id" class="hover:bg-paper-warm/50 transition-colors">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <BaseAvatar :name="u.name" size="sm" />
                <div>
                  <p class="font-medium text-ink">{{ u.name }}</p>
                  <p class="text-xs text-ink-muted sm:hidden">{{ u.email }}</p>
                </div>
                <span v-if="u.id === auth.user?.id"
                  class="text-xs bg-paper-warm text-ink-muted px-2 py-0.5 rounded-full border border-paper-border">You</span>
              </div>
            </td>
            
            <td class="px-5 py-4 text-ink-muted hidden sm:table-cell">{{ u.email }}</td>
            <td class="px-5 py-4 text-ink-muted hidden md:table-cell">{{ formatShort((u as unknown as {createdAt: string }).createdAt) }}</td>
            <td class="px-5 py-4">
              <span :class="['inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border', u.role === 'admin' ? 'bg-accent-light text-accent border-accent/20' : 'bg-paper-warm text-ink-muted border-paper-border']">
                {{ u.role === 'admin' ? '★ Admin' : 'Reader' }}
              </span>
            </td>
            <td class="px-5 py-4">
              <BaseButton v-if="u.id !== auth.user?.id" :variant="u.role === 'admin' ? 'outline' : 'accent'" size="sm" :loading="updating === u.id" @click="toggleRole(u)">
                {{ u.role === 'admin' ? 'Make Reader' : 'Make Admin' }}
              </BaseButton>
              <span v-else class="text-xs text-ink-muted">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'
import { useDate } from '@/composables/useDate'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import type { User } from '@/types'

const auth = useAuthStore()
const { formatShort } = useDate()

const users = ref<User[]>([])
const loading = ref(true)
const updating = ref<string | null>(null)
const error = ref('')
const success = ref('')
const confirmModal = ref(false)
const pendingUser = ref<User | null>(null)

const adminCount = computed(() => users.value.filter(u => u.role === 'admin').length)
const userCount = computed(() => users.value.filter(u => u.role === 'user').length)

const toggleRole = (u: User) => {
  error.value = ''
  success.value = ''
  pendingUser.value = u
  confirmModal.value = true
}

const confirmToggle = async () => {
  const u = pendingUser.value
  if (!u) return
  confirmModal.value = false
  updating.value = u.id
  try {
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    const { data } = await api.put(`/auth/users/${u.id}/role`, { role: newRole })
    const idx = users.value.findIndex(x => x.id === u.id)
    if (idx !== -1) {
      const currentUser = users.value[idx]
      if (currentUser) {
        users.value[idx] = { ...currentUser, role: data.user.role as User['role'] }
      }
    }
    success.value = `${u.name} is now a ${newRole}.`
    setTimeout(() => success.value = '', 3000)
  } catch (err: unknown) {
    const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    error.value = msg || 'Failed to update role.'
  } finally {
    updating.value = null
    pendingUser.value = null
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/auth/users')
    users.value = data.users
  } catch {
    error.value = 'Failed to load users.'
  } finally {
    loading.value = false
  }
})
</script>