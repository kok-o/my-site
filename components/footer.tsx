// Footer — Server Component
// Static content — no interactivity needed. Stays Server Component.
// Brand icons (GitHub, LinkedIn, X/Twitter) are inlined as SVG because
// lucide-react v1.21+ removed all brand icons. Inline SVG is the correct
// approach per DEVELOPMENT_RULES.md (official brand assets, vector-only).

import Link from 'next/link'
import { SITE_CONFIG, SOCIAL_LINKS, NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
import { GitHubIcon, LinkedInIcon, TelegramIcon, type IconProps } from '@/components/icons'

// ---------------------------------------------------------------------------
// Social icon map — keyed by platform name from constants.ts
// ---------------------------------------------------------------------------
const SOCIAL_ICONS: Record<string, React.ComponentType<IconProps>> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  Telegram: TelegramIcon,
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        'border-t border-border',
        'bg-background/50 backdrop-blur-sm',
      )}
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="section-container py-12">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:gap-4">

          {/* Left — Brand + tagline */}
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <Link
              href="/"
              aria-label={`${SITE_CONFIG.name} — back to top`}
              className="font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              {SITE_CONFIG.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {SITE_CONFIG.role}
            </p>
          </div>

          {/* Center — Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      'text-sm text-muted-foreground transition-colors duration-200',
                      'hover:text-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right — Social links */}
          <ul className="flex items-center gap-3" role="list" aria-label="Social links">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform]
              if (!Icon) return null

              return (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-md',
                      'text-muted-foreground transition-all duration-200',
                      'hover:bg-secondary hover:text-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden={true} />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Bottom — copyright */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} {SITE_CONFIG.name}. Built with{' '}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Next.js
            </a>
            {' '}and{' '}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Vercel
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
