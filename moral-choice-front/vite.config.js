import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'images/logo.svg', 'images/logo.png'],
      manifest: {
        name: 'MoralChoice',
        short_name: 'MoralChoice',
        description: 'Une expérience narrative inspirée par The Village de Mark Baker',
        theme_color: '#1c1917',
        background_color: '#1c1917',
        display: 'standalone',
        icons: [
          {
            src: 'images/logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'images/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
