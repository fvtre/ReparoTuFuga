import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title:
    'ReparoTuFuga | Detección de Fugas de Agua - Servicio Profesional 24/7',

  description:
    'Empresa familiar especializada en detección de fugas de agua con tecnología avanzada. Servicio de emergencia 24/7 en Chile. Cotización gratuita.',

  keywords:
    'detección de fugas, fugas de agua, plomería, emergencia 24/7, Chile, gasfiter, gasfiteria',

  authors: [
    {
      name: 'ReparoTuFuga',
    },
  ],

  generator: 'v0.app',

  manifest: '/manifest.json',

  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },

  openGraph: {
    title:
      'ReparoTuFuga | Detección de Fugas de Agua',

    description:
      'Empresa familiar especializada en detección de fugas de agua con tecnología avanzada.',

    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className="bg-background"
      data-scroll-behavior="smooth"
    >
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}

        <Toaster />

        <Analytics />

        {/* Google Ads / Google Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18386414245"
          strategy="afterInteractive"
        />

        <Script
          id="google-ads-tag"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              window.dataLayer.push(arguments);
            }

            gtag('js', new Date());

            gtag('config', 'AW-18386414245');
          `}
        </Script>
      </body>
    </html>
  )
}