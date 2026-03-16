<template>
    <div class="about">

        <section class="relative overflow-hidden border-b border-paper-border bg-ink">
            <div class="absolute inset-0 opacity-5">
                <div class="absolute top-0 left-0 w-full h-full"
                    style="background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.3) 39px, rgba(255,255,255,0.3) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.3) 39px, rgba(255,255,255,0.3) 40px);">
                </div>
            </div>
            <div class="relative max-w-5xl mx-auto px-6 py-24 sm:py-32">
                <div class="max-w-2xl">
                    <p class="text-accent font-sans text-sm font-semibold tracking-widest uppercase mb-6">About Sourcedev
                    </p>
                    <h1 class="font-serif text-5xl sm:text-6xl text-paper leading-tight mb-6">
                        Where ideas find<br /><em class="text-accent">Sourcedev.</em>
                    </h1>
                    <p class="font-sans text-lg text-paper/70 leading-relaxed max-w-xl">
                        Sourcedev is a platform built for writers who believe in the power of words — a distraction-free
                        space to think deeply, write clearly, and share meaningfully.
                    </p>
                </div>
            </div>
        </section>

        <!-- Mission -->
        <section class="max-w-5xl mx-auto px-6 py-20">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <p class="text-accent font-sans text-xs font-semibold tracking-widest uppercase mb-4">Our Mission
                    </p>
                    <h2 class="font-serif text-4xl text-ink leading-tight mb-6"> Writing deserves a better home. </h2>
                    <p class="font-sans text-ink-muted leading-relaxed mb-4">
                        We built Inkwell because great writing kept getting buried under noise — ads, algorithmic feeds,
                        engagement tricks designed to distract rather than illuminate.
                    </p>
                    <p class="font-sans text-ink-muted leading-relaxed">
                        Our mission is simple: give writers a clean, respectful space and give readers a reliable place
                        to find ideas worth their time.
                    </p>
                </div>
                <div class="relative">
                    <div class="bg-paper-warm border border-paper-border rounded-2xl p-8">
                        <span class="font-serif text-8xl text-accent leading-none block mb-4">"</span>
                        <p class="font-serif text-xl text-ink leading-relaxed italic">
                            The pen is the tongue of the mind.
                        </p>
                        <p class="font-sans text-sm text-ink-muted mt-4">— Miguel de Cervantes</p>
                    </div>

                    <div
                        class="absolute -bottom-4 -right-4 w-24 h-24 bg-accent-light rounded-2xl -z-10 border border-accent/20">
                    </div>
                </div>
            </div>
        </section>

        <div class="max-w-5xl mx-auto px-6">
            <div class="border-t border-paper-border"></div>
        </div>

        <section class="max-w-5xl mx-auto px-6 py-20">
            <div class="text-center mb-14">
                <p class="text-accent font-sans text-xs font-semibold tracking-widest uppercase mb-3">What we stand for
                </p>
                <h2 class="font-serif text-4xl text-ink">Our values</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="value in values" :key="value.title"
                    class="group bg-white border border-paper-border rounded-2xl p-7 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div
                        class="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                        {{ value.icon }}
                    </div>
                    <h3 class="font-serif text-xl text-ink mb-3">{{ value.title }}</h3>
                    <p class="font-sans text-sm text-ink-muted leading-relaxed">{{ value.description }}</p>
                </div>
            </div>
        </section>

        <div class="max-w-5xl mx-auto px-6">
            <div class="border-t border-paper-border"></div>
        </div>

        <section class="max-w-5xl mx-auto px-6 py-20">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div v-for="stat in stats" :key="stat.label" class="text-center">
                    <p class="font-serif text-5xl font-bold text-ink mb-2">{{ stat.value }}</p>
                    <p class="font-sans text-sm text-ink-muted">{{ stat.label }}</p>
                </div>
            </div>
        </section>

        <div class="max-w-5xl mx-auto px-6">
            <div class="border-t border-paper-border"></div>
        </div>

        <section class="max-w-5xl mx-auto px-6 py-20">
            <div class="text-center mb-14">
                <p class="text-accent font-sans text-xs font-semibold tracking-widest uppercase mb-3">How it works</p>
                <h2 class="font-serif text-4xl text-ink">Simple by design</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="(step, i) in steps" :key="step.title" class="relative">
                    <!-- Step number -->
                    <div class="flex items-center gap-4 mb-5">
                        <div
                            class="w-10 h-10 rounded-full bg-ink text-paper font-serif font-bold text-lg flex items-center justify-center shrink-0">
                            {{ i + 1 }}
                        </div>
                        <div v-if="i < steps.length - 1"
                            class="hidden md:block flex-1 border-t-2 border-dashed border-paper-border"></div>
                    </div>
                    <h3 class="font-serif text-xl text-ink mb-3">{{ step.title }}</h3>
                    <p class="font-sans text-sm text-ink-muted leading-relaxed">{{ step.description }}</p>
                </div>
            </div>
        </section>

        <!-- Divider -->
        <div class="max-w-5xl mx-auto px-6">
            <div class="border-t border-paper-border"></div>
        </div>

        <!-- Roles -->
        <section class="max-w-5xl mx-auto px-6 py-20">
            <div class="text-center mb-14">
                <p class="text-accent font-sans text-xs font-semibold tracking-widest uppercase mb-3">Platform roles</p>
                <h2 class="font-serif text-4xl text-ink">Who's on Sourcedev</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Reader -->
                <div class="bg-paper-warm border border-paper-border rounded-2xl p-8">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-10 h-10 rounded-full bg-paper-border flex items-center justify-center text-lg">📖
                        </div>
                        <div>
                            <h3 class="font-serif text-xl text-ink">Reader</h3>
                            <span
                                class="text-xs font-semibold text-ink-muted font-sans bg-paper-border px-2 py-0.5 rounded-full">Free</span>
                        </div>
                    </div>
                    <ul class="space-y-3">
                        <li v-for="item in readerPerms" :key="item"
                            class="flex items-center gap-3 font-sans text-sm text-ink-soft">
                            <span
                                class="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs shrink-0">✓</span>
                            {{ item }}
                        </li>
                    </ul>
                    <div class="mt-6 pt-6 border-t border-paper-border">
                        <RouterLink to="/register">
                            <BaseButton variant="outline" size="sm" class="w-full justify-center">
                                Create free account
                            </BaseButton>
                        </RouterLink>
                    </div>
                </div>

                <!-- Admin -->
                <div class="bg-ink border border-ink rounded-2xl p-8 relative overflow-hidden">
                    <div
                        class="absolute top-4 right-4 text-xs font-semibold bg-accent text-white px-2.5 py-1 rounded-full font-sans">
                        Admin</div>
                    <div
                        class="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 translate-y-8">
                    </div>
                    <div class="flex items-center gap-3 mb-6">
                        <img :src="Brand" alt="Sourcedev-logo" class="h-12 w-auto object-contain" />
                        <div>
                            <h3 class="font-serif text-xl text-paper">Admin</h3>
                            <span class="text-xs font-semibold text-paper/50 font-sans">Full access</span>
                        </div>
                    </div>
                    <ul class="space-y-3">
                        <li v-for="item in adminPerms" :key="item"
                            class="flex items-center gap-3 font-sans text-sm text-paper/80">
                            <span
                                class="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs shrink-0">✓</span>
                            {{ item }}
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- CTA -->
        <section class="bg-paper-warm border-y border-paper-border">
            <div class="max-w-5xl mx-auto px-6 py-20 text-center">
                <h2 class="font-serif text-4xl text-ink mb-5">Ready to start reading?</h2>
                <p class="font-sans text-ink-muted mb-8 max-w-md mx-auto">
                    Join Inkwell and discover thoughtful articles written by passionate people.
                </p>
                <div class="flex items-center justify-center gap-4 flex-wrap">
                    <RouterLink to="/register" v-if="!auth.isAuthenticated">
                        <BaseButton variant="primary" size="lg">Create free account</BaseButton>
                    </RouterLink>
                    <RouterLink to="/">
                        <BaseButton variant="outline" size="lg">Browse articles →</BaseButton>
                    </RouterLink>
                </div>
            </div>
        </section>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useArticleStore } from '@/stores/article'
