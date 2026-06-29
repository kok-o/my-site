'use client'

import { useState } from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { SectionHeading } from '@/components/section-heading'
import { ScrollReveal } from '@/components/scroll-reveal'
import { cn } from '@/lib/utils'
import { useIntl } from 'react-intl'

export function Contact() {
  const [copied, setCopied] = useState(false)
  const intl = useIntl()

  const handleContactClick = () => {
    // Copy to clipboard as a fallback
    navigator.clipboard.writeText(SITE_CONFIG.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
    // The native mailto: link will execute automatically since we didn't call preventDefault()
  }

  return (
    <section id="contact" className="section-spacing section-container">
      <ScrollReveal>
        <div className={cn(
          'relative flex flex-col items-center justify-center overflow-hidden rounded-3xl p-8 text-center sm:p-16',
          'border border-border/50 bg-card/50 shadow-lg backdrop-blur-md',
        )}>
          {/* Subtle background glow */}
          <div className="absolute inset-0 -z-10 bg-[var(--gradient-glow)] opacity-50 mix-blend-screen" />

          <SectionHeading
            eyebrow={intl.formatMessage({ id: 'contact.eyebrow' })}
            heading={intl.formatMessage({ id: 'contact.heading' })}
            description={intl.formatMessage({ id: 'contact.description' })}
            align="center"
            className="mb-8"
          />

          <a
            href={`mailto:${SITE_CONFIG.email}`}
            onClick={handleContactClick}
            className={cn(
              'group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full px-8 text-base font-semibold text-primary-foreground',
              'bg-primary shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow-intense',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            )}
          >
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div className="relative h-full w-12 bg-white/20" />
            </div>
            {copied ? (
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Mail className="h-5 w-5" aria-hidden="true" />
            )}
            {copied ? intl.formatMessage({ id: 'contact.emailCopied' }) : intl.formatMessage({ id: 'contact.sayHello' })}
          </a>
        </div>
      </ScrollReveal>
    </section>
  )
}

export default Contact
