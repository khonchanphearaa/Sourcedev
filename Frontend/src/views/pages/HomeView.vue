<template>
    <div>
        <!-- Hero -->
        <section class="border-b border-paper-border bg-linear-to-br from-paper to-paper-warm">
            <div class="max-w-5xl mx-auto px-6 py-20">
                <h1 class="font-serif text-5xl sm:text-6xl text-ink leading-tight mb-5">
                    Ideas worth<br><em class="text-accent not-italic">writing about.</em>
                </h1>
                <p class="text-lg text-ink-muted max-w-lg mb-8 font-sans leading-relaxed">
                    A clean, distraction-free platform to write, publish, and share your thoughts with the world.
                </p>
                <div class="flex gap-3 flex-wrap">
                    <RouterLink v-if="!auth.isAuthenticated" to="/register">
                        <BaseButton variant="primary" size="lg">Start writing — it's free</BaseButton>
                    </RouterLink>
                    <RouterLink v-else to="/write">
                        <BaseButton variant="accent" size="lg">✦ Write new article</BaseButton>
                    </RouterLink>
                    <a href="#articles">
                        <BaseButton variant="outline" size="lg">Read stories</BaseButton>
                    </a>
                </div>
            </div>
        </section>

        <!-- Tag filters -->
        <section class="border-b border-paper-border">
            <div class="max-w-5xl mx-auto px-6 py-5 flex gap-2 flex-wrap">
                <BaseTag :active="!activeTag" :clickable="true" @click="activeTag = ''">All</BaseTag>
                <BaseTag v-for="t in tags" :key="t._id" :active="activeTag === t._id" :clickable="true"
                    @click="activeTag = t._id">
                    {{ t._id }}
                    <span class="bg-black/10 text-[10px] px-1.5 py-0.5 rounded-full">{{ t.count }}</span>
                </BaseTag>
            </div>
        </section>

        <!-- Articles -->
        <section id="articles" class="max-w-5xl mx-auto px-6 py-10">
            <BaseSpinner v-if="loading" full-page />

            <div v-else-if="articles.length === 0" class="text-center py-20 text-ink-muted font-sans">
                <p class="text-lg mb-2">No articles yet.</p>
                <RouterLink to="/write" class="text-accent font-medium hover:underline">Be the first to write one →
                </RouterLink>
            </div>

            <div v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ArticleCard v-for="article in articles" :key="article._id" :article="article" />
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 mt-12">
                    <BaseButton variant="outline" size="sm" :disabled="page <= 1" @click="page--">← Previous
                    </BaseButton>
                    <span class="text-sm text-ink-muted font-sans">Page {{ page }} of {{ totalPages }}</span>
                    <BaseButton variant="outline" size="sm" :disabled="page >= totalPages" @click="page++">Next →
                    </BaseButton>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import api from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'
import type { Article, Tag } from '@/types'

const auth = useAuthStore()
const articles = ref<Article[]>([])
const tags = ref<Tag[]>([])
const loading = ref(false)
const activeTag = ref('')
const page = ref(1)
const totalPages = ref(1)

const fetchArticles = async () => {
    loading.value = true
    try {
        const params: Record<string, unknown> = { page: page.value, limit: 9 }
        if (activeTag.value) params.tag = activeTag.value
        const { data } = await api.get('/articles', { params })
        articles.value = data.articles
        totalPages.value = data.pages
    } finally {
        loading.value = false
    }
}

const fetchTags = async () => {
    const { data } = await api.get('/articles/tags')
    tags.value = data.tags
}

watch(activeTag, () => { page.value = 1 })
watch([page, activeTag], fetchArticles)
onMounted(() => { fetchArticles(); fetchTags() })
</script>