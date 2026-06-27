'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { heroStagger, fadeInUp, slideInLeft, blobPulse } from '@/lib/animations'

export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-20"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Background Effects (Grid & Glows) */}
      {/* ------------------------------------------------------------------- */}
      <div className="absolute inset-0 -z-10 bg-background">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 bg-[length:24px_24px] opacity-20 dark:opacity-[0.08]"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, var(--accent) 1px, transparent 1px)',
          }}
        />

        {/* Ambient top glow */}
        <div className="absolute top-0 left-1/2 -ml-[40vw] h-[50vh] w-[80vw] rounded-full bg-primary/20 blur-[120px]" />
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Animated Floating Blobs */}
      {/* ------------------------------------------------------------------- */}
      {!shouldReduceMotion && (
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
          <motion.div
            variants={blobPulse}
            animate="animate"
            className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-[var(--accent-blue)] opacity-20 blur-[100px] mix-blend-screen"
          />
          <motion.div
            variants={blobPulse}
            animate="animate"
            style={{ animationDelay: '2s' }}
            className="absolute right-1/4 bottom-1/4 h-[350px] w-[350px] rounded-full bg-[var(--accent-violet)] opacity-20 blur-[100px] mix-blend-screen"
          />
        </div>
      )}

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
          {/* Eyebrow badge */}
          <motion.div
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className="glass flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-foreground/80 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            {SITE_CONFIG.location}
          </motion.div>

          {/* Main Title (Vercel / Apple / Linear style typography) */}
          <motion.h1
            id="hero-heading"
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className="font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <span className="block text-foreground">{SITE_CONFIG.name}.</span>
            <span className="text-gradient block mt-2 pb-2">
              {SITE_CONFIG.role}.
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            {SITE_CONFIG.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={shouldReduceMotion ? undefined : slideInLeft}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
          >
            <Link
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
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Resume Button (Disabled/Hidden until ready) */}
            <button
              disabled
              aria-disabled="true"
              className={cn(
                'inline-flex h-12 items-center justify-center gap-2 rounded-md px-8 text-sm font-medium',
                'border border-border bg-background/50 text-muted-foreground backdrop-blur-sm',
                'cursor-not-allowed opacity-60',
              )}
              title="CV will be available soon"
            >
              <FileText className="h-4 w-4" />
              Download CV
            </button>
          </motion.div>
        </motion.div>
      </div>

    </section>
  )
}

export default Hero
