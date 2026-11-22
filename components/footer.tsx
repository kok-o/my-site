'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRef } from 'react'
import { useInView } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useIntl } from 'react-intl'
import { GitHubIcon, LinkedInIcon, TelegramIcon, type IconProps } from '@/components/icons'
import { FooterRidges } from '@/components/footer-ridges'
import { TransitionLink } from '@/components/transition-link'
import { brandFont } from '@/lib/brand-font'
import { NAV_LINKS, SITE_CONFIG, SOCIAL_LINKS } from '@/lib/constants'
import styles from './footer.module.css'

const socialIcons: Record<string, React.FC<IconProps>> = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  Telegram: TelegramIcon,
}

export function Footer() {
  const pathname = usePathname()
  const intl = useIntl()
  const homeLabel = intl.formatMessage({ id: 'nav.home' }, { name: SITE_CONFIG.name })
  const signatureRef = useRef<SVGSVGElement>(null)
  const directoryRef = useRef<HTMLDivElement>(null)
  const signatureVisible = useInView(signatureRef, { once: true, amount: 0.12 })
  const directoryVisible = useInView(directoryRef, { once: true, amount: 0.15 })

  return (
    <footer id="footer" role="contentinfo" className={styles.footer}>
      <div ref={directoryRef} data-revealed={directoryVisible} className={`section-container ${styles.directory}`}>
        <div className={styles.contact}>
          <div className={styles.identity}>
            <TransitionLink href="/" aria-label={homeLabel} className={styles.monogram}>
              <Image src="/logo1.png" width={36} height={36} alt="" className="hidden size-full scale-110 object-contain dark:block" />
              <Image src="/logo2.png" width={36} height={36} alt="" className="size-full scale-110 object-contain grayscale dark:hidden" />
            </TransitionLink>
            <span>{SITE_CONFIG.role}</span>
          </div>
          <a href={`mailto:${SITE_CONFIG.email}`} className={styles.email}>
            <span className="link-ink">{SITE_CONFIG.email}</span>
          </a>
          <small className={styles.copyright}>© {new Date().getFullYear()} {SITE_CONFIG.name}</small>
        </div>

        <nav aria-labelledby="footer-sections">
          <h2 id="footer-sections" className={styles.label}>{intl.formatMessage({ id: 'footer.sections' })}</h2>
          <ul className={styles.links}>
            {NAV_LINKS.filter((link) => link.href !== '#contact').map((link) => (
              <li key={link.href}>
                <TransitionLink href={pathname === '/' ? link.href : `/${link.href}`}>
                  <span className="link-ink">{intl.formatMessage({ id: `nav.${link.label.toLowerCase()}` })}</span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 id="footer-profiles" className={styles.label}>{intl.formatMessage({ id: 'footer.profiles' })}</h2>
          <ul className={styles.links} aria-labelledby="footer-profiles">
            {SOCIAL_LINKS.map((social) => {
              const Icon = socialIcons[social.platform]
              return (
                <li key={social.href}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    {Icon && <Icon className={styles.socialIcon} aria-hidden="true" />}
                    <span className="link-ink">{social.platform}</span>
                    <ArrowUpRight className={styles.externalArrow} aria-hidden="true" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className={styles.landscape} aria-hidden="true">
        <svg
          ref={signatureRef}
          data-revealed={signatureVisible}
          className={`${brandFont.className} ${styles.signature}`}
          viewBox="0 0 1000 113"
          focusable="false"
        >
          <text x="0" y="103" textLength="1000" lengthAdjust="spacingAndGlyphs">{SITE_CONFIG.name}</text>
        </svg>
        <FooterRidges />
      </div>
    </footer>
  )
}

export default Footer
