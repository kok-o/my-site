'use client'

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useIntl } from 'react-intl'
import { SectionHeading } from '@/components/section-heading'
import { SkillUsagePanel } from '@/components/skill-usage-panel'
import { useHangingBadges } from '@/components/use-hanging-badges'
import { SKILLS } from '@/lib/constants'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import styles from './skills.module.css'

export function Skills() {
  const intl = useIntl()
  const prefersReducedMotion = useReducedMotion()
  const [keyboardSelection, setKeyboardSelection] = useState(false)
  const [skillIndex, setSkillIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [edges, setEdges] = useState({ start: true, end: true })
  const rail = useRef<HTMLDivElement>(null)
  const selectedButton = useRef<HTMLButtonElement | null>(null)
  useHangingBadges(rail, prefersReducedMotion)

  useEffect(() => {
    const viewport = rail.current
    if (!viewport) return
    const badges = viewport.querySelectorAll('li')
    const first = badges[0]
    const last = badges[badges.length - 1]
    if (!first || !last) return
    const observer = new IntersectionObserver((entries) => {
      setEdges((previous) => {
        const next = { ...previous }
        for (const entry of entries) {
          const visible = entry.intersectionRatio >= 0.98
          if (entry.target === first) next.start = visible
          if (entry.target === last) next.end = visible
        }
        return next
      })
    }, { root: viewport, threshold: [0, 0.98] })
    observer.observe(first)
    observer.observe(last)
    return () => observer.disconnect()
  }, [])

  const revealButton = (button: HTMLButtonElement, instant: boolean) => {
    const viewport = rail.current
    if (!viewport) return
    const bounds = viewport.getBoundingClientRect()
    const badge = button.getBoundingClientRect()
    const inset = 8
    const left = Math.min(0, badge.left - bounds.left - inset) + Math.max(0, badge.right - bounds.right + inset)
    if (left) viewport.scrollBy({ left, behavior: instant ? 'instant' : 'smooth' })
  }

  const closePanel = () => {
    setOpen(false)
    const button = selectedButton.current
    if (button) {
      button.focus({ preventScroll: true })
      revealButton(button, true)
    }
  }

  const moveAlongRail = (direction: number) => {
    const viewport = rail.current
    if (viewport) viewport.scrollBy({ left: direction * viewport.clientWidth * 0.8, behavior: prefersReducedMotion ? 'instant' : 'smooth' })
  }

  const handleBadgeKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const key = event.key
    if (key === 'ArrowDown' && open && skillIndex === index) {
      event.preventDefault()
      document.querySelector<HTMLAnchorElement>('#skill-usage-panel a')?.focus()
      return
    }
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return
    event.preventDefault()
    const last = SKILLS.length - 1
    const next = key === 'Home' ? 0 : key === 'End' ? last : Math.max(0, Math.min(last, index + (key === 'ArrowLeft' ? -1 : 1)))
    const button = rail.current?.querySelectorAll<HTMLButtonElement>('button')[next]
    if (button) {
      button.focus({ preventScroll: true })
      revealButton(button, true)
    }
  }

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="section-spacing section-container"
      data-keyboard-selection={keyboardSelection || undefined}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          setKeyboardSelection(true)
          closePanel()
        }
      }}
    >
      <SectionHeading
        id="skills-heading"
        eyebrow={intl.formatMessage({ id: 'skills.eyebrow' })}
        heading={intl.formatMessage({ id: 'skills.heading' })}
        description={intl.formatMessage({ id: 'skills.description' })}
        align="center"
        className="mb-8 sm:mb-12"
      />

      <div className={styles.stage}>
        <div
          ref={rail}
          data-fade-start={!edges.start || undefined}
          data-fade-end={!edges.end || undefined}
          className={styles.viewport}
        >
          <div className={styles.track} style={{ '--skill-count': SKILLS.length } as CSSProperties}>
            <ul className={styles.rail} aria-labelledby="skills-heading">
              {SKILLS.map((skill, index) => {
                const active = open && skillIndex === index
                return (
                  <li key={skill.name} className={styles.item}>
                    <button
                      type="button"
                      data-skill-name={skill.name}
                      aria-expanded={active}
                      aria-controls="skill-usage-panel"
                      aria-label={active ? `${skill.name}. ${intl.formatMessage({ id: 'skills.close' })}` : skill.name}
                      className={styles.trigger}
                      onKeyDown={(event) => handleBadgeKey(event, index)}
                      onClick={(event) => {
                        const keyboard = event.detail === 0
                        setKeyboardSelection(keyboard)
                        if (active) {
                          closePanel()
                          return
                        }
                        selectedButton.current = event.currentTarget
                        revealButton(event.currentTarget, keyboard || prefersReducedMotion)
                        setSkillIndex(index)
                        setOpen(true)
                      }}
                    >
                      <span className={styles.hanger} data-skill-hanger="">
                        <span className={styles.plate}>
                          {skill.icon && (
                            <span aria-hidden="true" className={styles.logo} style={{ maskImage: `url(${skill.icon})` }} />
                          )}
                          <span className={styles.name}>{skill.name}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {(!edges.start || !edges.end) && (
          <div className="mt-1 flex justify-end gap-1">
            <button type="button" className={styles.arrow} disabled={edges.start} aria-label={intl.formatMessage({ id: 'skills.scrollBack' })} onClick={() => moveAlongRail(-1)}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className={styles.arrow} disabled={edges.end} aria-label={intl.formatMessage({ id: 'skills.scrollForward' })} onClick={() => moveAlongRail(1)}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}

        <SkillUsagePanel technology={SKILLS[skillIndex].name} open={open} reducedMotion={prefersReducedMotion || keyboardSelection} />
      </div>
    </section>
  )
}

export default Skills
