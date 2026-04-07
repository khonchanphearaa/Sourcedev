<template>
  <div class="auth-wrapper">
    <div class="otp-card">
      <div class="header">
        <div class="icon-orb">
          <img src="@/assets/images/Sourcedev2.png" alt="Logo" class="gopher-logo" />
        </div>
        <h1>Security Verification</h1>
        <p class="subtitle">
          To protect your account, we’ve sent a unique<br /> 
          4-digit confirmation code to:
        </p>
        <span class="user-badge">{{ email || 'your email' }}</span>
      </div>

      <div class="otp-input-group">
        <input 
          v-for="(digit, index) in 4" 
          :key="index"
          ref="inputRefs"
          v-model="otp[index]" 
          type="text" 
          class="otp-field" 
          maxlength="1" 
          placeholder="•"
          inputmode="numeric"
          @input="handleInput($event, index)"
          @keydown.delete="handleDelete(index)"
        />
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <div class="action-stack">
        <BaseButton
          class="btn-confirm" 
          :loading="loading" 
          @click="verifyOTP"
        >
          Confirm Code
        </BaseButton>
        
        <div class="footer-links">
          <p>Didn't get the code? <a href="#" @click.prevent="resendOTP" class="resend-link">Resend Code</a></p>
          <hr class="divider" />
          <router-link to="/login" class="back-link">
             <i class="bx bx-left-arrow-alt"></i> Back to Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/composables/useApi'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const email = ref('')
const loading = ref(false)
const error = ref('')
const otp = ref(['', '', '', ''])
const inputRefs = ref([])
const savedOtp = ref('')

const handleInput = (e, index) => {
  const val = e.target.value
  if (val && index < 3) {
    inputRefs.value[index + 1].focus()
  }
}

const handleDelete = (index) => {
  if (!otp.value[index] && index > 0) {
    inputRefs.value[index - 1].focus()
  }
}

const verifyOTP = async () => {
  const code = otp.value.join('')
  
  if (code.length !== 4) {
    error.value = 'Please enter a valid 4-digit code.'
    return
  }
  loading.value = true
  error.value = ''
  
  try {
    const res = await api.post('/otp/verify-otp', {
      email: email.value,
      otp: code
    })
    console.log("Full Response:", res);
    const isSuccessful = res?.status === 200 || res?.status === 201 || res?.data?.success === true;

    if (isSuccessful) {
      const token = res?.data?.token || localStorage.getItem('token');
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('temp_otp', code);
      router.push('/reset-password');
    } else {
      error.value = res?.data?.message || 'Invalid verification code';
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Connection error or invalid code';
    console.error("Path attempted:", err.config?.url);
  } finally {
    loading.value = false;
    if (error.value) {
      setTimeout(() => { error.value = '' }, 3000);
    }
  }
}

onMounted(() => {
  email.value = localStorage.getItem('email') || '';
  savedOtp.value = localStorage.getItem('temp_otp') || '';
  console.log("OTP retrieved for reset:", savedOtp.value);
})
</script>


<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fcfdfe;
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.otp-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  padding: 50px 40px;
  border-radius: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
  text-align: center;
}


.icon-orb {
  width: 80px;
  height: 80px;
  background: #f0f4ff;
  border-radius: 20px; /* Squircle shape */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.gopher-logo {
  width: 50px;
  height: auto;
}

h1 {
  font-size: 26px;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 15px;
  color: #718096;
  line-height: 1.6;
}

.user-badge {
  display: inline-block;
  margin-top: 10px;
  background: #eff6ff;
  color: #1e293b;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
}

/* OTP Inputs (4 Digits) */
.otp-input-group {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 40px 0;
}

.otp-field {
  width: 60px;
  height: 70px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  background: #fff;
  transition: all 0.2s ease;
}

.otp-field:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

/* Buttons & Actions */
.btn-confirm {
  width: 100%;
  padding: 18px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-confirm:hover {
  opacity: 0.85;
}

.footer-links {
  margin-top: 24px;
  font-size: 14px;
  color: #64748b;
}

.resend-link {
  color: #6366f1;
  font-weight: 600;
  text-decoration: none;
}

.divider {
  border: 0;
  border-top: 1px solid #f1f5f9;
  margin: 25px 0;
}

.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  color: #64748b;
}
.error-msg {
  color: #ef4444;
  font-size: 14px;
  margin-top: -25px;
  margin-bottom: 20px;
  font-weight: 500;
}
</style>