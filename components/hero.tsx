'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { HERO_FADE_DISTANCE } from '@/lib/animations'
import { useIntl } from 'react-intl'
import { TransitionLink } from '@/components/transition-link'
import { HeroGradientBackground } from '@/components/ui/elegant-dark-pattern'
import styles from './hero.module.css'

const PARALLAX_DISTANCE = 400
const scrollRanges = {
  '--hero-parallax-end': `${PARALLAX_DISTANCE}px`,
  '--hero-fade-end': `${HERO_FADE_DISTANCE}px`,
} as CSSProperties

export function Hero() {
  const intl = useIntl()
  const background = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (CSS.supports('(animation-timeline: scroll(root block)) and (animation-range: 0px 400px)')) return
    const backdrop = background.current
    const foreground = content.current
    if (!backdrop || !foreground) return
    const motion = window.matchMedia('(prefers-reduced-motion: no-preference)')
    let lastOffset = -1
    const update = () => {
      const offset = Math.max(0, Math.min(window.scrollY, PARALLAX_DISTANCE))
      if (offset === lastOffset) return
      lastOffset = offset
      const progress = offset / PARALLAX_DISTANCE
      backdrop.style.transform = `translateY(${-60 * progress}px)`
      foreground.style.transform = `translateY(${40 * progress}px)`
      foreground.style.opacity = String(Math.max(0, 1 - offset / HERO_FADE_DISTANCE))
    }
    const syncMotion = () => {
      if (motion.matches) {
        update()
        window.addEventListener('scroll', update, { passive: true })
      } else {
        window.removeEventListener('scroll', update)
        lastOffset = -1
        backdrop.style.transform = foreground.style.transform = foreground.style.opacity = ''
      }
    }
    syncMotion()
    motion.addEventListener('change', syncMotion)
    return () => {
      window.removeEventListener('scroll', update)
      motion.removeEventListener('change', syncMotion)
    }
  }, [])

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[90vh] flex-col items-center justify-center pt-20"
      style={scrollRanges}
    >
      {/* Background Effects */}
      <div
        ref={background}
        className={cn(styles.backdrop, 'absolute inset-0 -z-10 overflow-hidden pointer-events-none')}
        aria-hidden="true"
      >
        <HeroGradientBackground />
      </div>

      {/* Bottom fade — outside parallax so overflow-hidden doesn't clip it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 -z-10 bg-gradient-to-t from-background via-background/70 to-transparent"
      />

      {/* Main Content */}
      <div
        ref={content}
        className={cn(styles.content, 'section-container relative z-10 w-full text-center')}
      >
        <div
          className={cn(styles.intro, 'mx-auto flex max-w-4xl flex-col items-center justify-center gap-3')}
        >
          {/* Name — primary, dominant */}
          <h1
            id="hero-heading"
            className="font-heading text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {SITE_CONFIG.name}.
          </h1>

          {/* Role — secondary, one line, no wrap */}
          <p
            className="font-heading whitespace-nowrap text-2xl font-normal tracking-tight text-muted-foreground/70 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            {intl.formatMessage({ id: 'hero.role' })}.
          </p>

          {/* Specializations — tertiary, small, subtle */}
          <p
            className="mt-1 text-sm font-medium uppercase tracking-widest text-muted-foreground/50 sm:text-base"
          >
            {intl.formatMessage({ id: 'hero.specializations' })}
          </p>

          {/* Divider */}
          <div
            className="mt-2 h-px w-16 bg-border/60"
          />

          {/* Tagline */}
          <p
            className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {intl.formatMessage({ id: 'hero.tagline' })}
          </p>

          {/* CTA */}
          <div
            className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            <TransitionLink
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
            </TransitionLink>
          </div>
        </div>
      </div>

      <div className={cn(styles.indicator, 'absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground/50 transition-colors hover:text-muted-foreground motion-reduce:hidden')}>
        <TransitionLink href="#projects" aria-label={intl.formatMessage({ id: 'hero.viewProjects' })} className="flex items-center justify-center">
          <ChevronDown className="hero-scroll-chevron h-5 w-5" aria-hidden="true" />
        </TransitionLink>
      </div>
    </section>
  )
}

export default Hero