import BaseButton from '@/components/ui/BaseButton.vue'
import Brand from '@/assets/images/Sourcedev2.png'

const auth = useAuthStore()
const articleStore = useArticleStore()

const articleCount = ref('...')
const userCount = ref('...')

onMounted(async () => {
    try {
        const total = await articleStore.getArticleCount()
        articleCount.value = total > 999 ? `${(total / 1000).toFixed(1)}k` : String(total)
    } catch { articleCount.value = '0' }
})

const stats = ref([
    { value: articleCount, label: 'Articles published' },
    { value: '100%', label: 'Ad-free reading' },
    { value: 'Markdown', label: 'Powered by' },
    { value: 'Open', label: 'Platform' },
])

const values = [
    {
        icon: '✦',
        title: 'Clarity over noise',
        description: 'No ads, no algorithmic feeds, no dark patterns. Just clean reading and writing with nothing getting in the way.',
    },
    {
        icon: '🖊',
        title: 'Writing first',
        description: 'Every design decision is made with the writer in mind. Distraction-free editing, Markdown support, live preview.',
    },
    {
        icon: '📖',
        title: 'Readers matter',
        description: 'Good writing deserves attentive readers. We optimize for depth and time spent, not clicks and pageviews.',
    },
    {
        icon: '🔒',
        title: 'Privacy respected',
        description: 'We collect only what is necessary to run the platform. Your data is never sold or used for advertising.',
    },
    {
        icon: '⚡',
        title: 'Fast & lightweight',
        description: 'Built with performance in mind. Pages load instantly so nothing interrupts the reading flow.',
    },
    {
        icon: '🌱',
        title: 'Always improving',
        description: 'We ship thoughtful improvements based on how writers and readers actually use the platform.',
    },
]

const steps = [
    {
        title: 'Create an account',
        description: 'Sign up for free in seconds. No credit card, no lengthy forms. Just a name, email, and password.',
    },
    {
        title: 'Read or write',
        description: 'Browse published articles as a reader, or get promoted to admin to start writing and publishing your own.',
    },
    {
        title: 'Grow your ideas',
        description: 'Tag your articles, track views, manage drafts, and build a library of your best thinking over time.',
    },
]

const readerPerms = [
    'Browse all published articles',
    'Filter articles by tag',
    'Read full article content',
    'Create a free account',
    'Edit your profile',
]

const adminPerms = [
    'Everything readers can do',
    'Write and publish articles',
    'Save articles as drafts',
    'Edit and delete articles',
    'Manage user roles',
    'Access the admin dashboard',
]
</script>