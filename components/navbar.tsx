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
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
        className,
      )}
    >
      <span className="link-ink pb-0.5">{label}</span>
    </Link>
  )
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [atFooter, setAtFooter] = useState(false)
  const [heroNameHidden, setHeroNameHidden] = useState(false)
  const glassBoundary = useRef<HTMLSpanElement>(null)
  const nameBoundary = useRef<HTMLSpanElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const intl = useIntl()
  const { locale } = useLanguage()
  const resumeHref = `/resume/Nurkhan_Esenbek_${locale === 'en' ? 'EN' : 'RU'}.pdf`
  const wordmarkVisible = pathname !== '/' || heroNameHidden
  const headingEdge = heroNameHidden ? 96 : 80
  const fadeOffset = HERO_FADE_DISTANCE * (heroNameHidden ? 0.8 : 0.9)

  useEffect(() => {
    const main = document.getElementById('main-content')
    const boundary = glassBoundary.current
    if (!main || !boundary) return
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const aboveHeader = !entry.isIntersecting && entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? 64)
        if (entry.target === main) setAtFooter(aboveHeader)
        else setScrolled(aboveHeader)
      }
    }, { rootMargin: '-64px 0px 0px' })
    observer.observe(main)
    observer.observe(boundary)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const heading = pathname === '/' ? document.getElementById('hero-heading') : null
    const boundary = nameBoundary.current
    if (!heading) return
    let headingPassed: boolean | undefined
    let fadePassed: boolean | undefined = shouldReduceMotion ? false : undefined
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const passed = !entry.isIntersecting && entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? headingEdge)
        if (entry.target === heading) headingPassed = passed
        else fadePassed = passed
      }
      if (headingPassed !== undefined && fadePassed !== undefined) {
        setHeroNameHidden(headingPassed || fadePassed)
      }
    }, { rootMargin: `-${headingEdge}px 0px 100% 0px` })
    // Track crossings in the browser, including layout changes from resizing
    // or translated text. Reduced motion only uses the actual title position.
    observer.observe(heading)
    if (boundary && !shouldReduceMotion) observer.observe(boundary)
    return () => observer.disconnect()
  }, [pathname, headingEdge, shouldReduceMotion])

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
      {/* At 16px of scroll, the bottom of this marker passes the 64px header. */}
      <span ref={glassBoundary} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-[80px] w-px" />
      {pathname === '/' && !shouldReduceMotion && (
        <span ref={nameBoundary} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 w-px" style={{ height: headingEdge + fadeOffset }} />
      )}
      <motion.header
        key={shouldReduceMotion ? 'reduced' : 'animated'}
        variants={shouldReduceMotion ? undefined : navbarEntrance}
        initial="hidden"
        animate="visible"
        className={cn(
          brandStyles.header,
          'fixed top-0 left-0 z-50 w-screen border-b',
          scrolled ? 'glass border-border/50 backdrop-blur-md' : 'border-transparent bg-transparent',
        )}
        data-at-footer={atFooter && !mobileOpen}
        role="banner"
      >
        <nav
          className="section-container flex h-16 items-center justify-between"
          aria-label={intl.formatMessage({ id: 'nav.main' })}
        >
          {/* Logo / Wordmark */}
          <Link
            href="/"
            aria-label={intl.formatMessage({ id: 'nav.home' }, { name: SITE_CONFIG.name })}
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
                        'hover:text-foreground focus-visible:text-foreground',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
                      )}
                    >
                      <span className="link-ink pb-0.5">{link.label}</span>
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
              aria-label={intl.formatMessage({ id: mobileOpen ? 'nav.closeMenu' : 'nav.openMenu' })}
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
            aria-label={intl.formatMessage({ id: 'nav.mobileMenu' })}
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
              aria-label={intl.formatMessage({ id: 'nav.sections' })}
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
