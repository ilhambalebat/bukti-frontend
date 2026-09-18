/**
 * Utilitas Terbilang Bahasa Indonesia Murni
 * Mengonversi nilai numerik (hingga triliunan) menjadi teks terbilang formal.
 * Cocok untuk kwitansi, invoice, dan dokumen finansial resmi standar Indonesia.
 */

const SATUAN: readonly string[] = [
  '',
  'Satu',
  'Dua',
  'Tiga',
  'Empat',
  'Lima',
  'Enam',
  'Tujuh',
  'Delapan',
  'Sembilan',
  'Sepuluh',
  'Sebelas'
];

/**
 * Mengonversi bilangan bulat positif di bawah 1000 menjadi teks terbilang
 */
function konversiTigaDigit(n: number): string {
  if (n === 0) return '';
  if (n < 12) return SATUAN[n];
  if (n < 20) return `${SATUAN[n - 10]} Belas`;
  if (n < 100) {
    const sisa = n % 10;
    const puluhan = Math.floor(n / 10);
    return `${SATUAN[puluhan]} Puluh${sisa > 0 ? ' ' + SATUAN[sisa] : ''}`;
  }
  if (n < 200) {
    const sisa = n - 100;
    return `Seratus${sisa > 0 ? ' ' + konversiTigaDigit(sisa) : ''}`;
  }
  const ratusan = Math.floor(n / 100);
  const sisa = n % 100;
  return `${SATUAN[ratusan]} Ratus${sisa > 0 ? ' ' + konversiTigaDigit(sisa) : ''}`;
}

/**
 * Konversi angka bulat murni ke kata-kata bahasa Indonesia
 * Mendukung batas hingga triliunan (10^15 - 1)
 * 
 * @param nominal Angka atau representasi angka
 * @param appendRupiah Jika true, tambahkan kata 'Rupiah' di akhir kalimat
 * @returns Kalimat terbilang rapi
 */
export function terbilang(nominal: number | string, appendRupiah: boolean = true): string {
  if (typeof nominal === 'string') {
    nominal = Number(nominal.replace(/[^0-9.-]+/g, ''));
  }

  if (isNaN(nominal) || nominal === null || nominal === undefined) {
    return appendRupiah ? 'Nol Rupiah' : 'Nol';
  }

  // Ambil nilai absolut dan bulatkan integer
  let n = Math.floor(Math.abs(nominal));

  if (n === 0) {
    return appendRupiah ? 'Nol Rupiah' : 'Nol';
  }

  const skala: { batas: number; sebutan: string }[] = [
    { batas: 1_000_000_000_000, sebutan: 'Triliun' },
    { batas: 1_000_000_000, sebutan: 'Miliar' },
    { batas: 1_000_000, sebutan: 'Juta' },
    { batas: 1_000, sebutan: 'Ribu' },
  ];

  let hasil = '';

  for (const tingkat of skala) {
    if (n >= tingkat.batas) {
      const bagian = Math.floor(n / tingkat.batas);
      n %= tingkat.batas;

      if (tingkat.sebutan === 'Ribu' && bagian === 1) {
        // Kasus khusus bahasa Indonesia: "Seribu", bukan "Satu Ribu"
        hasil += (hasil ? ' ' : '') + 'Seribu';
      } else {
        hasil += (hasil ? ' ' : '') + konversiTigaDigit(bagian) + ' ' + tingkat.sebutan;
      }
    }
  }

  if (n > 0) {
    hasil += (hasil ? ' ' : '') + konversiTigaDigit(n);
  }

  hasil = hasil.trim();

  if (appendRupiah && hasil) {
    return `${hasil} Rupiah`;
  }

  return hasil || (appendRupiah ? 'Nol Rupiah' : 'Nol');
}

export default terbilang;
