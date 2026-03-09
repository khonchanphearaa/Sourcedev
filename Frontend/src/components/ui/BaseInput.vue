<template>
    <div class="flex flex-col gap-1.5">
        <label v-if="label" :for="id" class="text-sm font-medium text-ink-soft font-sans">
            {{ label }}
            <span v-if="optional" class="text-ink-muted font-normal ml-1">(optional)</span>
        </label>
        <textarea v-if="type === 'textarea'" :id="id" :value="modelValue" :placeholder="placeholder"
            :maxlength="maxlength" :rows="rows" :class="inputClasses" v-bind="$attrs"
            @input="handleTextareaInput" />
        <input v-else :id="id" :type="type" :value="modelValue" :placeholder="placeholder" :maxlength="maxlength"
            :class="inputClasses" v-bind="$attrs"
            @input="handleInput" />
        <div class="flex justify-between items-center" v-if="hint || (maxlength && showCount)">
            <span v-if="hint" class="text-xs text-ink-muted">{{ hint }}</span>
            <span v-if="maxlength && showCount" class="text-xs text-ink-muted ml-auto">{{ String(modelValue).length
                }}/{{ maxlength }}</span>
        </div>
        <p v-if="error" class="text-xs text-accent">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    modelValue: string
    label?: string
    id?: string
    type?: string
    placeholder?: string
    maxlength?: number
    rows?: number
    error?: string
    hint?: string
    optional?: boolean
    showCount?: boolean
}>(), {
    type: 'text',
    rows: 4,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
defineOptions({ inheritAttrs: false })

const handleTextareaInput = (e: Event) => emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
const handleInput = (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)

const inputClasses = 'w-full px-3.5 py-2.5 border border-paper-border rounded-lg text-sm bg-white text-ink placeholder-ink-muted focus:outline-none focus:border-ink transition-colors duration-150 font-sans resize-y'
</script>