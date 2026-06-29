'use client'

// Navbar — Client Component
// Requires: scroll detection (window), useState for mobile menu,
// useReducedMotion for accessibility, ThemeToggle interactivity.
// Push client boundary here — layout stays Server Component.

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useIntl } from 'react-intl'
import {
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
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'relative text-sm font-medium text-muted-foreground transition-colors duration-200',
        'hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
        className,
      )}
    >
      {label}
    </a>
  )
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const intl = useIntl()

  // Detect scroll to apply glass background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <motion.header
        variants={shouldReduceMotion ? undefined : navbarEntrance}
        initial="hidden"
        animate="visible"
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'border-b transition-all duration-300',
          scrolled
            ? 'glass border-border/50'
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
            className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            {/* Monogram */}
            <span
              className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold select-none"
              aria-hidden="true"
            >
              {SITE_CONFIG.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </span>
            <span className="hidden font-semibold text-foreground sm:block">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul
            className="hidden items-center gap-8 md:flex"
            role="list"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLinkItem href={link.href} label={intl.formatMessage({ id: `nav.${link.label.toLowerCase()}` })} />
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            <a
              href="#contact"
              className={cn(
                'inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium',
                'border border-border bg-background text-foreground',
                'transition-all duration-200',
                'hover:bg-secondary hover:border-primary/30',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              {intl.formatMessage({ id: 'nav.contact' })}
            </a>
          </div>

          {/* Mobile: Theme toggle + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
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
              {mobileOpen
                ? <X className="h-5 w-5" aria-hidden="true" />
                : <Menu className="h-5 w-5" aria-hidden="true" />
              }
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal="true"
            variants={shouldReduceMotion ? undefined : mobileMenuOverlay}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 glass md:hidden"
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
                    className="text-2xl font-semibold text-foreground"
                  />
                </motion.div>
              ))}

              <motion.div variants={shouldReduceMotion ? undefined : mobileMenuItems}>
                <a
                  href="#contact"
                  onClick={closeMobile}
                  className={cn(
                    'inline-flex h-11 items-center justify-center rounded-md px-8 text-base font-medium',
                    'border border-border bg-background text-foreground',
                    'transition-all duration-200 hover:bg-secondary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  )}
                >
                  {intl.formatMessage({ id: 'nav.contact' })}
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
