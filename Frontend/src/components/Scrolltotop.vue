<template>
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
        <button v-if="visible" @click="scrollToTop"
            class="fixed bottom-8 cursor-pointer right-8 z-50 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border active:scale-95 transition-all duration-200 flex items-center justify-center"
            aria-label="Scroll to top">
            <ChevronUp :size="25" />
        </button>
    </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronUp } from 'lucide-vue-next';

const visible = ref(false)

const onScroll = () => {
    visible.value = window.scrollY > 300
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>