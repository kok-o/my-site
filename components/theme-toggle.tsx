'use client'

// ThemeToggle — Client Component
// Uses useTheme hook from next-themes → requires client context.
// Renders a sun/moon icon button that switches between light and dark themes.

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  // Avoid hydration mismatch — only render after mount
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render a placeholder of the same size to avoid layout shift
    return (
      <div
        className="h-9 w-9 rounded-md"
        aria-hidden="true"
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-md',
        'text-muted-foreground transition-all duration-200',
        'hover:bg-secondary hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      {isDark
        ? <Sun className="h-4 w-4" aria-hidden="true" />
        : <Moon className="h-4 w-4" aria-hidden="true" />
      }
    </button>
  )
}

export default ThemeToggle
