<template>
    <RouterLink :to="`/article/${article.slug}`"
        class="group flex flex-col bg-white rounded-xl border border-paper-border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <!-- Cover image -->
        <div v-if="article.coverImage" class="h-48 overflow-hidden">
            <img :src="article.coverImage" :alt="article.title" loading="lazy"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>

        <div class="flex flex-col flex-1 p-5 gap-3">
            <!-- Author + date -->
            <div class="flex items-center gap-2 text-xs text-ink-muted font-sans">
                <BaseAvatar :name="article.author?.name" size="xs" />
                <span class="font-medium text-ink-soft">{{ article.author?.name }}</span>
                <span class="text-paper-border">·</span>
                <span>{{ formatShort(article.createdAt) }}</span>
            </div>

            <!-- Title -->
            <h2
                class="font-serif font-semibold text-lg text-ink leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                {{ article.title }}
            </h2>

            <!-- Excerpt -->
            <p class="text-sm text-ink-muted leading-relaxed line-clamp-2 flex-1">{{ article.excerpt }}</p>

            <!-- Footer -->
            <div class="flex items-center justify-between gap-2 pt-1 border-t border-paper-border/60">
                <div class="flex gap-1.5 flex-wrap">
                    <BaseTag v-for="tag in article.tags.slice(0, 3)" :key="tag">{{ tag }}</BaseTag>
                </div>
                <div class="flex items-center gap-3 text-xs text-ink-muted shrink-0 font-sans">
                    <span>{{ article.readTime }}m read</span>
                    <span>{{ article.views }} views</span>
                </div>
            </div>
        </div>
    </RouterLink>
</template>

<script setup lang="ts">
import type { Article } from '@/types';
import { useDate } from '@/composables/useDate';
import BaseAvatar from './ui/BaseAvatar.vue'
import BaseTag from './ui/BaseTag.vue';

defineProps<{ article: Article }>()
const { formatShort } = useDate()
</script>