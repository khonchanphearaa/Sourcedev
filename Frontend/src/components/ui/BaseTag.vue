<template>
    <component :is="to ? 'RouterLink' : (clickable ? 'button' : 'span')" :to="to" :class="[
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium font-sans border transition-all duration-150',
        active
            ? 'bg-accent-light text-accent border-accent'
            : 'bg-paper-warm text-ink-soft border-paper-border hover:bg-accent-light hover:text-accent hover:border-accent',
        (clickable || to) ? 'cursor-pointer' : '']">
        <slot />
    </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    active?: boolean
    clickable?: boolean
    to?: string
}>(), { active: false, clickable: false })
</script>