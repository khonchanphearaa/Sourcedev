<template>
    <div :class="['flex items-center justify-center', fullPage ? 'min-h-[40vh]' : '']">
        <div :class="['rounded-full animate-spin border-2 border-paper-border border-t-ink', sizeClasses[size]]" />
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    size?: 'sm' | 'md' | 'lg'
    fullPage?: boolean
}>(), { size: 'md', fullPage: false })

const sizeClasses: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
}
</script>