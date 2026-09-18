import { ref, watch, onMounted } from 'vue';
import { terbilang } from '../utils/terbilang';
import { formatRupiah, formatTanggalIndo } from '../utils/formatRupiah';

export interface ReceiptData {
  receiptNumber: string;
  receivedFrom: string;
  amount: number;
  amountWords: string;
  purpose: string;
  place: string;
  date: string; // YYYY-MM-DD
  recipientName: string;
  signatureDataUrl: string;
  stampLogoUrl: string;
  notes: string;
  showStamp: boolean;
  showSignature: boolean;
}

const STORAGE_KEY = 'bukti_receipt_draft_v1';

function getDefaultReceipt(): ReceiptData {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  const initialAmount = 1500000;

  return {
    receiptNumber: `KWT/${yyyy}${mm}${dd}/${randomSuffix}`,
    receivedFrom: 'Bpk. Hendra Gunawan',
    amount: initialAmount,
    amountWords: terbilang(initialAmount, true),
    purpose: 'Pembayaran Sewa Kamar Kos No. 12 Periode Bulan Berjalan',
    place: 'Jakarta',
    date: `${yyyy}-${mm}-${dd}`,
    recipientName: 'H. Sudirman',
    signatureDataUrl: '',
    stampLogoUrl: '',
    notes: 'Pembayaran telah diterima lunas via Transfer Bank.',
    showStamp: true,
    showSignature: true,
  };
}

export const useReceipt = () => {
  const receipt = useState<ReceiptData>('receipt_data', () => getDefaultReceipt());
  const isLoaded = ref(false);

  // Load dari localStorage saat di browser
  onMounted(() => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Pastikan properti tidak undefined
          receipt.value = { ...getDefaultReceipt(), ...parsed };
        }
      } catch (err) {
        console.warn('Gagal memuat draft kwitansi dari storage:', err);
      } finally {
        isLoaded.value = true;
      }
    }
  });

  // Simpan otomatis ke localStorage setiap ada perubahan
  if (import.meta.client) {
    watch(
      receipt,
      (newVal) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
        } catch (err) {
          console.warn('Gagal menyimpan otomatis draft kwitansi:', err);
        }
      },
      { deep: true }
    );
  }

  // Helper ganti nominal uang & sinkronisasi otomatis terbilang
  const setAmount = (val: number | string) => {
    const numeric = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9]/g, ''));
    receipt.value.amount = isNaN(numeric) ? 0 : numeric;
    receipt.value.amountWords = terbilang(receipt.value.amount, true);
  };

  // Generate nomor kwitansi baru
  const regenerateReceiptNumber = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    receipt.value.receiptNumber = `KWT/${yyyy}${mm}${dd}/${randomSuffix}`;
  };

  // Reset form ke template kosong / default baru
  const resetForm = () => {
    receipt.value = getDefaultReceipt();
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Helper untuk membuat teks ringkasan untuk WhatsApp
  const generateWhatsAppShareText = (): string => {
    const tgl = formatTanggalIndo(receipt.value.date);
    const nominal = formatRupiah(receipt.value.amount);

    return `*TANDA TERIMA PEMBAYARAN DIGITAL (BUKTI)*\n` +
      `-----------------------------------------\n` +
      `*No. Kwitansi:* ${receipt.value.receiptNumber}\n` +
      `*Telah Terima Dari:* ${receipt.value.receivedFrom}\n` +
      `*Jumlah:* ${nominal}\n` +
      `*Terbilang:* _${receipt.value.amountWords}_\n` +
      `*Untuk Keperluan:* ${receipt.value.purpose}\n` +
      `*Tanggal:* ${receipt.value.place}, ${tgl}\n` +
      `*Penerima:* ${receipt.value.recipientName}\n` +
      `-----------------------------------------\n` +
      `Dibuat kilat via Bukti (https://bukti.satuarah.id)`;
  };

  return {
    receipt,
    isLoaded,
    setAmount,
    regenerateReceiptNumber,
    resetForm,
    generateWhatsAppShareText,
  };
};
