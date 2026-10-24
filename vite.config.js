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
        description: 'Espacios de calma, técnicas para atravesar una crisis, tarjeta de crisis, plan de seguridad, apoyo neurodivergente y TDAH, y líneas de ayuda en Chile.',
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
          { name: 'Organizar mi día', short_name: 'Organizar', url: './#organizar', icons: [{ src: 'app-icon-192.png', sizes: '192x192' }] },
        ],
        // Capturas para el diálogo de instalación de Chrome y para PWABuilder
        screenshots: [
          { src: 'screenshots/01-inicio.png', sizes: '540x960', type: 'image/png', form_factor: 'narrow', label: 'Inicio con ayuda inmediata y SOS' },
          { src: 'screenshots/02-ayuda-ahora.png', sizes: '540x960', type: 'image/png', form_factor: 'narrow', label: 'Opciones para atravesar una crisis' },
          { src: 'screenshots/04-tarjeta-crisis.png', sizes: '540x960', type: 'image/png', form_factor: 'narrow', label: 'Tarjeta de crisis en pantalla completa' },
          { src: 'screenshots/05-organizar.png', sizes: '540x960', type: 'image/png', form_factor: 'narrow', label: 'Agenda, rutinas y lista de compras' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Las capturas solo se usan al instalar: no hace falta guardarlas sin conexión
        globIgnores: ['screenshots/**'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  base: './',
})
