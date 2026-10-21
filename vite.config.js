import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base './' permite desplegar en GitHub Pages o cualquier subcarpeta
export default defineConfig({
  plugins: [
    react(),
    // PWA: instalable y usable sin conexión (requisito para empaquetarla como TWA en Play Store)
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['refugio-isotipo.svg', 'favicon-64.png', 'privacidad.html'],
      manifest: {
        id: './',
        name: 'Refugio — Espacios de calma y apoyo',
        short_name: 'Refugio',
        description: 'Espacios de calma, técnicas para atravesar una crisis, apoyo neurodivergente y líneas de ayuda en Chile.',
        lang: 'es-CL',
        dir: 'ltr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#F2F6F4',
        background_color: '#F2F6F4',
        categories: ['health', 'medical', 'lifestyle'],
        icons: [
          { src: 'app-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'app-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'app-icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'app-icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Técnicas de calma', short_name: 'Calma', url: './#calma', icons: [{ src: 'app-icon-192.png', sizes: '192x192' }] },
          { name: 'Mapa de espacios de calma', short_name: 'Mapa', url: './#mapa', icons: [{ src: 'app-icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  base: './',
})
