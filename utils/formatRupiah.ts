/**
 * Format angka ke mata uang Rupiah standar Indonesia
 * Contoh: 1500000 -> "Rp 1.500.000"
 */
export function formatRupiah(nominal: number | string, withSymbol: boolean = true): string {
  const num = typeof nominal === 'number' ? nominal : Number(String(nominal).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return withSymbol ? 'Rp 0' : '0';

  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);

  return withSymbol ? `Rp ${formatted}` : formatted;
}

/**
 * Format tanggal standar Indonesia (contoh: "18 September 2026")
 */
export function formatTanggalIndo(dateStr?: string | Date): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
