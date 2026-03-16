<template>
    <div>
        <BaseSpinner v-if="loading" full-page />

        <div v-else-if="article">
            <!-- Cover -->
            <div v-if="article.coverImage" class="max-h-110 overflow-hidden">
                <img :src="article.coverImage" :alt="article.title" class="w-full h-full object-cover" />
            </div>

            <div class="max-w-2xl mx-auto px-6">
                <!-- Header -->
                <header class="pt-12 pb-8 border-b border-paper-border">
                    <!-- Tags -->
                    <div class="flex gap-2 flex-wrap mb-5">
                        <BaseTag v-for="tag in article.tags" :key="tag" :to="`/?tag=${tag}`">{{ tag }}</BaseTag>
                    </div>

                    <h1 class="font-serif text-4xl sm:text-5xl text-ink leading-tight mb-4">{{ article.title }}</h1>
                    <p class="font-serif text-xl text-ink-muted italic leading-relaxed mb-6">{{ article.excerpt }}</p>

                    <!-- Author row -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <BaseAvatar :name="article.author?.name" size="md" />
                            <div>
                                <p class="font-medium text-sm text-ink">{{ article.author?.name }}</p>
                                <p v-if="article.author?.bio" class="text-xs text-ink-muted mt-0.5">{{
                                    article.author.bio }}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-ink-muted font-sans">
                            <span>{{ formatDate(article.createdAt) }}</span>
                            <span class="text-paper-border">·</span>
                            <span>{{ article.readTime }} min read</span>
                            <span class="text-paper-border">·</span>
                            <span>{{ article.views }} views</span>
                        </div>
                    </div>
                </header>

                <!-- Edit button -->
                <div v-if="isAuthor" class="mt-5">
                    <RouterLink :to="`/edit/${article._id}`">
                        <BaseButton variant="outline" size="sm">✏ Edit article</BaseButton>
                    </RouterLink>
                </div>

                <!-- Content -->
                <div class="prose prose-inkwell max-w-none py-5" v-html="renderedContent" />
                <span class="text-12px font-bold text-ink">View source codes</span>
                <p v-if="article.linkGithub" class="mt-2">
                    <a :href="article.linkGithub" target="_blank" rel="noopener noreferrer"
                        class="inline-flex items-center transition-colors hover:text-[#D97257]">
                        <Github :size="20" />
                    </a>
                    <CommentSection :article-id="article._id"/>
                </p>
                <div class="border-t border-paper-border pb-16 mt-10" />
            </div>
        </div>

        <!-- Not found -->
        <div v-else class="max-w-2xl mx-auto px-6 py-24 text-center">
            <h2 class="font-serif text-2xl text-ink mb-3">Article not found</h2>
            <RouterLink to="/">
                <BaseButton variant="outline">← Back home</BaseButton>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { Github } from 'lucide-vue-next';
import api from '@/composables/useApi'
import { useAuthStore } from '@/stores/auth'
import { useDate } from '@/composables/useDate'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import CommentSection from './comments/Commentsection.vue'
import type { Article } from '@/types'

const route = useRoute()
const auth = useAuthStore()
const { formatDate } = useDate()
const article = ref<Article | null>(null)
const loading = ref(true)

const isAuthor = computed(() => {
    if (!auth.user?.id) return false
    if (auth.user.role === 'admin') return true

    const authorId = (article.value?.author as { id?: string; _id?: string })
    return auth.user.id === authorId?.id || auth.user.id === authorId?._id
})

const renderedContent = computed(() => article.value?.content ? marked(article.value.content) as string : '')

onMounted(async () => {
    try {
        const { data } = await api.get(`/articles/${route.params.slug}`)
        article.value = (data?.article ?? data) as Article
    } finally {
        loading.value = false
    }
})
</script>