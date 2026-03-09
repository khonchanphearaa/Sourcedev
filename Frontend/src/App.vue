<template>
  <div class="min-h-screen flex flex-col bg-paper">
    <AppNav />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppNav from '@/components/AppNav.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>