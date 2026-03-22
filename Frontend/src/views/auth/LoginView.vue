<template>
    <AuthCard title="Welcome back" subtitle="Sign in to continue writing">
        <div class="flex flex-col gap-5">
            <BaseAlert :message="error" />
            <BaseInput v-model="email" type="email" label="Email" placeholder="you@example.com" />
            <BaseInput v-model="password" type="password" label="Password" placeholder="••••••••" @keyup.enter="submit" />
            <div class="flex justify-end -mt-2">
                <RouterLink to="/forgot-password" class="text-sm text-accent hover:underline">Forgot password?</RouterLink>
            </div>
            <BaseButton variant="primary" size="lg" :loading="auth.loading" @click="submit" class="w-full mt-1">
                Sign in
            </BaseButton>
        </div>
        <p class="text-center text-sm text-ink-muted font-sans mt-6">
            Don't have an account?
            <RouterLink to="/register" class="text-accent font-medium hover:underline ml-1">Create one</RouterLink>
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
const email = ref('')
const password = ref('')
const error = ref('')

const submit = async () => {
    error.value = ''
    if (!email.value || !password.value) { error.value = 'Please fill in all fields.'; return }
    const result = await auth.login(email.value, password.value)
    if (result.success) router.push('/dashboard')
    else error.value = result.message || 'Login failed'
}
</script>