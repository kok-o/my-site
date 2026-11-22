'use client'

import NextLink from 'next/link'
import { useTransitionRouter } from 'next-view-transitions'
import type { ComponentProps } from 'react'
import { observeActiveViewTransition, saveScrollPosition } from '@/components/scroll-restoration'
import { finishThemeTransition } from '@/components/ui/ink-spill-theme-switch'

/** Keep native Link semantics; enhance only actual client-side route navigation. */
export function TransitionLink({
  href,
  as,
  replace,
  scroll,
  onNavigate,
  ...props
}: ComponentProps<typeof NextLink>) {
  const router = useTransitionRouter()

  return (
    <NextLink
      {...props}
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      onNavigate={(event) => {
        let prevented = false
        onNavigate?.({
          preventDefault: () => {
            prevented = true
            event.preventDefault()
          },
        })
        // Next calls onNavigate only for ordinary same-origin navigation, so
        // modifier keys, downloads, external URLs and new tabs remain native.
        const destination = as || href
        if (!prevented) {
          finishThemeTransition()
          observeActiveViewTransition()
          saveScrollPosition()
        }
        // Next treats an identical URL as a no-op. A section link should still
        // take the visitor back there after they have scrolled somewhere else.
        if (!prevented && typeof destination === 'string') {
          const sectionUrl = new URL(destination, window.location.href)
          if (
            sectionUrl.origin === window.location.origin &&
            sectionUrl.pathname === window.location.pathname &&
            sectionUrl.search === window.location.search &&
            sectionUrl.hash && sectionUrl.hash === window.location.hash
          ) {
            const section = document.getElementById(sectionUrl.hash.slice(1))
            if (section) {
              event.preventDefault()
              section.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                block: 'start',
              })
              return
            }
          }
        }
        if (
          prevented ||
          typeof destination !== 'string' ||
          !('startViewTransition' in document) ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) return

        const target = new URL(destination, window.location.href)
        if (
          target.origin !== window.location.origin ||
          (target.pathname === window.location.pathname && target.search === window.location.search)
        ) return

        event.preventDefault()
        const navigate = replace ? router.replace : router.push
        navigate(destination, { scroll: scroll ?? true })
        observeActiveViewTransition()
      }}
    />
  )
}

export default TransitionLink
