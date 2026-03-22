<template>
    <AuthCard title="Create New Password" subtitle="Sign in to continue writing">
        <div class="flex flex-col gap-5">
            <BaseAlert :message="error" />
            <BaseInput v-model="email" type="email" label="Email" placeholder="you@example.com" />
            <BaseInput v-model="newpassword" type="password" label="New Password" placeholder="••••••••" @keyup.enter="resetPassword"/>
            <div class="flex items-start group cursor-pointer">
                <div class="flex items-center h-6">
                    <input id="terms" type="checkbox"
                        class="w-4.5 h-4.5 text-primary border-slate-300 rounded shadow-sm focus:ring-primary/20 focus:ring-offset-0 transition-colors cursor-pointer">
                </div>
                <div class="ml-3 text-sm leading-6">
                    <label for="terms" class="text-slate-500 cursor-pointer select-none">
                        I agree to the
                        <a href="#"
                            class="font-semibold text-primary hover:text-primary-dark underline-offset-4 hover:underline transition-all">
                            Terms and Conditions
                        </a>
                    </label>
                </div>
            </div>
            <BaseButton variant="primary" size="lg" :loading="auth.loading" @click="resetPassword" class="w-full mt-1">
                Reset Password
            </BaseButton>
        </div>
    </AuthCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthCard from '@/components/AuthCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import api from '@/composables/useApi'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const newpassword = ref('')
const error = ref('')
let loading = ref(false)
const savedOtp = ref('')


const resetPassword = async () => {
    if (!newpassword.value || newpassword.value.length < 8) {
        error.value = "Password must be at least 8 characters.";
        return;
    }

    const termsChecked = (document.getElementById('terms') as HTMLInputElement)?.checked;
    if (!termsChecked) {
        error.value = "You must agree to the terms and conditions.";
        return;
    }
    loading.value = true;
    error.value = ''; 

    try {
        const payload = { 
            email: email.value,
            otp: String(savedOtp.value), // Force string format
            newPassword: newpassword.value   // Try 'password' key
        };
        const res = await api.post('/otp/reset-password', payload);
        if (res?.status === 200 || res?.data?.success) {
            localStorage.removeItem('email');
            localStorage.removeItem('temp_otp');
            router.push('/');
        }
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Reset failed. Check console.';
        console.error('Server 400 details:', err.response?.data);
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    email.value = localStorage.getItem('email') || ''
    savedOtp.value = localStorage.getItem('temp_otp') || '' 
})

</script>
