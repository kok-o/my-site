'use client'

import { useReducedMotion } from 'framer-motion'
import { motion } from 'framer-motion'
import { FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { heroStagger, fadeInUp, slideInLeft, blobPulse } from '@/lib/animations'
import { useIntl } from 'react-intl'

export function Hero() {
  const shouldReduceMotion = useReducedMotion()
  const intl = useIntl()

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden pt-20"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Background Effects (Grid & Glows) */}
      {/* ------------------------------------------------------------------- */}
      <div 
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
        }}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 bg-[length:24px_24px] opacity-20 dark:opacity-[0.08]"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, var(--accent) 1px, transparent 1px)',
          }}
        />

        {/* Ambient top glow (Vercel style) */}
        <div className="absolute top-0 left-1/2 -ml-[40vw] h-[50vh] w-[80vw] rounded-full bg-foreground/5 blur-[120px] dark:bg-foreground/10" />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Main Content */}
      {/* ------------------------------------------------------------------- */}
      <div className="section-container relative z-10 w-full text-center">
        <motion.div
          variants={shouldReduceMotion ? undefined : heroStagger}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6"
        >


          {/* Main Title (Vercel / Apple / Linear style typography) */}
          <motion.h1
            id="hero-heading"
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className="font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <span className="block text-foreground">{SITE_CONFIG.name}.</span>
            <span className="text-gradient block mt-2 pb-2">
              {intl.formatMessage({ id: 'hero.role' })}.
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            {intl.formatMessage({ id: 'hero.tagline' })}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={shouldReduceMotion ? undefined : slideInLeft}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
          >
            <a
              href="#projects"
              className={cn(
                'group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-md px-8 text-sm font-medium text-primary-foreground',
                'bg-primary shadow-lg transition-transform duration-200 hover:scale-[1.02]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                <div className="relative h-full w-8 bg-white/20" />
              </div>
              {intl.formatMessage({ id: 'hero.viewProjects' })}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            {/* Resume Button */}
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex h-12 items-center justify-center gap-2 rounded-md px-8 text-sm font-medium',
                'border border-border bg-background/50 text-foreground backdrop-blur-sm',
                'transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
              title={intl.formatMessage({ id: 'hero.downloadCV' })}
            >
              <FileText className="h-4 w-4" />
              {intl.formatMessage({ id: 'hero.downloadCV' })}
            </a>
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}

export default Hero
