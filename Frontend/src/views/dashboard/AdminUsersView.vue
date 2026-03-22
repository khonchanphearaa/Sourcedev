<template>
  <div class="max-w-5xl mx-auto px-6 py-12">
    <div class="mb-10">
      <h1 class="font-serif text-3xl text-ink">Manage Users</h1>
      <p class="text-sm text-ink-muted font-sans mt-1">View and update user roles</p>
    </div>

    <BaseAlert :message="error || undefined" class="mb-5" />
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
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import { useDate } from '@/composables/useDate'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import type { User } from '@/types'

const auth  = useAuthStore()
const admin = useAdminStore()
const { formatShort } = useDate()

const confirmModal = ref(false)
const pendingUser  = ref<User | null>(null)

const { users, loading, updating, error, success, adminCount, userCount } = storeToRefs(admin)

const toggleRole = (u: User) => {
  error.value   = null
  success.value = ''
  pendingUser.value  = u
  confirmModal.value = true
}

const confirmToggle = async () => {
  const u = pendingUser.value
  if (!u) return
  confirmModal.value = false
  await admin.updateUserRole(u)
  pendingUser.value = null
}

onMounted(() => admin.fetchUsers())
</script>