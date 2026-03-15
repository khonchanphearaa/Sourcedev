<template>
    <component :is="tag"
        :class="[baseClasses, variantClasses[variant], sizeClasses[size], { 'opacity-50 cursor-not-allowed': disabled }]"
        :disabled="disabled || loading" v-bind="$attrs">
        <span v-if="loading"
            class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <slot/>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    tag?: string
}>(), {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    tag: 'button',
})

const baseClasses = 'inline-flex items-center justify-center gap-2 font-sans font-medium rounded-lg transition-all duration-200 whitespace-nowrap select-none cursor-pointer'

const variantClasses: Record<string, string> = {
    primary: 'bg-ink text-paper hover:bg-ink-soft active:scale-95 shadow-sm hover:shadow',
    accent: 'bg-accent text-white hover:bg-accent-hover active:scale-95 shadow-sm hover:shadow',
    outline: 'bg-transparent text-ink border border-paper-border hover:border-ink-muted hover:bg-paper-warm',
    ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-paper-warm',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95',
}

const sizeClasses: Record<string, string> = {
    sm: 'px-3.5 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
}
</script>