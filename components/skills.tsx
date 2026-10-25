'use client'

import { forwardRef, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react'
import { AnimatePresence, LayoutGroup, motion, useIsPresent, type Variants } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import { SKILLS, type Skill } from '@/lib/constants'
import { SKILL_USAGE } from '@/lib/skill-usage'
import { SectionHeading } from '@/components/section-heading'
import { EASE_OUT_FAST, STACK_FOCUS_TRANSITION, tagStagger, VIEWPORT_ONCE } from '@/lib/animations'
import { useIntl } from 'react-intl'
import { TransitionLink } from '@/components/transition-link'
import { cn } from '@/lib/utils'

const skillReveal: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: EASE_OUT_FAST },
  exit: (instant: boolean) => ({ opacity: 0, transition: instant ? { duration: 0 } : EASE_OUT_FAST }),
}

let stackUsed = false
const hintListeners = new Set<() => void>()
const subscribeHint = (listener: () => void) => {
  hintListeners.add(listener)
  return () => { hintListeners.delete(listener) }
}
const serverHintSnapshot = () => false
const hintSnapshot = () => {
  try { return stackUsed || sessionStorage.getItem('portfolio-stack-used') === '1' }
  catch { return stackUsed }
}
function markStackUsed() {
  stackUsed = true
  try { sessionStorage.setItem('portfolio-stack-used', '1') } catch { /* Keep the in-memory visit state. */ }
  hintListeners.forEach((listener) => listener())
}

/** Read the destination layout rather than a temporary FLIP transform. */
function ensureTriggerVisible(element: HTMLElement, trigger: HTMLElement, reducedMotion: boolean) {
  let top = 0
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop
  }
  const bottom = top + trigger.offsetHeight
  const viewportTop = window.scrollY + 96
  const viewportBottom = window.scrollY + window.innerHeight - 16
  let destination = window.scrollY

  if (top < viewportTop || bottom > viewportBottom) destination = top - 96

  if (Math.abs(destination - window.scrollY) > 1) {
    window.scrollTo({ top: destination, behavior: reducedMotion ? 'instant' : 'smooth' })
    return true
  }
  return false
}

function SkillButton({
  skill,
  active,
  onSelect,
  onActiveButton,
}: {
  skill: Skill
  active: boolean
  onSelect: (event: MouseEvent<HTMLButtonElement>, skill: Skill) => void
  onActiveButton: (element: HTMLButtonElement) => void
}) {
  const present = useIsPresent()
  const intl = useIntl()

  return (
    <button
      ref={(element) => { if (active && element) onActiveButton(element) }}
      type="button"
      data-skill-name={skill.name}
      disabled={!present}
      tabIndex={present ? 0 : -1}
      aria-hidden={!present || undefined}
      aria-expanded={active}
      aria-controls="skill-usage-panel"
      aria-label={active ? `${skill.name}. ${intl.formatMessage({ id: 'skills.close' })}` : skill.name}
      onClick={(event) => onSelect(event, skill)}
      className={cn(
        'group flex w-full flex-col items-center gap-4 rounded-md px-2 py-5 text-center',
        'cursor-pointer disabled:pointer-events-none',
        'focus-visible:outline-none',
      )}
    >
      {skill.icon && (
        <span
          aria-hidden="true"
          className={cn(
            'h-9 w-9 shrink-0 bg-current transition-colors duration-200 group-hover:text-primary group-focus-visible:text-primary sm:h-10 sm:w-10',
            active ? 'text-primary' : 'text-muted-foreground',
          )}
          style={{
            mask: `url(${skill.icon}) center / contain no-repeat`,
            WebkitMask: `url(${skill.icon}) center / contain no-repeat`,
          }}
        />
      )}
      <span className="flex min-h-10 items-start justify-center text-sm font-medium leading-5 text-foreground group-focus-visible:underline group-focus-visible:decoration-primary group-focus-visible:decoration-2 group-focus-visible:underline-offset-4">
        {skill.name}
      </span>
    </button>
  )
}

