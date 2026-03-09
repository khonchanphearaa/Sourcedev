<template>
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center text-center px-6">
        <div>
            <img :src="imagesNotfound" alt="404 Not Found" class="mx-auto mb-4" />
            <p class="text-ink-muted font-sans mb-8">The page you're looking for doesn't exist.</p>
            <RouterLink to="/">
                <BaseButton variant="outline">← Back to home</BaseButton>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue';
import imagesNotfound from '../assets/images/404Notfound.jpg';
</script>