<template>
    <footer class="mt-20 border-t border-paper-border">
        <div class="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
                <div class="flex items-center">
                    <img :src="Brand" alt="Sourcedev-logo" class="h-10 w-auto object-contain" />
                    <span class="text-lg font-serif font-semibold text-ink">Sourcedev</span>
                </div>

                <p class="mt-1 text-sm text-ink-muted">A quiet place for thoughtful writing.</p>
            </div>
            <nav class="flex gap-6">
                <RouterLink to="/" class="text-sm text-ink-muted hover:text-ink transition-colors">Explore</RouterLink>
                <RouterLink v-if="auth.user?.role === 'admin'" to="/write" class="text-sm text-ink-muted hover:text-ink transition-colors">Write</RouterLink>
                <RouterLink to="/aboutMe" class="text-sm text-ink-muted hover:text-ink transition-colors">About Me</RouterLink>
            </nav>
        </div>
        <div class="border-t border-paper-border">
            <p class="max-w-5xl mx-auto px-6 py-4 text-xs text-ink-muted">
                © {{ new Date().getFullYear() }} Sourcedev. Developed by @khonchanphearaa.
            </p>
        </div>
    </footer>
</template>
<script setup lang="ts">
import Brand from '@/assets/images/Sourcedev2.png'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>