const SkillUsagePanel = forwardRef<HTMLDivElement, { technology: string; reducedMotion: boolean }>(
  function SkillUsagePanel({ technology, reducedMotion }, ref) {
    const intl = useIntl()
    const present = useIsPresent()
    const usages = SKILL_USAGE[technology] ?? []

    return (
      <motion.div
        ref={ref}
        inert={!present}
        aria-hidden={!present || undefined}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        variants={skillReveal}
        exit="exit"
        transition={{
          opacity: reducedMotion ? { duration: 0 } : { ...EASE_OUT_FAST, delay: STACK_FOCUS_TRANSITION.duration },
        }}
        className="w-full pt-6"
        style={{ pointerEvents: present ? undefined : 'none' }}
      >
        <div
          id="skill-usage-panel"
          role="region"
          aria-labelledby="skill-usage-heading"
          className="rounded-2xl border border-surface-border bg-card/50 p-5 sm:p-7"
        >
          <h3 id="skill-usage-heading" className="font-heading text-xl font-semibold tracking-tight">
            {intl.formatMessage({ id: 'skills.whereUsed' }, { technology })}
          </h3>
          <ul className="mt-4 divide-y divide-border/50">
            {usages.map((usage) => (
              <li key={usage.id}>
                <TransitionLink
                  href={usage.href}
                  target={usage.kind === 'source' ? '_blank' : undefined}
                  rel={usage.kind === 'source' ? 'noopener noreferrer' : undefined}
                  data-usage-id={usage.id}
                  onNavigate={usage.kind === 'contribution' ? () => {
                    const target = document.getElementById(usage.href.slice(1))
                    target?.focus({ preventScroll: true })
                    if (target && window.location.hash === usage.href && !reducedMotion) {
                      target.getAnimations().filter((animation) => animation.id === 'skill-work-revisit').forEach((animation) => animation.cancel())
                      const animation = target.animate([
                        { outlineColor: 'var(--primary)', offset: 0 },
                        { outlineColor: 'var(--primary)', offset: 0.7 },
                        { outlineColor: 'transparent', offset: 1 },
                      ], {
                        duration: 2000,
                        easing: getComputedStyle(document.documentElement).getPropertyValue('--ease-out-expo').trim(),
                      })
                      animation.id = 'skill-work-revisit'
                    }
                  } : undefined}
                  className="group flex items-center justify-between gap-5 rounded-md py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-semibold transition-colors group-hover:text-primary">
                      {intl.formatMessage({ id: usage.titleId })}
                    </span>
                    <span className="mt-1 block max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      {intl.formatMessage({ id: usage.descriptionId })}
                    </span>
                    <span className="mt-2 block text-xs font-medium text-foreground">
                      {intl.formatMessage({ id: usage.kind === 'source' ? 'skills.viewCode' : usage.kind === 'contribution' ? 'skills.openContribution' : 'skills.openProject' })}
                    </span>
                  </span>
                  {usage.kind === 'source'
                    ? <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    : <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    )
  },
)

export function Skills() {
  const intl = useIntl()
  const shouldReduceMotion = useReducedMotion()
  const [keyboardInteraction, setKeyboardInteraction] = useState(false)
  const reducedMotion = shouldReduceMotion || keyboardInteraction
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [selectionWidth, setSelectionWidth] = useState(192)
  const [headingOffset, setHeadingOffset] = useState(64)
  const hasInteracted = useSyncExternalStore(subscribeHint, hintSnapshot, serverHintSnapshot)
  const overview = useRef<HTMLElement | null>(null)
  const heading = useRef<HTMLDivElement | null>(null)
  const stage = useRef<HTMLDivElement | null>(null)
  const selectedButton = useRef<HTMLButtonElement | null>(null)
  const restoringGrid = useRef(false)
  const returnScrollOffset = useRef(0)
  const movedViewport = useRef(false)
  const visibleSkills = selectedSkill ? SKILLS.filter((skill) => skill.name === selectedSkill) : SKILLS

  useEffect(() => {
    if (!selectedSkill && !restoringGrid.current) return
    restoringGrid.current = false
    const frame = requestAnimationFrame(() => {
      if (selectedSkill && stage.current && selectedButton.current) {
        if (document.activeElement === document.body) selectedButton.current?.focus({ preventScroll: true })
        movedViewport.current = ensureTriggerVisible(stage.current, selectedButton.current, reducedMotion) || movedViewport.current
      } else if (overview.current && movedViewport.current) {
        movedViewport.current = false
        const section = overview.current
        const top = section.getBoundingClientRect().top + window.scrollY
        const maximumOffset = Math.max(0, section.offsetHeight - window.innerHeight + 96)
        const destination = top + Math.min(returnScrollOffset.current, maximumOffset)
        if (Math.abs(destination - window.scrollY) > 1) {
          window.scrollTo({ top: destination, behavior: reducedMotion ? 'instant' : 'smooth' })
        }
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [selectedSkill, reducedMotion])

  const closePanel = () => {
    restoringGrid.current = true
    setSelectedSkill(null)
    selectedButton.current?.focus({ preventScroll: true })
  }

  const selectSkill = (event: MouseEvent<HTMLButtonElement>, skill: Skill) => {
    setKeyboardInteraction(event.detail === 0)
    selectedButton.current = event.currentTarget
    markStackUsed()
    if (selectedSkill === skill.name) {
      closePanel()
    } else {
      movedViewport.current = false
      if (overview.current) {
        returnScrollOffset.current = -overview.current.getBoundingClientRect().top
        if (heading.current) {
          setHeadingOffset(heading.current.getBoundingClientRect().top - overview.current.getBoundingClientRect().top)
        }
      }
      setSelectionWidth(event.currentTarget.getBoundingClientRect().width)
      setSelectedSkill(skill.name)
    }
  }

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && selectedSkill) {
      event.preventDefault()
      setKeyboardInteraction(true)
      closePanel()
    }
  }

  return (
    <LayoutGroup id="portfolio-stack">
      <section
        ref={overview}
        id="skills"
        data-focused-skill={selectedSkill ?? undefined}
        style={selectedSkill ? { '--skill-heading-offset': `${headingOffset}px` } as CSSProperties : undefined}
        className="section-spacing section-container [overflow-anchor:none]"
        onKeyDown={handleEscape}
      >
        <div
          ref={heading}
        >
          <SectionHeading
            id="skills-heading"
            eyebrow={intl.formatMessage({ id: 'skills.eyebrow' })}
            heading={intl.formatMessage({ id: 'skills.heading' })}
            description={intl.formatMessage({ id: 'skills.description' })}
            align="center"
            className="lg:mb-0"
          />
        </div>

        <div
          ref={stage}
          data-focused-skill={selectedSkill ?? undefined}
          className="relative mx-auto mt-10 w-full max-w-5xl"
        >
          <motion.ul
            key={shouldReduceMotion ? 'reduced' : 'animated'}
            variants={reducedMotion ? undefined : tagStagger}
            initial={reducedMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            aria-labelledby="skills-heading"
            className={cn(
              'relative grid w-full gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-6',
              selectedSkill ? 'grid-cols-1 justify-items-center' : 'grid-cols-2 sm:grid-cols-5',
            )}
          >
            <AnimatePresence mode="popLayout" custom={reducedMotion}>
              {visibleSkills.map((skill) => (
                <motion.li
                  key={skill.name}
                  layout="position"
                  variants={skillReveal}
                  initial={reducedMotion ? false : hasInteracted ? 'hidden' : undefined}
                  animate={hasInteracted ? 'visible' : undefined}
                  exit="exit"
                  transition={{ layout: reducedMotion ? { duration: 0 } : STACK_FOCUS_TRANSITION }}
                  className="w-full min-w-0 max-w-full"
                  style={{ width: selectedSkill ? selectionWidth : undefined }}
                >
                  <SkillButton
                    skill={skill}
                    active={selectedSkill === skill.name}
                    onSelect={selectSkill}
                    onActiveButton={(element) => { selectedButton.current = element }}
                  />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          <AnimatePresence mode="popLayout" custom={reducedMotion}>
            {selectedSkill && (
              <SkillUsagePanel key="skill-usage" technology={selectedSkill} reducedMotion={reducedMotion} />
            )}
          </AnimatePresence>

          {!selectedSkill && (
            <div className="mt-4 min-h-8">
              {!hasInteracted && (
                <p className="text-center text-xs leading-relaxed text-muted-foreground">
                  {intl.formatMessage({ id: 'skills.hint' })}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </LayoutGroup>
  )
}

export default Skills
