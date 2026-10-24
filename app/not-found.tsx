'use client'

import { useIntl } from 'react-intl'
import { TransitionLink } from '@/components/transition-link'
import { SITE_CONFIG } from '@/lib/constants'

export default function NotFound() {
  const intl = useIntl()

  return (
    <section className="section-container flex min-h-[75svh] flex-col items-center justify-center gap-6 pt-24 text-center">
      <h1 className="font-heading text-8xl font-semibold tracking-tight text-foreground">404</h1>
      <div className="flex flex-wrap justify-center gap-4">
        <TransitionLink href="/" className="rounded-md border border-border px-5 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          {SITE_CONFIG.name}
        </TransitionLink>
        <TransitionLink href="/#projects" className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
          {intl.formatMessage({ id: 'hero.viewProjects' })}
        </TransitionLink>
      </div>
    </section>
  )
}
