'use client'

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import { useTheme } from 'next-themes'
import { useIntl } from 'react-intl'
import { useLanguage } from '@/components/language-provider'
import type { Project } from '@/lib/constants'
import { getProjectImages } from '@/lib/project-details'
import { cn } from '@/lib/utils'

const subscribeToHydration = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

interface ProjectGalleryProps {
  project: Project
  screens: string[]
  mediaType?: 'demo' | 'diagram'
}

export function ProjectGallery({ project, screens, mediaType }: ProjectGalleryProps) {
  const intl = useIntl()
  const { locale } = useLanguage()
  const { resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot)
  const theme = mounted && resolvedTheme === 'light' ? 'light' : 'dark'
  const images = useMemo(() => getProjectImages(project, locale, theme), [project, locale, theme])
  const reduceMotion = useReducedMotion()
  const [viewportRef, carousel] = useEmblaCarousel({ loop: true, duration: reduceMotion ? 0 : 18 })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const syncSelection = useCallback(() => {
    if (carousel) setSelectedIndex(carousel.selectedScrollSnap())
  }, [carousel])

  useEffect(() => {
    if (!carousel) return
    carousel.on('select', syncSelection)
    carousel.on('reInit', syncSelection)
    return () => {
      carousel.off('select', syncSelection)
      carousel.off('reInit', syncSelection)
    }
  }, [carousel, syncSelection])

  const screenLabel = (index: number) => intl.formatMessage({
    id: `detail.screen.${screens[index] || 'home'}`,
  })

  return (
    <section
      aria-label={intl.formatMessage({ id: 'detail.media' }, { project: project.title })}
      aria-roledescription={images.length > 1 ? 'carousel' : undefined}
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          carousel?.scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          carousel?.scrollNext()
        }
      }}
    >
      <div ref={viewportRef} className="overflow-hidden rounded-2xl border border-border/60 bg-secondary/20">
        <div className="flex touch-pan-y">
          {images.map((source, index) => (
            <div
              key={index}
              className={cn(
                'relative min-w-0 flex-[0_0_100%] sm:aspect-video',
                project.id === 'ai-miky' ? 'aspect-[4/5]' : 'aspect-video',
              )}
              role="group"
              aria-roledescription="slide"
              aria-label={intl.formatMessage({ id: 'detail.counter' }, { current: index + 1, total: images.length })}
              aria-hidden={index !== selectedIndex}
            >
              <Image
                src={source}
                alt={intl.formatMessage({ id: mediaType === 'diagram' ? 'detail.diagram' : mediaType === 'demo' ? 'detail.demoFrame' : 'detail.screenshot' }, { project: project.title, name: screenLabel(index) })}
                fill
                sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1024px) calc(100vw - 64px), 1100px"
                className="object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {images.length === 1 && mediaType ? (
        <p className="mt-4 text-xs text-muted-foreground">
          {intl.formatMessage({ id: mediaType === 'diagram' ? 'detail.workflow' : 'detail.demo' })}
        </p>
      ) : images.length > 1 ? <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-wrap gap-2" aria-label={intl.formatMessage({ id: 'detail.chooseScreen' })}>
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => carousel?.scrollTo(index)}
              aria-pressed={selectedIndex === index}
              className={cn(
                'min-h-10 rounded-md border px-3 py-2 text-xs transition-colors duration-150',
                selectedIndex === index
                  ? 'border-foreground/30 bg-secondary text-foreground'
                  : 'border-border/60 text-muted-foreground hover:border-foreground/20 hover:text-foreground',
              )}
            >
              {screenLabel(index)}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="mr-2 text-xs tabular-nums text-muted-foreground" aria-live="polite" aria-atomic="true">
            {intl.formatMessage({ id: 'detail.counter' }, { current: selectedIndex + 1, total: images.length })}
          </span>
          <button
            type="button"
            onClick={() => carousel?.scrollPrev()}
            aria-label={intl.formatMessage({ id: 'detail.previousScreenshot' })}
            className="flex size-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => carousel?.scrollNext()}
            aria-label={intl.formatMessage({ id: 'detail.nextScreenshot' })}
            className="flex size-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div> : null}
    </section>
  )
}
