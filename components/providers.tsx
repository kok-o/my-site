'use client'

// ThemeProvider must be a Client Component — next-themes uses React context
// and accesses localStorage, which are client-only features.
// This wrapper isolates the client boundary to this single file.

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import { LanguageProvider } from '@/components/language-provider'
import InkSpillThemeSwitch from '@/components/ui/ink-spill-theme-switch'

interface ProvidersProps {
  children: ReactNode
}

function PortfolioThemeSpill({ children }: ProvidersProps) {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <InkSpillThemeSwitch
      viewport
      theme={resolvedTheme === 'light' ? 'light' : 'dark'}
      duration={560}
      onThemeChange={setTheme}
    >
      {children}
    </InkSpillThemeSwitch>
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LanguageProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
      >
        <PortfolioThemeSpill>{children}</PortfolioThemeSpill>
      </NextThemesProvider>
    </LanguageProvider>
  )
}

export default Providers
