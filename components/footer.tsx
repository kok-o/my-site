'use client'

// Footer
// Brand icons (GitHub, LinkedIn, X/Twitter) are inlined as SVG because
// lucide-react v1.21+ removed all brand icons. Inline SVG is the correct
// approach per DEVELOPMENT_RULES.md (official brand assets, vector-only).

import { TransitionLink as Link } from '@/components/transition-link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { SITE_CONFIG, SOCIAL_LINKS, NAV_LINKS } from '@/lib/constants'
import { brandFont } from '@/lib/brand-font'
import { cn } from '@/lib/utils'
import { useIntl } from 'react-intl'

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
  const pathname = usePathname()
  const intl = useIntl()

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
          <div className="flex items-center justify-center sm:justify-start">
            <Link
              href="/"
              aria-label={`${SITE_CONFIG.name} — back to top`}
              className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              <div
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center select-none overflow-hidden rounded-md bg-black dark:bg-white"
              >
                <Image src="/logo1.png" width={36} height={36} alt="" className="hidden h-full w-full scale-110 object-contain dark:block" />
                <Image src="/logo2.png" width={36} height={36} alt="" className="block h-full w-full scale-110 object-contain grayscale dark:hidden" />
              </div>
              <div className="flex flex-col items-start">
                <span className={cn(brandFont.className, 'font-normal text-foreground')}>
                  {SITE_CONFIG.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {SITE_CONFIG.role}
                </span>
              </div>
            </Link>
          </div>

          {/* Center — Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" role="list">
              {NAV_LINKS.filter(link => link.label !== 'Contacts').map((link) => (
                <li key={link.href}>
                  <Link
                    href={pathname === '/' ? link.href : `/${link.href}`}
                    className={cn(
                      'relative text-sm font-medium text-muted-foreground transition-colors duration-200',
                      'hover:text-foreground',
                      'after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
                    )}
                  >
                    {intl.formatMessage({ id: `nav.${link.label.toLowerCase()}` })}
                  </Link>
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
            &copy; {currentYear} {SITE_CONFIG.name}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
