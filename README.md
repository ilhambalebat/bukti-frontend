# Bukti Frontend (Nuxt 3 Web App)
Bagian dari ekosistem **[Satuarah.id](https://satuarah.id)**

Aplikasi web generator kwitansi dan tanda terima digital kilat dengan live preview real-time, tanda tangan digital (touch/mouse), terbilang otomatis bahasa Indonesia hingga triliunan rupiah, dan cetak PDF/kertas standar Indonesia.

- **Domain Web**: `https://bukti.satuarah.id`
- **Backend API**: `https://api-bukti.satuarah.id`

---

## 🛠️ Fitur & Teknologi

- **Framework**: Nuxt 3 (SSR/SSG & Nitro preset `cloudflare-pages`)
- **Styling**: Tailwind CSS & Lucide/Iconify
- **Keamanan**: `nuxt-security` dengan Content Security Policy (CSP) ketat
- **SEO & Social Share**: `useSeoMeta` komprehensif untuk Open Graph WhatsApp preview
- **Terbilang Engine**: Murni TypeScript tanpa library pihak ketiga
- **Tanda Tangan**: HTML5 Canvas responsif untuk layar sentuh HP dan kursor desktop
- **Ekspor**: Siap cetak fisik & PDF format A4/kwitansi standar Indonesia via `@media print`

---

## 🚀 Menjalankan Aplikasi

1. Salin `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
2. Pasang dependensi:
   ```bash
   npm install
   ```
3. Mode pengembangan (development):
   ```bash
   npm run dev
   ```
4. Build produksi:
   ```bash
   npm run build
   ```
