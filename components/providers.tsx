'use client'

// ThemeProvider must be a Client Component — next-themes uses React context
// and accesses localStorage, which are client-only features.
// This wrapper isolates the client boundary to this single file.

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { LanguageProvider } from '@/components/language-provider'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LanguageProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
      >
        {children}
      </NextThemesProvider>
    </LanguageProvider>
  )
}

export default Providers
