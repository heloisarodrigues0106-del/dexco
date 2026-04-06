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
        src: '/apple-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
