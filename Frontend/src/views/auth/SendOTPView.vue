<template>
    <AuthCard title="Forgot password?" subtitle="Enter your email and we'll send you an OTP">
        <div class="flex flex-col gap-5">
            <BaseAlert :message="error" />
            <BaseAlert :message="success" variant="success" />
            <BaseInput v-model="email" type="email" label="Email" placeholder="you@example.com" @keyup.enter="submit" />
            <BaseButton @click="handleOTP" variant="primary" size="lg" :loading="loading" class="w-full mt-1"> Send OTP </BaseButton>
        </div>
        <p class="text-center text-sm text-ink-muted font-sans mt-6"> Remembered your password?
            <RouterLink  to="/login" class="text-accent font-medium hover:underline ml-1">Sign in</RouterLink>
        </p>
    </AuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/composables/useApi'
import AuthCard from '@/components/AuthCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const success = ref('')
const email = ref('')
const authStore = useAuthStore();

const submit = async () => {
    error.value = ''
    success.value = ''
    if (!email.value) { error.value = 'Please enter your email.'; return }
    loading.value = true
    try {
        const result  = await authStore.sendOTP(email.value) 
        console.log(result);
        success.value = 'OTP sent! Check your inbox.'
    } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } }
        error.value = e.response?.data?.message || 'Failed to send OTP'
    } finally {
        loading.value = false
    }
}

const handleOTP = async () => {
  if (!email.value) {
    error.value = "Email is required";
    return;
  }

  loading.value = true;
  error.value = ""; 

  try {
    const result = await authStore.sendOTP(email.value);
    if (result?.success) {
      localStorage.setItem('email', email.value);
      router.push({ name: 'verifyOtp' });
    } else {
      error.value = result?.message || "Failed to send OTP"; 
    }
  } catch (err) {
    error.value = "A system error occurred. Please refresh.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
