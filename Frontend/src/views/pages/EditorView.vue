<template>
    <div class="min-h-screen">
        <!-- Top bar -->
        <div class="sticky top-16 z-40 bg-paper/90 backdrop-blur border-b border-paper-border">
            <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
                <RouterLink to="/dashboard">
                    <BaseButton variant="ghost" size="sm">← Back</BaseButton>
                </RouterLink>
                <h1 class="font-sans font-semibold text-sm text-ink-soft hidden sm:block">
                    {{ isEditing ? 'Edit Article' : 'New Article' }}
                </h1>
                <div class="flex items-center gap-2">
                    <BaseButton variant="outline" size="sm" :disabled="saving" @click="submit('draft')">Save draft
                    </BaseButton>
                    <BaseButton variant="accent" size="sm" :loading="saving" @click="submit('published')">
                        {{ isEditing ? 'Update' : 'Publish' }}
                    </BaseButton>
                </div>
            </div>
        </div>

        <div class="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-7">
            <BaseAlert :message="error" />

            <!-- Cover image -->
            <BaseInput v-model="form.coverImage" label="Cover Image URL" placeholder="https://example.com/image.jpg" :optional="true" />
            <div v-if="form.coverImage" class="rounded-xl overflow-hidden max-h-56">
                <img :src="form.coverImage" alt="Cover preview" class="w-full h-full object-cover" />
            </div>

            <!-- Title -->
            <div>
                <textarea v-model="form.title" placeholder="Article title…" maxlength="150" rows="2"
                    class="w-full font-serif text-3xl sm:text-4xl font-bold text-ink bg-transparent border-none outline-none resize-none placeholder-paper-border leading-tight" />
            </div>

            <!-- Excerpt -->
            <BaseInput v-model="form.excerpt" type="textarea" label="Excerpt"
                placeholder="A brief, compelling summary of your article…" :maxlength="300" :rows="2" :show-count="true" />

            <!-- Tags -->
            <BaseInput v-model="tagsInput" label="Tags" placeholder="javascript, webdev, tutorial"
                hint="Separate tags with commas" :optional="true" />

            <!-- Content editor -->
            <div class="flex flex-col gap-2">
                <div class="flex items-center justify-between">
                    <label class="text-sm font-medium text-ink-soft font-sans">Content <span
                            class="text-ink-muted font-normal">(Markdown)</span></label>
                    <div
                        class="flex rounded-lg border border-paper-border overflow-hidden text-xs font-medium font-sans">
                        <button :class="['px-3 py-1.5 transition-colors', tab === 'write' ? 'bg-ink text-white' : 'bg-white text-ink-muted hover:bg-paper-warm']" @click="tab = 'write'">Write</button>
                        <button :class="['px-3 py-1.5 transition-colors', tab === 'preview' ? 'bg-ink text-white' : 'bg-white text-ink-muted hover:bg-paper-warm']" @click="tab = 'preview'">Preview</button>
                    </div>
                </div>
                <textarea v-if="tab === 'write'" v-model="form.content"
                    placeholder="Write your article in Markdown…&#10;&#10;# Heading&#10;**bold** _italic_&#10;> blockquote"
                    rows="22"
                    class="w-full px-4 py-3 border border-paper-border rounded-lg text-sm font-mono text-ink bg-white placeholder-paper-border focus:outline-none focus:border-ink transition-colors resize-y leading-relaxed" />
                <div v-else
                    class="min-h-100 prose prose-inkwell max-w-none border border-paper-border rounded-lg px-6 py-5 bg-white"
                    v-html="previewHtml" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import api from '@/composables/useApi'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const route = useRoute()
const router = useRouter()
const isEditing = computed(() => !!route.params.id)
const saving = ref(false)
const error = ref('')
const tab = ref<'write' | 'preview'>('write')
const tagsInput = ref('')
const form = ref({ title: '', excerpt: '', content: '', coverImage: '' })

const previewHtml = computed(() => marked(form.value.content || '') as string)

onMounted(async () => {
    if (isEditing.value) {
        try {
            const { data } = await api.get(`/articles/${route.params.id}`)
            const a = data.article
            form.value = { title: a.title, excerpt: a.excerpt, content: a.content, coverImage: a.coverImage || '' }
            tagsInput.value = a.tags.join(', ')
        } catch { error.value = 'Could not load article.' }
    }
})

const submit = async (status: 'draft' | 'published') => {
    error.value = ''
    if (!form.value.title.trim()) { error.value = 'Title is required.'; return }
    if (!form.value.excerpt.trim()) { error.value = 'Excerpt is required.'; return }
    if (!form.value.content.trim()) { error.value = 'Content is required.'; return }

    const tags = tagsInput.value.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
    saving.value = true
    try {
        if (isEditing.value) await api.put(`/articles/${route.params.id}`, { ...form.value, tags, status })
        else await api.post('/articles', { ...form.value, tags, status })
        router.push('/dashboard')
    } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } }
        error.value = e.response?.data?.message || 'Failed to save.'
    } finally {
        saving.value = false
    }
}
</script>