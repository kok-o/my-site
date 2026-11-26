'use client'

import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { ContactLinks } from '@/components/contact-links'
import { SectionHeading } from '@/components/section-heading'
import { ScrollReveal } from '@/components/scroll-reveal'
import { cn } from '@/lib/utils'
import { useIntl } from 'react-intl'

type CopyStatus = 'contact.emailCopied' | 'contact.copyManually' | null

export function Contact() {
  const [copyMessage, setCopyMessage] = useState<CopyStatus>(null)
  const intl = useIntl()
  const isCopied = copyMessage === 'contact.emailCopied'

  useEffect(() => {
    if (!copyMessage) return
    const timer = window.setTimeout(() => setCopyMessage(null), 3000)
    return () => window.clearTimeout(timer)
  }, [copyMessage])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email)
      setCopyMessage('contact.emailCopied')
    } catch {
      setCopyMessage('contact.copyManually')
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section-spacing section-container">
      <ScrollReveal>
        <div className={cn(
          'contact-paper relative isolate flex min-h-[48svh] flex-col items-center justify-center overflow-hidden rounded-3xl p-8 text-center sm:p-16',
          'border border-surface-border bg-card',
        )}>
          <SectionHeading
            id="contact-heading"
            eyebrow={intl.formatMessage({ id: 'contact.eyebrow' })}
            heading={intl.formatMessage({ id: 'contact.heading' })}
            description={intl.formatMessage({ id: 'contact.description' })}
            align="center"
            className="mb-8"
          />

          <ContactLinks />

          <div className="mt-4 flex items-center gap-1.5 rounded-full border border-surface-border bg-background/70 py-1 pr-1.5 pl-4 text-sm text-muted-foreground">
            <span className="select-all font-mono text-xs text-foreground/90 sm:text-sm">{SITE_CONFIG.email}</span>
            <button
              type="button"
              onClick={() => void copyEmail()}
              aria-label={intl.formatMessage({ id: 'contact.copyEmail' })}
              title={intl.formatMessage({ id: 'contact.copyEmail' })}
              className={cn(
                'inline-grid size-8 cursor-pointer place-items-center rounded-full transition-colors duration-200',
                isCopied
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              {isCopied
                ? <Check className="size-3.5" aria-hidden="true" />
                : <Copy className="size-3.5" aria-hidden="true" />}
            </button>
          </div>

          <p role="status" aria-live="polite" className="mt-2 min-h-5 text-xs text-muted-foreground">
            {copyMessage && intl.formatMessage({ id: copyMessage })}
          </p>
        </div>
      </ScrollReveal>
    </section>
  )
}

export default Contact
