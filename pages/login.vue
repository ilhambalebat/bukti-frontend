<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const router = useRouter();
const { login, register, isLoading, authError, isLoggedIn } = useAuth();

const isRegisterTab = ref(false);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const localValidation = ref<string | null>(null);

onMounted(() => {
  if (isLoggedIn.value) {
    router.push('/');
  }
  if (route.query.tab === 'register') {
    isRegisterTab.value = true;
  }
});

const handleSubmit = async () => {
  localValidation.value = null;

  if (!email.value || !password.value) {
    localValidation.value = 'Mohon isi email dan kata sandi.';
    return;
  }

  if (isRegisterTab.value) {
    if (password.value.length < 8) {
      localValidation.value = 'Kata sandi minimal harus 8 karakter.';
      return;
    }
    if (password.value !== confirmPassword.value) {
      localValidation.value = 'Konfirmasi kata sandi tidak cocok.';
      return;
    }

    const success = await register(email.value, password.value);
    if (success) {
      router.push('/');
    }
  } else {
    const success = await login(email.value, password.value);
    if (success) {
      router.push('/');
    }
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <NuxtLink to="/" class="inline-flex items-center gap-2.5 mb-3 group">
        <div class="w-11 h-11 rounded-2xl bg-slate-950 flex items-center justify-center text-white font-serif font-black text-2xl shadow-md group-hover:scale-105 transition-transform">
          B
        </div>
        <span class="font-black text-2xl text-slate-950 tracking-tight">Bukti</span>
      </NuxtLink>
      <h2 class="text-xl font-bold tracking-tight text-slate-900">
        {{ isRegisterTab ? 'Daftar Akun Baru' : 'Masuk ke Akun Anda' }}
      </h2>
      <p class="mt-1 text-xs text-slate-500">
        Simpan riwayat kwitansi Anda secara aman di awan
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="bg-white py-8 px-6 shadow-sm rounded-2xl border border-slate-200/80 sm:px-10">
        <!-- Tab Selector -->
        <div class="flex rounded-xl bg-slate-100 p-1 mb-6">
          <button
            type="button"
            @click="isRegisterTab = false; localValidation = null"
            :class="[
              'w-1/2 py-2 text-xs font-bold rounded-lg transition-all',
              !isRegisterTab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            Masuk
          </button>
          <button
            type="button"
            @click="isRegisterTab = true; localValidation = null"
            :class="[
              'w-1/2 py-2 text-xs font-bold rounded-lg transition-all',
              isRegisterTab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            Daftar Baru
          </button>
        </div>

        <!-- Alert Error Message -->
        <div
          v-if="localValidation || authError"
          class="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2"
        >
          <Icon name="ph:warning-circle-bold" class="w-4 h-4 shrink-0" />
          <span>{{ localValidation || authError }}</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
              placeholder="nama@email.com"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
              placeholder="Minimal 8 karakter"
            />
          </div>

          <!-- Confirm Password (Registrasi) -->
          <div v-if="isRegisterTab">
            <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Ulangi Kata Sandi
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
              placeholder="Ketik ulang kata sandi"
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Icon v-if="isLoading" name="ph:spinner-gap-bold" class="w-4 h-4 animate-spin" />
            <span>{{ isRegisterTab ? 'Daftar Sekarang' : 'Masuk ke Bukti' }}</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink to="/" class="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1">
            <Icon name="ph:arrow-left-bold" class="w-3.5 h-3.5" />
            Kembali ke Pembuat Kwitansi
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
