<script setup lang="ts">
import { ref } from 'vue';
import { useReceipt } from '../composables/useReceipt';
import { formatRupiah, formatTanggalIndo } from '../utils/formatRupiah';
import { sanitizeText } from '../utils/sanitize';

const { receipt, generateWhatsAppShareText } = useReceipt();

const isCopied = ref(false);

const handlePrint = () => {
  if (import.meta.client) {
    window.print();
  }
};

const copyWhatsAppText = async () => {
  if (import.meta.client) {
    const text = generateWhatsAppShareText();
    try {
      await navigator.clipboard.writeText(text);
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2500);
    } catch (err) {
      console.warn('Gagal menyalin teks:', err);
    }
  }
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Action Bar (Hanya tampil di layar, tersembunyi saat dicetak) -->
    <div class="no-print bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Pratinjau Langsung
        </span>
        <span class="text-xs text-slate-500 hidden sm:inline">Siap cetak kertas atau simpan ke PDF</span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Tombol Salin Ringkasan WA -->
        <button
          type="button"
          @click="copyWhatsAppText"
          class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95"
        >
          <Icon :name="isCopied ? 'ph:check-bold' : 'ph:whatsapp-logo-bold'" class="w-4 h-4 text-emerald-600" />
          <span>{{ isCopied ? 'Tersalin ke Clipboard!' : 'Salin Teks WA' }}</span>
        </button>

        <!-- Tombol Cetak / Download PDF -->
        <button
          type="button"
          @click="handlePrint"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <Icon name="ph:printer-bold" class="w-4 h-4" />
          <span>Cetak / Unduh PDF</span>
        </button>
      </div>
    </div>

    <!-- Kertas Kwitansi Fisik (Cetak / Live Preview) -->
    <div class="print-area bg-white rounded-2xl shadow-md border border-slate-200 p-6 md:p-8 transition-all overflow-hidden relative">
      <!-- Watermark latar belakang halus -->
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
        <span class="text-8xl md:text-9xl font-black uppercase tracking-widest font-serif text-slate-950 rotate-[-25deg]">
          LUNAS
        </span>
      </div>

      <!-- Bingkai Kwitansi Elegan Standar Indonesia -->
      <div class="border-2 border-slate-800 rounded-xl p-5 md:p-7 relative bg-white/95">
        <!-- Header Kwitansi -->
        <div class="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-slate-800 pb-4 mb-5 gap-3">
          <div>
            <h1 class="text-2xl md:text-3xl font-black tracking-widest text-slate-950 font-serif uppercase">
              KWITANSI
            </h1>
            <p class="text-[11px] uppercase tracking-wider text-slate-600 font-medium mt-0.5">
              Tanda Terima Pembayaran Sah
            </p>
          </div>

          <div class="flex flex-col items-start sm:items-end">
            <div class="inline-flex items-center gap-2 font-mono text-sm bg-slate-100 px-3 py-1.5 rounded-md border border-slate-300">
              <span class="text-xs text-slate-500 font-sans font-semibold">No:</span>
              <span class="font-bold text-slate-900">{{ sanitizeText(receipt.receiptNumber) || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Badan Isi Kwitansi (Format Tabel Standar Indonesia) -->
        <div class="space-y-4 text-sm text-slate-900">
          <!-- Sudah Terima Dari -->
          <div class="grid grid-cols-1 sm:grid-cols-12 items-baseline gap-1 sm:gap-2">
            <span class="sm:col-span-3 text-slate-700 font-semibold tracking-wide text-xs uppercase">
              Telah Terima Dari
            </span>
            <span class="hidden sm:inline sm:col-span-1 text-center font-bold">:</span>
            <div class="sm:col-span-8 font-medium text-slate-900 border-b border-dotted border-slate-400 pb-1 min-h-[26px]">
              {{ sanitizeText(receipt.receivedFrom) || '....................................................................' }}
            </div>
          </div>

          <!-- Uang Sejumlah / Terbilang -->
          <div class="grid grid-cols-1 sm:grid-cols-12 items-start gap-1 sm:gap-2">
            <span class="sm:col-span-3 text-slate-700 font-semibold tracking-wide text-xs uppercase pt-1">
              Uang Sejumlah
            </span>
            <span class="hidden sm:inline sm:col-span-1 text-center font-bold pt-1">:</span>
            <div class="sm:col-span-8 bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs md:text-sm font-serif italic font-semibold text-slate-900 leading-relaxed min-h-[38px]">
              # {{ sanitizeText(receipt.amountWords) || 'Nol Rupiah' }} #
            </div>
          </div>

          <!-- Untuk Pembayaran -->
          <div class="grid grid-cols-1 sm:grid-cols-12 items-baseline gap-1 sm:gap-2">
            <span class="sm:col-span-3 text-slate-700 font-semibold tracking-wide text-xs uppercase">
              Untuk Pembayaran
            </span>
            <span class="hidden sm:inline sm:col-span-1 text-center font-bold">:</span>
            <div class="sm:col-span-8 text-slate-800 border-b border-dotted border-slate-400 pb-1 min-h-[26px] leading-relaxed">
              {{ sanitizeText(receipt.purpose) || '....................................................................' }}
            </div>
          </div>
        </div>

        <!-- Garis Pemisah Halus -->
        <div class="my-6 border-t border-slate-200"></div>

        <!-- Bagian Bawah: Kotak Nominal Rp & Kolom Tanda Tangan -->
        <div class="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pt-2">
          <!-- Kotak Nominal Terbilang Angka -->
          <div class="w-full sm:w-auto">
            <span class="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Jumlah Terbayar
            </span>
            <div class="inline-flex items-center px-4 py-2.5 rounded-lg border-2 border-slate-900 bg-slate-50 text-slate-950 font-mono text-lg md:text-xl font-black tracking-wide shadow-sm">
              <span class="mr-2 text-slate-600 font-sans text-sm font-bold">Terbilang Rp.</span>
              <span>{{ formatRupiah(receipt.amount, false) }},-</span>
            </div>
          </div>

          <!-- Kolom Tanggal & Tanda Tangan Penerima -->
          <div class="w-full sm:w-56 text-center flex flex-col items-center">
            <!-- Tempat & Tanggal -->
            <p class="text-xs text-slate-700 font-medium mb-1">
              {{ sanitizeText(receipt.place) || 'Kota' }}, {{ formatTanggalIndo(receipt.date) }}
            </p>
            <p class="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              Yang Menerima,
            </p>

            <!-- Area Tanda Tangan & Cap Stempel Bertumpuk -->
            <div class="relative w-48 h-24 my-1 flex items-center justify-center">
              <!-- Stempel Cap Layer (Semi transparan jika ada) -->
              <img
                v-if="receipt.stampLogoUrl"
                :src="receipt.stampLogoUrl"
                alt="Stempel Bukti"
                class="absolute inset-0 m-auto max-h-20 max-w-[140px] object-contain opacity-75 select-none pointer-events-none transform -rotate-6"
              />

              <!-- Goresan Tanda Tangan Digital -->
              <img
                v-if="receipt.signatureDataUrl"
                :src="receipt.signatureDataUrl"
                alt="Tanda Tangan Penerima"
                class="relative z-10 max-h-20 w-auto object-contain select-none"
              />
              <div v-else class="text-slate-300 text-xs italic">
                (Tanda Tangan)
              </div>
            </div>

            <!-- Nama Jelas Penerima -->
            <div class="w-full border-b border-slate-900 pt-1"></div>
            <p class="text-xs font-bold text-slate-900 mt-1 uppercase tracking-wide">
              ( {{ sanitizeText(receipt.recipientName) || '.............................' }} )
            </p>
          </div>
        </div>

        <!-- Footer Hak Cipta & Keaslian -->
        <div class="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span>Dicetak melalui Bukti • Satuarah.id</span>
          <span>Dokumen Tanda Terima Digital</span>
        </div>
      </div>
    </div>
  </div>
</template>
