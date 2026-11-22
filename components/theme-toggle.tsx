'use client'

import { useSyncExternalStore } from 'react'
import { useIntl } from 'react-intl'
import { InkThemeToggle, useInkSpillTheme } from '@/components/ui/ink-spill-theme-switch'

const subscribe = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

export function ThemeToggle() {
  const { theme, toggle } = useInkSpillTheme()
  const intl = useIntl()
  // Avoid hydration mismatch — only render after mount
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)

  if (!mounted) {
    // Render a placeholder of the same size to avoid layout shift
    return (
      <div
        className="h-9 w-9 rounded-md"
        aria-hidden="true"
      />
    )
  }

  return (
    <InkThemeToggle
      theme={theme}
      toggle={toggle}
      aria-label={intl.formatMessage({ id: theme === 'dark' ? 'nav.useLightTheme' : 'nav.useDarkTheme' })}
      className="portfolio-theme-toggle relative isolate rounded-md border-0 text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    />
  )
}

export default ThemeToggle
