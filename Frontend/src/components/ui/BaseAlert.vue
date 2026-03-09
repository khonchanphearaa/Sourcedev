<template>
    <div v-if="message" :class="['rounded-lg px-4 py-3 text-sm font-sans border', variantClasses[variant]]">
        {{ message }}
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    message?: string
    variant?: 'error' | 'success' | 'warning' | 'info'
}>(), { variant: 'error' })

const variantClasses: Record<string, string> = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
}
</script>