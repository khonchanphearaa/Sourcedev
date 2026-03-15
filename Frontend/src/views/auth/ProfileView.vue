<template>
    <div class="max-w-2xl mx-auto px-6 py-12">
        <h1 class="font-serif text-3xl text-ink mb-8">Your Profile</h1>

        <BaseAlert :message="error" class="mb-5" />
        <BaseAlert :message="success ? 'Profile updated successfully!' : ''" variant="success" class="mb-5" />

        <!-- Profile card -->
        <div class="bg-white border border-paper-border rounded-xl p-6 flex items-center gap-4 mb-8">
            <BaseAvatar :name="auth.user?.name ?? ''" :src="auth.user?.avatar" size="lg" />
            <div>
                <p class="font-semibold text-ink">{{ auth.user?.name }}</p>
                <p class="text-sm text-ink-muted font-sans mt-0.5">{{ auth.user?.email }}</p>
            </div>
        </div>

        <!-- Form -->
        <div class="flex flex-col gap-6">
            <BaseInput v-model="form.name" label="Name" placeholder="Your name" />
            <BaseInput v-model="form.bio" type="textarea" label="Bio" placeholder="Tell readers about yourself…" :maxlength="200" :rows="3" :show-count="true" :optional="true" />
            <BaseInput v-model="form.avatar" label="Avatar URL" placeholder="https://example.com/photo.jpg" :optional="true" />
            <div>
                <BaseButton variant="primary" :loading="saving" @click="save">Save changes</BaseButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import BaseAvatar from '@/components/ui/BaseAvatar.vue'

const auth = useAuthStore()
const saving = ref(false)
const success = ref(false)
const error = ref('')
const form = ref({ name: '', bio: '', avatar: '' })

onMounted(() => {
    form.value = { name: auth.user?.name || '', bio: auth.user?.bio || '', avatar: auth.user?.avatar || '' }
})

const save = async () => {
    error.value = ''; success.value = false
    if (!form.value.name.trim()) { error.value = 'Name is required.'; return }
    saving.value = true
    try {
        await auth.updateProfile(form.value)
        success.value = true
        setTimeout(() => success.value = false, 3000)
    } catch {
        error.value = 'Failed to update profile.'
    } finally {
        saving.value = false
    }
}
</script>