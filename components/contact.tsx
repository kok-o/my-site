'use client'

import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { ContactLinks } from '@/components/contact-links'
import { SectionHeading } from '@/components/section-heading'
import { ScrollReveal } from '@/components/scroll-reveal'
import { cn } from '@/lib/utils'
import { useIntl } from 'react-intl'

export function Contact() {
  const [copyMessage, setCopyMessage] = useState<'contact.emailCopied' | 'contact.copyManually' | null>(null)
  const intl = useIntl()

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
          'contact-paper relative isolate flex min-h-[50svh] flex-col items-center justify-center overflow-hidden rounded-3xl p-8 text-center sm:p-16',
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
          <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
            <span className="select-all">{SITE_CONFIG.email}</span>
            <button
              type="button"
              onClick={copyEmail}
              aria-label={intl.formatMessage({ id: 'contact.copyEmail' })}
              title={intl.formatMessage({ id: 'contact.copyEmail' })}
              className="inline-grid size-9 place-items-center rounded-md transition-colors duration-200 hover:bg-secondary hover:text-foreground"
            >
              {copyMessage === 'contact.emailCopied' ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
            </button>
          </div>
          <p role="status" className="min-h-4 text-xs text-muted-foreground">
            {copyMessage && intl.formatMessage({ id: copyMessage })}
          </p>
        </div>
      </ScrollReveal>
    </section>
  )
}

export default Contact
