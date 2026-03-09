<template>
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-16">
        <div class="w-full max-w-md bg-white border border-paper-border rounded-2xl p-10 shadow-md">
            <RouterLink to="/"
                class="block font-serif font-semibold text-xl text-ink mb-8 hover:opacity-75 transition-opacity">
                ✒ Sourcedev
            </RouterLink>
            <h1 class="font-serif text-2xl text-ink mb-1">{{ title }}</h1>
            <p class="text-sm text-ink-muted mb-8 font-sans">{{ subtitle }}</p>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle: string }>()
</script>