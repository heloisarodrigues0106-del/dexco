import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ServiceWorkerRegistration } from '@/components/sw-registration'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dashboard DEXCO',
  description: 'Painel executivo para gestão de processos trabalhistas e análise de risco (DEXCO)',
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dashboard DEXCO',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
    apple: '/pwa-icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0033A0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        {children}
        <ServiceWorkerRegistration />
        <Analytics />
      </body>
    </html>
  )
}
