'use client'

// Navbar — Client Component

import { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import { usePathname } from 'next/navigation'
import { TransitionLink as Link } from '@/components/transition-link'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import { Menu, X, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants'
import { brandFont } from '@/lib/brand-font'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLanguage } from '@/components/language-provider'
import { useIntl } from 'react-intl'
import brandStyles from './navbar-brand.module.css'
import {
  HERO_FADE_DISTANCE,
  navbarEntrance,
  mobileMenuOverlay,
  mobileMenuItems,
  staggerContainer,
} from '@/lib/animations'

// ---------------------------------------------------------------------------
// NavLink item
// ---------------------------------------------------------------------------
interface NavLinkItemProps {
  href: string
  label: string
  onClick?: () => void
  className?: string
}

function NavLinkItem({ href, label, onClick, className }: NavLinkItemProps) {
  const pathname = usePathname()
  const destination = href.startsWith('#') && pathname !== '/' ? `/${href}` : href
  return (
    <Link
      href={destination}
      onClick={onClick ? () => flushSync(onClick) : undefined}
      className={cn(
        'relative text-sm font-medium text-muted-foreground transition-colors duration-200',
        'hover:text-foreground focus-visible:text-foreground',
        'after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full focus-visible:after:w-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
        className,
      )}
    >
      {label}
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [heroNameHidden, setHeroNameHidden] = useState(false)
  const scrollState = useRef({ scrolled: false, heroNameHidden: false })
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const intl = useIntl()
  const { locale } = useLanguage()
  const resumeHref = `/resume/Nurkhan_Esenbek_${locale === 'en' ? 'EN' : 'RU'}.pdf`
  const wordmarkVisible = pathname !== '/' || heroNameHidden

  useEffect(() => {
    let frame = 0
    const heading = pathname === '/' ? document.getElementById('hero-heading') : null
    const content = heading?.closest<HTMLElement>('.section-container')

    const update = () => {
      frame = 0
      const scrollTop = window.scrollY
      const nextScrolled = scrollTop > 16
      if (scrollState.current.scrolled !== nextScrolled) {
        scrollState.current.scrolled = nextScrolled
        setScrolled(nextScrolled)
      }
      if (!heading) return

      const updateNameVisibility = (hidden: boolean) => {
        if (scrollState.current.heroNameHidden === hidden) return
        scrollState.current.heroNameHidden = hidden
        setHeroNameHidden(hidden)
      }

      // Once the hero is fully transparent, scrolling the rest of the page
      // needs no hero geometry or computed-style reads. Recheck on the way up.
      if (!shouldReduceMotion && scrollTop >= HERO_FADE_DISTANCE) {
        updateNameVisibility(true)
        return
      }

      // The hero fades before its layout box necessarily leaves a tall screen.
      // Follow its perceived visibility, with a small reversal threshold to
      // avoid flicker when a visitor stops scrolling at the hand-off point.
      const bottom = heading.getBoundingClientRect().bottom
      const opacity = shouldReduceMotion || !content ? 1 : Number(getComputedStyle(content).opacity)
      updateNameVisibility(scrollState.current.heroNameHidden
        ? bottom <= 96 || opacity <= 0.2
        : bottom <= 80 || opacity <= 0.1)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    // Recheck after initial anchor restoration and hydrated language layout.
    schedule()
    const observer = new ResizeObserver(schedule)
    if (heading) observer.observe(heading)
    if (content) observer.observe(content)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [pathname, locale, shouldReduceMotion])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      const paddingRight = parseFloat(getComputedStyle(document.body).paddingRight) || 0
      document.body.style.paddingRight = `${paddingRight + scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        menuButtonRef.current?.focus()
      }
      if (event.key === 'Tab') {
        const items = [
          menuButtonRef.current,
          ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []),
        ].filter((item): item is HTMLElement => item !== null)
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileOpen])

  useEffect(() => {
    // Route changes also close the overlay when navigation comes from history.
    const frame = requestAnimationFrame(() => setMobileOpen(false))
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <motion.header
        key={shouldReduceMotion ? 'reduced' : 'animated'}
        variants={shouldReduceMotion ? undefined : navbarEntrance}
        initial="hidden"
        animate="visible"
        className={cn(
          brandStyles.header,
          'fixed top-0 left-0 z-50 w-screen',
          'border-b transition-all duration-300',
          scrolled
            ? 'glass border-border/50 backdrop-blur-md'
            : 'border-transparent bg-transparent',
        )}
        role="banner"
      >
        <nav
          className="section-container flex h-16 items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo / Wordmark */}
          <Link
            href="/"
            aria-label={`${SITE_CONFIG.name} — home`}
            data-wordmark-visible={wordmarkVisible}
            className={cn(
              brandFont.className,
              brandStyles.brand,
              'shrink-0 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
            )}
          >
            <span aria-hidden="true" className={brandStyles.initial}>
              {SITE_CONFIG.name.slice(0, 1)}
            </span>
            <span aria-hidden="true" className={brandStyles.wordmark}>
              {SITE_CONFIG.name.slice(1)}
            </span>
          </Link>

          <ul
            className="hidden items-center gap-4 md:flex lg:gap-8"
            role="list"
          >
            {NAV_LINKS.map((link) => {
              const isExternal = link.href.startsWith('http')
              return (
                <li key={link.href}>
                  {isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'relative text-sm font-medium text-muted-foreground transition-colors duration-200',
                        'hover:text-foreground',
                        'after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
                      )}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <NavLinkItem href={link.href} label={intl.formatMessage({ id: `nav.${link.label.toLowerCase()}` })} />
                  )}
                </li>
              )
            })}
          </ul>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-2 md:flex lg:gap-3">
            <LanguageSwitcher />
            <ThemeToggle />

            {/* CV Download — PRIMARY filled button */}
            <motion.a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              download
              aria-label={intl.formatMessage({ id: 'hero.downloadCV' })}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              className={cn(
                'group relative inline-flex h-9 items-center justify-center gap-2 overflow-hidden rounded-md px-2.5 text-sm font-medium lg:px-4',
                'bg-primary text-primary-foreground shadow-sm',
                'transition-all duration-200 hover:opacity-90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
              title={intl.formatMessage({ id: 'hero.downloadCV' })}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span className="hidden lg:inline">{intl.formatMessage({ id: 'hero.downloadCV' })}</span>
            </motion.a>
          </div>

          {/* Mobile: Theme toggle + Hamburger */}
          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((prev) => !prev)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-md',
                'text-muted-foreground transition-colors duration-200',
                'hover:bg-secondary hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
            variants={shouldReduceMotion ? undefined : mobileMenuOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 left-0 z-40 w-screen bg-background/70 backdrop-blur-md md:hidden"
            onClick={closeMobile}
          >
            <motion.nav
              variants={shouldReduceMotion ? undefined : staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex h-full flex-col items-center justify-center gap-8"
              onClick={(e) => e.stopPropagation()}
              aria-label="Mobile navigation links"
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={shouldReduceMotion ? undefined : mobileMenuItems}
                >
                  <NavLinkItem
                    href={link.href}
                    label={intl.formatMessage({ id: `nav.${link.label.toLowerCase()}` })}
                    onClick={closeMobile}
                    className="text-2xl font-semibold"
                  />
                </motion.div>
              ))}

              {/* CV in mobile menu */}
              <motion.div variants={shouldReduceMotion ? undefined : mobileMenuItems}>
                <a
                  href={resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={closeMobile}
                  className={cn(
                    'inline-flex h-11 items-center justify-center gap-2 rounded-md px-8 text-base font-medium',
                    'bg-primary text-primary-foreground shadow-sm',
                    'transition-opacity duration-200 hover:opacity-90',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  )}
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  {intl.formatMessage({ id: 'hero.downloadCV' })}
                </a>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
