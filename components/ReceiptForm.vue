<script setup lang="ts">
import { ref } from 'vue';
import { useReceipt } from '../composables/useReceipt';
import { formatRupiah } from '../utils/formatRupiah';

const { receipt, setAmount, regenerateReceiptNumber, resetForm } = useReceipt();

const fileInputRef = ref<HTMLInputElement | null>(null);

const handleLogoUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      receipt.value.stampLogoUrl = uploadEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeLogo = () => {
  receipt.value.stampLogoUrl = '';
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

// Preset nominal cepat (membantu pemilik kos & rental)
const quickAmounts = [500000, 1000000, 1500000, 2000000, 5000000];
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 md:p-6">
    <div class="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
      <div>
        <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <Icon name="ph:note-pencil-bold" class="w-4 h-4" />
          </span>
          Isi Data Kwitansi
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">Semua perubahan langsung tampil di preview secara instan</p>
      </div>
      <button
        type="button"
        @click="resetForm"
        class="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
        title="Reset semua isian ke kondisi baru"
      >
        <Icon name="ph:arrow-counter-clockwise-bold" class="w-3.5 h-3.5" />
        Form Baru
      </button>
    </div>

    <form @submit.prevent class="space-y-4">
      <!-- Nomor Kwitansi -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Nomor Kwitansi
        </label>
        <div class="flex gap-2">
          <input
            v-model="receipt.receiptNumber"
            type="text"
            required
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-mono text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            placeholder="Contoh: KWT/20260918/001"
          />
          <button
            type="button"
            @click="regenerateReceiptNumber"
            class="shrink-0 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors"
            title="Buat nomor otomatis baru"
          >
            <Icon name="ph:shuffle-bold" class="w-4 h-4 text-slate-600" />
            Acak
          </button>
        </div>
      </div>

      <!-- Telah Terima Dari -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Telah Terima Dari (Nama Pembayar / Penyewa)
        </label>
        <div class="relative">
          <input
            v-model="receipt.receivedFrom"
            type="text"
            required
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
            placeholder="Contoh: Bpk. Hendra Gunawan / PT Maju Berjaya"
          />
        </div>
      </div>

      <!-- Jumlah Uang (Nominal) -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Jumlah Uang (Nominal Rupiah)
        </label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-sm">
            Rp
          </span>
          <input
            :value="receipt.amount"
            @input="setAmount(($event.target as HTMLInputElement).value)"
            type="number"
            min="0"
            step="1000"
            required
            class="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-base font-bold tracking-wide focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
            placeholder="0"
          />
        </div>

        <!-- Tombol Nominal Cepat -->
        <div class="flex flex-wrap gap-1.5 mt-2">
          <button
            v-for="amt in quickAmounts"
            :key="amt"
            type="button"
            @click="setAmount(amt)"
            class="px-2.5 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 rounded-lg text-xs font-medium transition-colors"
          >
            {{ formatRupiah(amt) }}
          </button>
        </div>
      </div>

      <!-- Terbilang Otomatis -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Icon name="ph:translate-bold" class="w-3.5 h-3.5 text-brand-600" />
            Terbilang Otomatis
          </label>
          <span class="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
            Sinkron Real-time
          </span>
        </div>
        <textarea
          v-model="receipt.amountWords"
          rows="2"
          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-800 text-xs italic focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
          placeholder="Terbilang otomatis terisi..."
        ></textarea>
      </div>

      <!-- Untuk Pembayaran -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Untuk Pembayaran (Keperluan / Keterangan)
        </label>
        <textarea
          v-model="receipt.purpose"
          rows="2"
          required
          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
          placeholder="Contoh: Pembayaran sewa kos kamar 104 bulan Oktober 2026"
        ></textarea>
      </div>

      <!-- Tempat & Tanggal Penerimaan -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Kota / Tempat
          </label>
          <input
            v-model="receipt.place"
            type="text"
            required
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            placeholder="Contoh: Bandung"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Tanggal
          </label>
          <input
            v-model="receipt.date"
            type="date"
            required
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      <!-- Nama Penerima -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          Nama Penerima (Tanda Tangan)
        </label>
        <input
          v-model="receipt.recipientName"
          type="text"
          required
          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          placeholder="Contoh: Bpk. Ahmad Dahlan"
        />
      </div>

      <!-- Upload Cap Stempel atau Logo Usaha -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Icon name="ph:stamp-bold" class="w-4 h-4 text-brand-600" />
            Cap Stempel / Logo (Opsional)
          </label>
          <button
            v-if="receipt.stampLogoUrl"
            type="button"
            @click="removeLogo"
            class="text-xs text-rose-600 hover:underline flex items-center gap-1"
          >
            Hapus Cap
          </button>
        </div>

        <div v-if="!receipt.stampLogoUrl" class="relative">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            @change="handleLogoUpload"
            class="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer border border-dashed border-slate-300 rounded-xl p-2 bg-slate-50/50"
          />
          <p class="text-[11px] text-slate-400 mt-1">Format PNG transparan sangat disarankan (Maks. 2MB)</p>
        </div>

        <div v-else class="flex items-center gap-3 p-2 border border-slate-200 rounded-xl bg-slate-50/50">
          <img :src="receipt.stampLogoUrl" alt="Stempel Terunggah" class="h-12 w-auto object-contain rounded border border-slate-200 bg-white" />
          <div class="text-xs text-slate-600">
            <p class="font-medium text-slate-800">Stempel/Logo Aktif</p>
            <p class="text-[11px] text-slate-400">Akan dicetak di atas tanda tangan</p>
          </div>
        </div>
      </div>

      <!-- Tanda Tangan Canvas -->
      <div class="pt-2">
        <SignaturePad v-model="receipt.signatureDataUrl" />
      </div>
    </form>
  </div>
</template>
