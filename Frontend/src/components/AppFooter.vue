<template>
    <footer class="mt-20 border-t border-paper-border">
        <div class="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-start gap-6">
            <div>
                <p class="font-serif font-semibold text-lg text-ink">✒ Sourcedev</p>
                <p class="mt-1 text-sm text-ink-muted">A quiet place for thoughtful writing.</p>
            </div>
            <nav class="flex gap-6">
                <RouterLink to="/" class="text-sm text-ink-muted hover:text-ink transition-colors">Explore</RouterLink>
                <RouterLink to="/write" class="text-sm text-ink-muted hover:text-ink transition-colors">Write
                </RouterLink>
            </nav>
        </div>
        <div class="border-t border-paper-border">
            <p class="max-w-5xl mx-auto px-6 py-4 text-xs text-ink-muted">
                © {{ new Date().getFullYear() }} Sourcedev. develop by @khonchanphearaa.
            </p>
        </div>
    </footer>
</template>