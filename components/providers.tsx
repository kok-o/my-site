'use client'

// ThemeProvider must be a Client Component — next-themes uses React context
// and accesses localStorage, which are client-only features.
// This wrapper isolates the client boundary to this single file.

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import type { ReactNode } from 'react'
import { ContactDialogProvider } from '@/components/contact-dialog'
import { LanguageProvider } from '@/components/language-provider'
import InkSpillThemeSwitch from '@/components/ui/ink-spill-theme-switch'

interface ProvidersProps {
  children: ReactNode
  directEmailEnabled?: boolean
}

function PortfolioThemeSpill({ children }: { children: ReactNode }) {
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

export function Providers({ children, directEmailEnabled = false }: ProvidersProps) {
  return (
    <LanguageProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
      >
        <ContactDialogProvider directEmailEnabled={directEmailEnabled}>
          <PortfolioThemeSpill>{children}</PortfolioThemeSpill>
        </ContactDialogProvider>
      </NextThemesProvider>
    </LanguageProvider>
  )
}

export default Providers
