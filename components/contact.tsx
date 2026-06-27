'use client'

import { useState } from 'react'
import { Mail, CheckCircle2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { SectionHeading } from '@/components/section-heading'
import { ScrollReveal } from '@/components/scroll-reveal'
import { cn } from '@/lib/utils'

export function Contact() {
  const [copied, setCopied] = useState(false)

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // Copy to clipboard as a fallback
    navigator.clipboard.writeText(SITE_CONFIG.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)

    // Open Gmail compose window in a new tab (reliable for most users)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${SITE_CONFIG.email}`
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
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
            eyebrow="What's Next"
            heading="Let's build something amazing together."
            description="Currently available for freelance work and open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!"
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
            {copied ? 'Email Copied!' : 'Say Hello'}
          </a>
        </div>
      </ScrollReveal>
    </section>
  )
}

export default Contact
