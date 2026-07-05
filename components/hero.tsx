'use client'

import { useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { heroStagger, fadeInUp, slideInLeft } from '@/lib/animations'
import { useIntl } from 'react-intl'

export function Hero() {
  const shouldReduceMotion = useReducedMotion()
  const intl = useIntl()

  const { scrollY } = useScroll()
  const glowY = useTransform(scrollY, [0, 400], [0, -60])
  const contentY = useTransform(scrollY, [0, 400], [0, 40])
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[90vh] flex-col items-center justify-center pt-20"
    >
      {/* Background Effects */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        style={shouldReduceMotion ? undefined : { y: glowY }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-[length:24px_24px] opacity-20 dark:opacity-[0.08]"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, var(--accent) 1px, transparent 1px)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
          }}
        />
        {/* Ambient top glow */}
        <div className="absolute top-0 left-1/2 -ml-[40vw] h-[50vh] w-[80vw] rounded-full bg-foreground/5 blur-[120px] dark:bg-foreground/10" />

        {/* Secondary glow — bottom-left accent */}
        <div className="absolute bottom-20 left-1/4 h-[30vh] w-[40vw] rounded-full bg-primary/5 blur-[100px]" />

        {/* Bottom fade — bleeds OUTSIDE section for seamless transition */}
      </motion.div>

      {/* Bottom fade — outside parallax so overflow-hidden doesn't clip it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 -z-10 bg-gradient-to-t from-background via-background/70 to-transparent"
      />

      {/* Main Content */}
      <motion.div
        className="section-container relative z-10 w-full text-center"
        style={shouldReduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          variants={shouldReduceMotion ? undefined : heroStagger}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3"
        >
          {/* Name — primary, dominant */}
          <motion.h1
            id="hero-heading"
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className="font-heading text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {SITE_CONFIG.name}.
          </motion.h1>

          {/* Role — secondary, one line, no wrap */}
          <motion.p
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className="font-heading whitespace-nowrap text-2xl font-normal tracking-tight text-muted-foreground/70 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            {intl.formatMessage({ id: 'hero.role' })}.
          </motion.p>

          {/* Specializations — tertiary, small, subtle */}
          <motion.p
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className="mt-1 text-sm font-medium uppercase tracking-widest text-muted-foreground/50 sm:text-base"
          >
            {intl.formatMessage({ id: 'hero.specializations' })}
          </motion.p>

          {/* Divider */}
          <motion.div
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className="mt-2 h-px w-16 bg-border/60"
          />

          {/* Tagline */}
          <motion.p
            variants={shouldReduceMotion ? undefined : fadeInUp}
            className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {intl.formatMessage({ id: 'hero.tagline' })}
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={shouldReduceMotion ? undefined : slideInLeft}
            className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <a
              href="#projects"
              className={cn(
                'group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-md px-7 text-sm font-medium text-primary-foreground',
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
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      {!shouldReduceMotion && (
        <motion.a
          href="#projects"
          aria-label="Scroll to projects"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.a>
      )}
    </section>
  )
}

export default Hero
