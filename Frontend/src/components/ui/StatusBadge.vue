<template>
    <span :class="['inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium font-sans', classes[status]]">
        <span :class="['w-1.5 h-1.5 rounded-full', dotClasses[status]]" />
        {{ status === 'published' ? 'Published' : 'Draft' }}
    </span>
</template>

<script setup lang="ts">
defineProps<{ status: 'draft' | 'published' }>()

const classes: Record<string, string> = {
    published: 'bg-green-50 text-green-700 border border-green-200',
    draft: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
}
const dotClasses: Record<string, string> = {
    published: 'bg-green-500',
    draft: 'bg-yellow-500',
}
</script>