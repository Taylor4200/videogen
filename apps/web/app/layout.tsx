import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VideoSaaS - Automated Video Creation & YouTube Publishing',
  description: 'Create, generate, and publish videos to YouTube automatically with AI-powered tools. Perfect for creators, marketers, and entrepreneurs.',
  keywords: 'video creation, YouTube automation, AI video, content generation, video marketing',
  authors: [{ name: 'VideoSaaS Team' }],
  creator: 'VideoSaaS',
  publisher: 'VideoSaaS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'VideoSaaS - Automated Video Creation & YouTube Publishing',
    description: 'Create, generate, and publish videos to YouTube automatically with AI-powered tools.',
    siteName: 'VideoSaaS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VideoSaaS - Automated Video Creation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoSaaS - Automated Video Creation & YouTube Publishing',
    description: 'Create, generate, and publish videos to YouTube automatically with AI-powered tools.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-[80vh]">{children}</main>
          <Footer />
          <Toaster 
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </Providers>
      </body>
    </html>
  )
} 