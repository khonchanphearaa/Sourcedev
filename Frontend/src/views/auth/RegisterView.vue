<template>
    <AuthCard title="Start writing today" subtitle="Create your free account">
        <div class="flex flex-col gap-5">
            <BaseAlert :message="error" />
            <BaseInput v-model="name" label="Full name" placeholder="Jane Smith" />
            <BaseInput v-model="email" type="email" label="Email" placeholder="you@example.com" />
            <BaseInput v-model="password" type="password" label="Password" placeholder="At least 6 characters" @keyup.enter="submit" />
            <BaseButton variant="primary" size="lg" :loading="auth.loading" @click="submit" class="w-full mt-1">
                Create account
            </BaseButton>
        </div>
        <p class="text-center text-sm text-ink-muted font-sans mt-6">
            Already have an account?
            <RouterLink to="/login" class="text-accent font-medium hover:underline ml-1">Sign in</RouterLink>
        </p>
    </AuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthCard from '@/components/AuthCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const auth = useAuthStore()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

const submit = async () => {
    error.value = ''
    if (!name.value || !email.value || !password.value) { error.value = 'Please fill in all fields.'; return }
    if (password.value.length < 6) { error.value = 'Password must be at least 6 characters.'; return }
    const result = await auth.register(name.value, email.value, password.value)
    if (result.success) router.push('/dashboard')
    else error.value = result.message || 'Registration failed'
}
</script>