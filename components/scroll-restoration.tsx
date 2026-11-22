'use client'

import { useCallback, useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { finishThemeTransition } from '@/components/ui/ink-spill-theme-switch'

type ScrollPosition = { x: number; y: number }
type PendingRestore = { pathname: string; position?: ScrollPosition }

const HISTORY_KEY = '__portfolioScrollKey'
const positions = new Map<string, ScrollPosition>()
const observedTransitions = new WeakSet<ViewTransition>()
let activeKey: string | null = null
let restoring = false

function activeViewTransition() {
  return (document as Document & {
    activeViewTransition?: ViewTransition | null
  }).activeViewTransition
}

/** Native cancellation is normal when a visitor navigates again immediately. */
export function observeActiveViewTransition() {
  const transition = activeViewTransition()
  if (!transition || observedTransitions.has(transition)) return
  observedTransitions.add(transition)
  void transition.ready.catch((error: unknown) => {
    if (error instanceof DOMException && error.name === 'AbortError') return
    throw error
  })
}

function skipAnchorTransition() {
  const transition = activeViewTransition()
  if (!transition || observedTransitions.has(transition)) return
  const handleSkipped = (error: unknown) => {
    if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'TimeoutError')) return
    throw error
  }
  // The router can still be awaiting a hash update for this skipped snapshot.
  observedTransitions.add(transition)
  void transition.ready.catch(handleSkipped)
  void transition.updateCallbackDone.catch(handleSkipped)
  void transition.finished.catch(handleSkipped)
  transition.skipTransition()
}

function ensureEntryKey(): string {
  const state = window.history.state as Record<string, unknown> | null
  const existing = state?.[HISTORY_KEY]
  if (typeof existing === 'string') return existing

  const key = window.crypto.randomUUID()
  // One write per entry, preserving all of Next's router state. Never patch
  // history methods or write history state for individual scroll events.
  window.history.replaceState({ ...state, [HISTORY_KEY]: key }, '')
  return key
}

function recordActivePosition() {
  if (activeKey) positions.set(activeKey, { x: window.scrollX, y: window.scrollY })
}

/** Record the departing entry before a Link can replace the document's layout. */
export function saveScrollPosition() {
  if (restoring) return
  activeKey = ensureEntryKey()
  recordActivePosition()
}

export function ScrollRestoration() {
  const pathname = usePathname()
  const renderedPath = useRef(pathname)
  const pending = useRef<PendingRestore | null>(null)

  const restoreAfterCommit = useCallback(() => {
    const target = pending.current
    activeKey = ensureEntryKey()
    if (target?.position) {
      window.scrollTo({
        left: target.position.x,
        top: target.position.y,
        behavior: 'instant',
      })
    }
    pending.current = null
    restoring = false
  }, [])

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    activeKey = ensureEntryKey()
    // A reload can retain manual restoration from the previous document.
    // Honor an initial section URL before recording this entry's position.
    const initialHash = window.location.hash
    const initialSection = document.getElementById(initialHash.slice(1))
    initialSection?.scrollIntoView({ behavior: 'instant', block: 'start' })
    // The saved language is applied during hydration and can reflow content.
    // Re-align in the next layout frame, without delaying ordinary navigation.
    let anchorLayout: ResizeObserver | undefined
    const initialAnchorFrame = initialSection ? requestAnimationFrame(() => {
      if (window.location.hash !== initialHash) return
      initialSection.scrollIntoView({ behavior: 'instant', block: 'start' })
      // Translations and fonts can change the height above a deep link.
      let alignedY = window.scrollY
      anchorLayout = new ResizeObserver(() => {
        if (window.scrollY !== alignedY || !initialSection.isConnected || window.location.hash !== initialHash) {
          anchorLayout?.disconnect()
          return
        }
        initialSection.scrollIntoView({ behavior: 'instant', block: 'start' })
        alignedY = window.scrollY
      })
      anchorLayout.observe(initialSection.parentElement ?? document.body)
    }) : 0
    let samePathFrame = 0
    let historyTransitionTask = 0

    const onScroll = () => {
      // A hash link can create an entry without changing the pathname.
      // Track its key here; sample coordinates once when the visitor leaves.
      if (!restoring) activeKey = ensureEntryKey()
    }
    const onPopState = (event: PopStateEvent) => {
      anchorLayout?.disconnect()
      finishThemeTransition()
      observeActiveViewTransition()
      const samePath = window.location.pathname === renderedPath.current
      const destination = window.location.href
      // The router creates its snapshot later in this event dispatch. Wait
      // one task so hash-only history traversal can release the snapshot.
      window.clearTimeout(historyTransitionTask)
      historyTransitionTask = window.setTimeout(() => {
        if (window.location.href !== destination) return
        if (samePath) skipAnchorTransition()
        else observeActiveViewTransition()
      }, 0)
      if (!restoring) recordActivePosition()
      const key = event.state?.[HISTORY_KEY]
      pending.current = {
        pathname: window.location.pathname,
        position: typeof key === 'string' ? positions.get(key) : undefined,
      }
      restoring = true
      // Same-page hash traversal has no React pathname commit. Let the native
      // hash event finish, then restore this entry without routing or animation.
      if (samePath) {
        cancelAnimationFrame(samePathFrame)
        samePathFrame = requestAnimationFrame(restoreAfterCommit)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('popstate', onPopState, true)
    window.addEventListener('pagehide', recordActivePosition)
    return () => {
      anchorLayout?.disconnect()
      cancelAnimationFrame(initialAnchorFrame)
      cancelAnimationFrame(samePathFrame)
      window.clearTimeout(historyTransitionTask)
      window.history.scrollRestoration = previousRestoration
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('popstate', onPopState, true)
      window.removeEventListener('pagehide', recordActivePosition)
      pending.current = null
      restoring = false
    }
  }, [restoreAfterCommit])

  useLayoutEffect(() => {
    renderedPath.current = pathname
    if (pending.current?.pathname === pathname) {
      // Layout effects precede ViewTransitions' effect that releases the new
      // snapshot, so it captures the restored page at its correct position.
      restoreAfterCommit()
    } else if (!restoring) {
      activeKey = ensureEntryKey()
    }
  }, [pathname, restoreAfterCommit])

  return null
}
