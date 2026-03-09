<template>
    <div :class="['rounded-full bg-ink text-paper flex items-center justify-center font-semibold font-serif shrink-0 select-none', sizeClasses[size]]">
        <img v-if="src" :src="src" :alt="name" class="w-full h-full object-cover rounded-full" />
        <span v-else>{{ initial }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    name: string
    src?: string
    size?: 'xs' | 'sm' | 'md' | 'lg'
}>(), { size: 'md' })

const initial = computed(() => props.name?.[0]?.toUpperCase() ?? '?')

const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
}
</script>