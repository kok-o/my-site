'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import { useTheme } from 'next-themes'
import { useIntl } from 'react-intl'
import { useLanguage } from '@/components/language-provider'
import type { Project } from '@/lib/constants'
import { getProjectImages, type ProjectGalleryContent, type ScreenshotPreview } from '@/lib/project-details'
import { cn } from '@/lib/utils'

const subscribeToHydration = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

interface ProjectGalleryProps {
  project: Project
  preview: ProjectGalleryContent
}

export function ProjectGallery({ project, preview }: ProjectGalleryProps) {
  const intl = useIntl()
  const { locale } = useLanguage()
  const { resolvedTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot)
  const theme = mounted && resolvedTheme === 'light' ? 'light' : 'dark'
  const images = getProjectImages(project, locale, theme)

  if (preview.type === 'diagram') {
    return (
      <figure className="rounded-xl bg-secondary/75 p-5 sm:p-8 lg:p-10">
        <figcaption className="flex flex-wrap items-center justify-between gap-x-4">
          <h2 className="text-xl font-semibold sm:text-2xl">{intl.formatMessage({ id: 'detail.workflow' })}</h2>
          <a href={images[0]} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1 rounded-sm text-sm text-foreground">
            <span className="link-ink">{intl.formatMessage({ id: 'detail.openDiagram' })}</span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </figcaption>
        <ol className="mt-5 grid gap-x-6 sm:mt-7 md:grid-cols-4">
          {preview.steps.map((step, index) => (
            <li key={step} className="py-2 sm:py-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium text-foreground sm:text-lg">
                  {intl.formatMessage({ id: `project.${project.id}.workflow.${step}.title` })}
                </h3>
                {index < preview.steps.length - 1 && <ArrowRight className="size-4 shrink-0 rotate-90 text-muted-foreground md:rotate-0" aria-hidden="true" />}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {intl.formatMessage({ id: `project.${project.id}.workflow.${step}.description` })}
              </p>
            </li>
          ))}
        </ol>
      </figure>
    )
  }

  const filter = theme === 'light' ? project.lightImageFilter : undefined
  return <ScreenshotGallery project={project} images={images} preview={preview} filter={filter} />
}

interface ScreenshotGalleryProps {
  project: Project
  images: string[]
  preview: ScreenshotPreview
  filter?: string
}

function ScreenshotGallery({ project, images, preview, filter }: ScreenshotGalleryProps) {
  const intl = useIntl()
  const slides = preview.screens.filter(({ imageIndex }) => images[imageIndex])
  const portrait = preview.imageSize.height > preview.imageSize.width
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

  const screenLabel = (name: string) => intl.formatMessage({
    id: `detail.screen.${name}`,
  })

  return (
    <section
      aria-label={intl.formatMessage({ id: 'detail.media' }, { project: project.title })}
      aria-roledescription={slides.length > 1 ? 'carousel' : undefined}
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
      <div ref={viewportRef} className={cn('overflow-hidden', portrait && 'mx-auto max-w-[min(19rem,34svh)]')}>
        <div className="flex items-start touch-pan-y">
          {slides.map(({ name, imageIndex }, index) => (
            <div
              key={name}
              className="min-w-0 flex-[0_0_100%] aria-hidden:h-0"
              role="group"
              aria-roledescription="slide"
              aria-label={intl.formatMessage({ id: 'detail.counter' }, { current: index + 1, total: slides.length })}
              aria-hidden={index !== selectedIndex}
            >
              <Image
                src={images[imageIndex]}
                alt={intl.formatMessage({ id: 'detail.screenshot' }, { project: project.title, name: screenLabel(name) })}
                {...preview.imageSize}
                sizes={portrait ? 'min(19rem, 34svh)' : '(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), (max-width: 1199px) calc(100vw - 64px), 1136px'}
                className="block h-auto w-full rounded-xl"
                style={filter ? { filter } : undefined}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && <div className="mt-5 flex flex-wrap items-center justify-between gap-4 sm:mt-7">
        <div className="flex min-w-0 flex-wrap gap-2" aria-label={intl.formatMessage({ id: 'detail.chooseScreen' })}>
          {slides.map(({ name }, index) => (
            <button
              key={name}
              type="button"
              onClick={() => carousel?.scrollTo(index)}
              aria-pressed={selectedIndex === index}
              className={cn(
                'min-h-11 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none',
                selectedIndex === index
                  ? 'bg-foreground/10 text-foreground'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
              )}
            >
              {screenLabel(name)}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="mr-2 text-xs tabular-nums text-muted-foreground" aria-live="polite" aria-atomic="true">
            {intl.formatMessage({ id: 'detail.counter' }, { current: selectedIndex + 1, total: slides.length })}
          </span>
          <button
            type="button"
            onClick={() => carousel?.scrollPrev()}
            aria-label={intl.formatMessage({ id: 'detail.previousScreenshot' })}
            className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => carousel?.scrollNext()}
            aria-label={intl.formatMessage({ id: 'detail.nextScreenshot' })}
            className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>}
    </section>
  )
}
