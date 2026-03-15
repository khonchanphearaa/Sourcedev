<template>
    <div class="max-w-5xl mx-auto px-6 py-12">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
                <h1 class="font-serif text-3xl text-ink">My Articles</h1>
                <p class="text-sm text-ink-muted font-sans mt-1">Manage and track your writing</p>
            </div>
            <RouterLink to="/write">
                <BaseButton variant="accent">✦ Write New Article</BaseButton>
            </RouterLink>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-10">
            <div v-for="stat in stats" :key="stat.label"
                class="bg-white rounded-xl border border-paper-border p-5 text-center">
                <p class="font-serif text-4xl font-bold text-ink">{{ stat.value }}</p>
                <p class="text-sm text-ink-muted font-sans mt-1">{{ stat.label }}</p>
            </div>
        </div>

        <!-- Content -->
        <BaseSpinner v-if="loading" full-page />

        <div v-else-if="articles.length === 0" class="text-center py-20 text-ink-muted font-sans">
            <p class="text-lg mb-2">No articles yet.</p>
            <RouterLink to="/write" class="text-accent font-medium hover:underline">Write your first one →</RouterLink>
        </div>

        <div v-else class="flex flex-col gap-4">
            <div v-for="article in articles" :key="article._id"
                class="bg-white rounded-xl border border-paper-border p-5 flex gap-5 items-start hover:shadow-sm transition-shadow">
                <!-- Thumbnail -->
                <div v-if="article.coverImage" class="w-20 h-20 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                    <img :src="article.coverImage" :alt="article.title" class="w-full h-full object-cover" />
                </div>

                <!-- Body -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 mb-2">
                        <StatusBadge :status="article.status" />
                        <span class="text-xs text-ink-muted font-sans">{{ formatShort(article.updatedAt) }}</span>
                    </div>
                    <h3 class="font-serif font-semibold text-base text-ink truncate mb-1">{{ article.title }}</h3>
                    <p class="text-sm text-ink-muted line-clamp-1 mb-3 font-sans">{{ article.excerpt }}</p>
                    <div class="flex items-center gap-4 text-xs text-ink-muted font-sans">
                        <span>{{ article.readTime }} min read</span>
                        <span>{{ article.views }} views</span>
                        <div class="flex gap-1.5">
                            <BaseTag v-for="tag in article.tags.slice(0, 3)" :key="tag">{{ tag }}</BaseTag>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col gap-2 shrink-0">
                    <RouterLink v-if="article.status === 'published'" :to="`/article/${article.slug}`" >
                        <BaseButton variant="ghost" size="sm">View</BaseButton>
                    </RouterLink>
                    <RouterLink :to="`/edit/${article._id}`">
                        <BaseButton variant="outline" size="sm">Edit</BaseButton>
                    </RouterLink>
                    <BaseButton variant="danger" size="sm" @click="remove(article._id)">Delete</BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/composables/useApi'
import { useDate } from '@/composables/useDate'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import type { Article } from '@/types'

const { formatShort } = useDate()
const articles = ref<Article[]>([])
const loading = ref(true)

const stats = computed(() => [
    { label: 'Published', value: articles.value.filter(a => a.status === 'published').length },
    { label: 'Drafts', value: articles.value.filter(a => a.status === 'draft').length },
    { label: 'Total Views', value: articles.value.reduce((s, a) => s + a.views, 0) },
])

const remove = async (id: string) => {
    if (!confirm('Delete this article permanently?')) return
    await api.delete(`/articles/${id}`)
    articles.value = articles.value.filter(a => a._id !== id)
}

onMounted(async () => {
    try {
        const { data } = await api.get('/articles/my')
        articles.value = Array.isArray(data) ? data : (Array.isArray(data?.articles) ? data.articles : [])
    } catch {
        articles.value = []
    } finally {
        loading.value = false
    }
})
</script>