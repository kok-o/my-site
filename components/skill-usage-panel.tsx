import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useIntl } from 'react-intl'
import { TransitionLink } from '@/components/transition-link'
import { SKILL_USAGE } from '@/lib/skill-usage'
import styles from './skills.module.css'

const actionLabels = {
  project: 'skills.openProject',
  contribution: 'skills.openContribution',
  source: 'skills.viewCode',
} as const

interface SkillUsagePanelProps {
  technology: string
  open: boolean
  reducedMotion: boolean
}

function focusContribution(href: string, reducedMotion: boolean) {
  const target = document.getElementById(href.slice(1))
  target?.focus({ preventScroll: true })
  if (!target || window.location.hash !== href || reducedMotion) return

  // A second visit to the same hash does not restart the :target animation.
  for (const animation of target.getAnimations()) {
    if (animation.id === 'skill-work-revisit') animation.cancel()
  }
  const highlight = target.animate([
    { outlineColor: 'var(--primary)', offset: 0 },
    { outlineColor: 'var(--primary)', offset: 0.7 },
    { outlineColor: 'transparent', offset: 1 },
  ], {
    duration: 2000,
    easing: getComputedStyle(document.documentElement).getPropertyValue('--ease-out-expo').trim(),
  })
  highlight.id = 'skill-work-revisit'
}

export function SkillUsagePanel({ technology, open, reducedMotion }: SkillUsagePanelProps) {
  const intl = useIntl()
  const usages = SKILL_USAGE[technology] ?? []
  const panel = useRef<HTMLElement>(null)
  const content = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = panel.current
    const body = content.current
    if (!section || !body) return
    const observer = new ResizeObserver(([entry]) => {
      const height = entry.borderBoxSize?.[0]?.blockSize ?? body.offsetHeight
      section.style.setProperty('--usage-height', `${height}px`)
    })
    observer.observe(body, { box: 'border-box' })
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={panel}
      id="skill-usage-panel"
      aria-labelledby="skill-usage-heading"
      inert={!open}
      data-open={open}
      data-instant={reducedMotion || undefined}
      className={styles.usagePanel}
    >
      <div ref={content} className={styles.panelMeasure}>
        <div className={styles.panelBody} data-multiple={usages.length > 1 || undefined}>
          <h3 id="skill-usage-heading" className={styles.panelTitle}>
            {intl.formatMessage({ id: 'skills.whereUsed' }, { technology })}
          </h3>
          <ul key={technology} className={styles.usages}>
            {usages.map((usage) => (
              <li key={usage.id}>
                <TransitionLink
                  href={usage.href}
                  target={usage.kind === 'source' ? '_blank' : undefined}
                  rel={usage.kind === 'source' ? 'noopener noreferrer' : undefined}
                  data-usage-id={usage.id}
                  onNavigate={usage.kind === 'contribution' ? () => focusContribution(usage.href, reducedMotion) : undefined}
                  className={styles.usageLink}
                >
                  <span className={styles.projectName}>{intl.formatMessage({ id: usage.titleId })}</span>
                  <span className={styles.description}>
                    {intl.formatMessage({ id: usage.descriptionId })}
                  </span>
                  <span className={styles.action}>
                    <span className="link-ink">{intl.formatMessage({ id: actionLabels[usage.kind] })}</span>
                    {usage.kind === 'source'
                      ? <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      : <ArrowRight className="size-3.5" aria-hidden="true" />}
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
