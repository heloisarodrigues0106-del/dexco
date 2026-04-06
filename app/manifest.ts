import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dashboard DEXCO',
    short_name: 'Dashboard DEXCO',
    description: 'Painel executivo para gestão de processos trabalhistas e análise de risco (DEXCO)',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0033A0',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/pwa-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/pwa-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
