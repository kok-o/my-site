'use client'

import { flushSync } from 'react-dom'

type Theme = 'light' | 'dark'
type ThemeChange = {
  theme: Theme
  apply: () => void
  applied: boolean
  release?: () => void
  transition?: ViewTransition
  animation?: Animation
}

// Shared by the desktop and mobile controls, including a resize mid-transition.
let active: ThemeChange | null = null

function cancel(commit: boolean) {
  const change = active
  if (!change) return
  active = null
  change.release?.()
  change.transition?.skipTransition()
  change.animation?.cancel()
  document.documentElement.removeAttribute('data-theme-transition')
  if (commit && !change.applied) change.apply()
}

/** Finish the chosen theme before a page navigation takes its own snapshots. */
export function finishThemeTransition() {
  cancel(true)
}

export function toggleTheme(
  button: HTMLButtonElement,
  setTheme: (theme: string) => void,
  animate: boolean,
) {
  const root = document.documentElement
  const previous = active
  // A second click can arrive before the first snapshot has updated React.
  const from = previous?.theme ?? (root.classList.contains('dark') ? 'dark' : 'light')
  const theme: Theme = from === 'dark' ? 'light' : 'dark'
  cancel(false)

  const apply = () => flushSync(() => setTheme(theme))
  const pageTransition = (document as Document & {
    activeViewTransition?: ViewTransition | null
  }).activeViewTransition

  // Let a route finish updating without starting a competing screenshot pair.
  if (pageTransition && pageTransition !== previous?.transition) {
    void pageTransition.ready.catch(() => {})
    pageTransition.skipTransition()
    apply()
    return
  }
  if (
    !animate ||
    typeof document.startViewTransition !== 'function' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    apply()
    return
  }

  const { left, top, width, height } = button.getBoundingClientRect()
  const x = left + width / 2
  const y = top + height / 2
  const radius = Math.ceil(Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  ))
  const small = `circle(0px at ${x}px ${y}px)`
  const large = `circle(${radius}px at ${x}px ${y}px)`
  const change: ThemeChange = { theme, apply, applied: false }
  active = change
  root.dataset.themeTransition = theme

  // Capturing the root removes its DOM subtree from native hit-testing. Finish
  // that snapshot first, then deliver the click to the live control underneath.
  let forwarding = false
  const clicks: MouseEvent[] = []
  const forwardClick = (event: MouseEvent) => {
    if (!event.isTrusted || event.button !== 0 || event.detail === 0) return
    if (active !== change && (!forwarding || active !== null)) return
    if (event.target !== root && event.target !== document.body) return
    event.preventDefault()
    event.stopPropagation()
    const rect = button.getBoundingClientRect()
    const inTrigger = event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom
    if (inTrigger) {
      // The trigger is known even when a snapshot hides DOM hit-test targets.
      button.focus({ preventScroll: true })
      toggleTheme(button, setTheme, true)
      return
    }
    clicks.push(event)
    if (forwarding) return
    forwarding = true
    // Keep collecting input until the browser has actually removed its snapshot.
    const release = change.release
    change.release = undefined
    finishThemeTransition()
    void change.transition?.finished.then(() => {
      release?.()
      const targets = clicks.map((event) => {
        const hit = document.elementFromPoint(event.clientX, event.clientY)
        return { event, target: hit?.closest('button, a[href], input, select, textarea') ?? hit }
      })
      for (const { event, target } of targets) {
        if (!target || target === root || target === document.body) continue
        if (target instanceof HTMLElement) target.focus({ preventScroll: true })
        target.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          composed: event.composed,
          view: window,
          clientX: event.clientX,
          clientY: event.clientY,
          button: event.button,
          buttons: event.buttons,
          detail: event.detail,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          metaKey: event.metaKey,
        }))
      }
    }).catch(() => release?.())
  }
  document.addEventListener('click', forwardClick, true)
  change.release = () => document.removeEventListener('click', forwardClick, true)

  const cleanup = () => {
    if (active !== change) return
    change.release?.()
    change.animation?.cancel()
    active = null
    root.removeAttribute('data-theme-transition')
  }

  try {
    const transition = document.startViewTransition(() => {
      // skipTransition still runs its update callback; stale clicks do nothing.
      if (active !== change) return
      apply()
      change.applied = true
    })
    change.transition = transition

    void transition.ready.then(() => {
      if (active !== change) return
      const style = getComputedStyle(root)
      const duration = style.getPropertyValue('--duration-slow').trim()
      change.animation = root.animate(
        { clipPath: theme === 'light' ? [small, large] : [large, small] },
        {
          duration: parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000),
          easing: style.getPropertyValue('--ease-out-expo').trim(),
          pseudoElement: theme === 'light' ? '::view-transition-new(root)' : '::view-transition-old(root)',
          fill: 'both',
        },
      )
    }).catch(() => {
      // A newer click, navigation, or unsupported snapshot can skip the effect.
      transition.skipTransition()
    })
    void transition.finished.then(cleanup, cleanup)
  } catch {
    cleanup()
    apply()
  }
}
