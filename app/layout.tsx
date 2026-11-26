// Root layout — Server Component
// Wraps the application with fonts, metadata, themes, and route transitions.
// The layout stays a Server Component; interactive providers stay at the edge.

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { SITE_METADATA } from '@/lib/constants'
import { ViewTransitions } from 'next-view-transitions'
import { ScrollRestoration } from '@/components/scroll-restoration'
import './globals.css'

// ---------------------------------------------------------------------------
// Fonts — loaded via next/font for zero layout shift (FOIT/FOUT eliminated)
// ---------------------------------------------------------------------------
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: {
    default: SITE_METADATA.title,
    template: `%s | ${SITE_METADATA.title}`,
  },
  description: SITE_METADATA.description,
  metadataBase: new URL(SITE_METADATA.url),
  alternates: { canonical: SITE_METADATA.url },
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: SITE_METADATA.url,
    siteName: SITE_METADATA.title,
    images: [
      {
        url: SITE_METADATA.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_METADATA.title,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    ...(SITE_METADATA.twitterHandle ? { creator: SITE_METADATA.twitterHandle } : {}),
    images: [SITE_METADATA.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const directEmailEnabled = Boolean(process.env.RESEND_API_KEY || process.env.WEB3FORMS_ACCESS_KEY)

  return (
    <ViewTransitions>
      <html
        lang="en"
        data-scroll-behavior="smooth"
        className={`${geistSans.variable} ${geistMono.variable} h-full`}
        suppressHydrationWarning
      >
        <body className="relative flex min-h-full flex-col antialiased">
          <Providers directEmailEnabled={directEmailEnabled}>
            <ScrollRestoration />
            {/* Skip to main content — keyboard accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:no-underline"
            >
              Skip to main content
            </a>

            <Navbar />

            <main id="main-content" tabIndex={-1} className="page-content flex-1 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
              {children}
            </main>

            <Footer />
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
