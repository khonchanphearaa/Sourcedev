<template>
    <header class="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-paper-border">
        <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">

            <!-- Brand -->
            <RouterLink to="/" class="flex items-center font-serif font-semibold text-xl text-ink hover:opacity-80 transition-opacity">
                <img :src="Brand" alt="Sourcedev-logo" class="h-12 w-auto object-contain" />
                <span>Sourcedev</span>
            </RouterLink>
            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center gap-1">
                <RouterLink to="/" class="px-3 py-1.5 rounded-lg text-sm font-medium text-ink-soft hover:text-ink hover:bg-paper-warm transition-all" active-class="text-ink bg-paper-warm">
                    Explore
                </RouterLink>
                <template v-if="auth.isAuthenticated">
                    <RouterLink to="/dashboard" class="px-3 py-1.5 rounded-lg text-sm font-medium text-ink-soft hover:text-ink hover:bg-paper-warm transition-all" active-class="text-ink bg-paper-warm">
                        My Articles
                    </RouterLink>
                    <RouterLink to="/admin/users" class="px-3 py-1.5 rounded-lg text-sm font-medium text-ink-soft hover:text-ink hover:bg-paper-warm transition-all" active-class="text-ink bg-paper-warm">
                        Users
                    </RouterLink>
                    <RouterLink to="/write">
                        <BaseButton variant="accent" size="sm">✦ Write</BaseButton>
                    </RouterLink>

                    <!-- Avatar dropdown -->
                    <div class="relative ml-1" ref="dropdownRef">
                        <button @click="dropdownOpen = !dropdownOpen" class="focus:outline-none">
                            <BaseAvatar :name="auth.user?.name ?? ''" size="sm" class="cursor-pointer hover:opacity-80 transition-opacity" />
                        </button>
                        <Transition enter-active-class="transition duration-150 ease-out"
                            enter-from-class="opacity-0 scale-95 -translate-y-1"
                            enter-to-class="opacity-100 scale-100 translate-y-0"
                            leave-active-class="transition duration-100 ease-in"
                            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                            <div v-if="dropdownOpen" class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-paper-border shadow-lg overflow-hidden">
                                <div class="px-4 py-3 border-b border-paper-border">
                                    <p class="text-sm font-semibold text-ink truncate">{{ auth.user?.name }}</p>
                                    <p class="text-xs text-ink-muted truncate">{{ auth.user?.email }}</p>
                                </div>
                                <RouterLink to="/profile" @click="dropdownOpen = false" class="block px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-warm hover:text-ink transition-colors">
                                    Profile</RouterLink>
                                <RouterLink to="/dashboard" @click="dropdownOpen = false" class="block px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-warm hover:text-ink transition-colors">
                                    Dashboard</RouterLink>
                                <RouterLink v-if="auth.user?.role === 'admin'" to="/admin/users" @click="dropdownOpen = false" class="block px-4 py-2.5 text-sm text-ink-soft hover:bg-paper-warm hover:text-ink transition-colors">
                                    Manage Users</RouterLink>
                                <div class="border-t border-paper-border mt-1">
                                    <button @click="handleLogout" class="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">Sign out</button>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </template>
                <template v-else>
                    <RouterLink to="/login" class="px-3 py-1.5 rounded-lg text-sm font-medium text-ink-soft hover:text-ink hover:bg-paper-warm transition-all"> Sign in</RouterLink>
                    <RouterLink to="/register">
                        <BaseButton size="sm">Get started</BaseButton>
                    </RouterLink>
                </template>
            </nav>

            <!-- Mobile hamburger -->
            <button @click="mobileOpen = !mobileOpen"
                class="md:hidden p-2 rounded-lg hover:bg-paper-warm transition-colors" aria-label="Menu">
                <div class="w-5 flex flex-col gap-1.5">
                    <span :class="['block h-0.5 bg-ink rounded transition-all duration-200', mobileOpen ? 'rotate-45 translate-y-2' : '']" />
                    <span :class="['block h-0.5 bg-ink rounded transition-all duration-200', mobileOpen ? 'opacity-0' : '']" />
                    <span :class="['block h-0.5 bg-ink rounded transition-all duration-200', mobileOpen ? '-rotate-45 -translate-y-2' : '']" />
                </div>
            </button>
        </div>

        <!-- Mobile menu -->
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="mobileOpen"
                class="md:hidden border-t border-paper-border bg-white px-4 py-3 flex flex-col gap-1">
                <RouterLink to="/" @click="mobileOpen = false" class="px-3 py-2.5 rounded-lg text-sm font-medium text-ink-soft hover:bg-paper-warm hover:text-ink transition-colors">
                    Explore</RouterLink>
                <template v-if="auth.isAuthenticated">
                    <RouterLink to="/write" @click="mobileOpen = false" class="px-3 py-2.5 rounded-lg text-sm font-medium text-ink-soft hover:bg-paper-warm hover:text-ink transition-colors">
                        Write Article</RouterLink>
                    <RouterLink to="/dashboard" @click="mobileOpen = false" class="px-3 py-2.5 rounded-lg text-sm font-medium text-ink-soft hover:bg-paper-warm hover:text-ink transition-colors">
                        My Articles</RouterLink>
                    <RouterLink v-if="auth.user?.role === 'admin'" to="/admin/users" @click="mobileOpen = false" class="px-3 py-2.5 rounded-lg text-sm font-medium text-ink-soft hover:bg-paper-warm hover:text-ink transition-colors">
                        Manage Users</RouterLink>
                    <RouterLink to="/profile" @click="mobileOpen = false" class="px-3 py-2.5 rounded-lg text-sm font-medium text-ink-soft hover:bg-paper-warm hover:text-ink transition-colors">
                        Profile</RouterLink>
                    <button @click="handleLogout" class="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">Sign out</button>
                </template>
                <template v-else>
                    <RouterLink to="/login" @click="mobileOpen = false" class="px-3 py-2.5 rounded-lg text-sm font-medium text-ink-soft hover:bg-paper-warm hover:text-ink transition-colors">
                        Sign in</RouterLink>
                    <RouterLink to="/register" @click="mobileOpen = false" class="px-3 py-2.5 rounded-lg text-sm font-medium text-ink-soft hover:bg-paper-warm hover:text-ink transition-colors">
                        Get started</RouterLink>
                </template>
            </div>
        </Transition>
    </header>

    <BaseModal v-model="showLogoutModal" title="Sign out?" description="You will need to sign in again to access your dashboard and profile." confirm-text="Sign out" cancel-text="Cancel" @confirm="confirmLogout" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from './ui/BaseButton.vue'
import BaseAvatar from './ui/BaseAvatar.vue'
import BaseModal from './ui/BaseModal.vue'
import Brand from '@/assets/images/Sourcedev2.png'

const auth = useAuthStore()
const router = useRouter()
const dropdownOpen = ref(false)
const mobileOpen = ref(false)
const showLogoutModal = ref(false)
const dropdownRef = ref<HTMLElement>()

const handleLogout = () => {
    showLogoutModal.value = true
}

const confirmLogout = () => {
    auth.logout()
    dropdownOpen.value = false
    mobileOpen.value = false
    router.push('/')
}

const onClickOutside = (e: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) dropdownOpen.value = false
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>