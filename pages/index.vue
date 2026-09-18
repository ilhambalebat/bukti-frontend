<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import ReceiptForm from '../components/ReceiptForm.vue';
import ReceiptPreview from '../components/ReceiptPreview.vue';

const { user, isPro, isLoggedIn, fetchMe, logout } = useAuth();

// Mobile view tab switcher ('form' | 'preview')
const activeMobileTab = ref<'form' | 'preview'>('form');

onMounted(() => {
  fetchMe();
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-brand-500 selection:text-white">
    <!-- Header Navigasi -->
    <header class="no-print sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo Branding -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-900 flex items-center justify-center text-white font-serif font-black text-xl shadow-md">
            B
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-black text-lg text-slate-950 tracking-tight">Bukti</span>
              <span class="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Satuarah.id
              </span>
              <span v-if="isPro" class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                PRO
              </span>
            </div>
            <p class="text-[11px] text-slate-500 leading-none">Generator Kwitansi Digital Kilat</p>
          </div>
        </div>

        <!-- Right Action Nav -->
        <div class="flex items-center gap-3">
          <div v-if="isLoggedIn" class="flex items-center gap-3">
            <div class="hidden sm:flex flex-col text-right">
              <span class="text-xs font-semibold text-slate-900">{{ user?.email }}</span>
              <span class="text-[10px] text-emerald-600 font-medium">Akun Terverifikasi</span>
            </div>
            <button
              @click="logout"
              class="text-xs font-medium text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 transition-colors"
            >
              Keluar
            </button>
          </div>
          <div v-else class="flex items-center gap-2">
            <NuxtLink
              to="/login"
              class="text-xs font-bold text-slate-900 hover:text-brand-600 px-3 py-2 rounded-xl transition-colors"
            >
              Masuk
            </NuxtLink>
            <NuxtLink
              to="/login?tab=register"
              class="text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 px-3.5 py-2 rounded-xl transition-all shadow-sm"
            >
              Daftar Gratis
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Tab Switcher (Hanya tampil di layar kecil) -->
    <div class="no-print lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex gap-2 sticky top-16 z-30 shadow-xs">
      <button
        type="button"
        @click="activeMobileTab = 'form'"
        :class="[
          'flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5',
          activeMobileTab === 'form'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        <Icon name="ph:pencil-simple-line-bold" class="w-4 h-4" />
        Form Isian
      </button>
      <button
        type="button"
        @click="activeMobileTab = 'preview'"
        :class="[
          'flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5',
          activeMobileTab === 'preview'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        <Icon name="ph:file-text-bold" class="w-4 h-4" />
        Pratinjau Cetak
      </button>
    </div>

    <!-- Main Content: Split-Screen Layout -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Kolom Kiri: Form Editor -->
        <section
          :class="[
            'lg:col-span-6 space-y-6',
            activeMobileTab === 'preview' ? 'hidden lg:block' : 'block'
          ]"
        >
          <ReceiptForm />
        </section>

        <!-- Kolom Kanan: Live Preview & Print Paper -->
        <section
          :class="[
            'lg:col-span-6 sticky top-24',
            activeMobileTab === 'form' ? 'hidden lg:block' : 'block'
          ]"
        >
          <ReceiptPreview />
        </section>
      </div>
    </main>

    <!-- Footer Semantik -->
    <footer class="no-print mt-auto bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 Bukti • Bagian dari ekosistem digital Satuarah.id</p>
        <p class="text-slate-400">Dirancang cepat, aman, dan tanpa AI untuk UMKM & freelancer Indonesia</p>
      </div>
    </footer>
  </div>
</template>
