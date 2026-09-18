// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    'nuxt-security'
  ],

  nitro: {
    preset: 'cloudflare-pages'
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api-bukti.satuarah.id/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://bukti.satuarah.id'
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'id'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
      title: 'Bukti - Generator Kwitansi & Tanda Terima Digital Kilat | Satuarah.id',
      meta: [
        { name: 'description', content: 'Buat kwitansi dan tanda terima digital resmi dalam hitungan detik. Gratis, otomatis terbilang rupiah, tanda tangan digital, dan langsung cetak/PDF tanpa ribet.' },
        { name: 'theme-color', content: '#0f172a' },
        { name: 'author', content: 'Satuarah.id' },
        { name: 'robots', content: 'index, follow' },
        
        // Open Graph / WhatsApp Preview
        { property: 'og:site_name', content: 'Bukti by Satuarah.id' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'id_ID' },
        { property: 'og:title', content: 'Bukti - Generator Kwitansi & Tanda Terima Digital Kilat' },
        { property: 'og:description', content: 'Bikin kwitansi tanda terima kilat untuk pemilik kos, rental, kontraktor, dan freelancer. Otomatis terbilang & siap cetak!' },
        { property: 'og:url', content: 'https://bukti.satuarah.id' },
        { property: 'og:image', content: 'https://bukti.satuarah.id/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Bukti - Generator Kwitansi Digital Kilat' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Bukti - Generator Kwitansi Digital Kilat' },
        { name: 'twitter:description', content: 'Generator Kwitansi resmi otomatis terbilang bahasa Indonesia & tanda tangan digital.' },
        { name: 'twitter:image', content: 'https://bukti.satuarah.id/og-image.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://bukti.satuarah.id' }
      ]
    }
  },

  // Konfigurasi Keamanan Web (nuxt-security)
  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        'font-src': ["'self'", 'data:'],
        'connect-src': ["'self'", 'http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:25341', 'https://bukti.satuarah.id', 'https://api-bukti.satuarah.id'],
        'frame-ancestors': ["'none'"]
      },
      crossOriginEmbedderPolicy: 'unsafe-none',
      crossOriginResourcePolicy: 'cross-origin',
      xFrameOptions: 'DENY',
      xContentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin'
    },
    rateLimiter: false // Rate limit sudah ditangani di edge / Rust backend
  }
})
