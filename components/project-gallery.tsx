'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { useReducedMotion } from '@/lib/use-reduced-motion'
import { useTheme } from 'next-themes'
import { useIntl } from 'react-intl'
import { useLanguage } from '@/components/language-provider'
import { ImageLightbox } from '@/components/image-lightbox'
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
      <figure className="surface-paper relative isolate overflow-hidden rounded-2xl border border-surface-border p-5 sm:p-8 lg:p-9">
        <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{intl.formatMessage({ id: 'detail.workflow' })}</h2>
          <a
            href={images[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="group/diagram inline-flex min-h-10 items-center gap-1.5 rounded-sm text-sm font-medium text-[var(--folio-ink)] transition-colors hover:text-foreground"
          >
            <span className="decoration-current decoration-1 underline-offset-4 group-hover/diagram:underline group-focus-visible/diagram:underline">
              {intl.formatMessage({ id: 'detail.openDiagram' })}
            </span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </figcaption>
        <ol className="mt-5 grid gap-3 sm:mt-6 md:grid-cols-4 md:gap-4">
          {preview.steps.map((step, index) => (
            <li
              key={step}
              className="flex flex-col justify-between rounded-xl border border-border/75 bg-background/55 p-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                  {index < preview.steps.length - 1 && (
                    <ArrowRight className="size-3.5 shrink-0 rotate-90 text-muted-foreground/70 md:rotate-0" aria-hidden="true" />
                  )}
                </div>
                <h3 className="mt-2 font-medium text-foreground sm:text-base">
                  {intl.formatMessage({ id: `project.${project.id}.workflow.${step}.title` })}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const openerRef = useRef<HTMLButtonElement | null>(null)

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

  const currentSlide = slides[selectedIndex] ?? slides[0]
  const currentImageSrc = currentSlide ? images[currentSlide.imageIndex] : images[0]
  const currentImageAlt = currentSlide
    ? intl.formatMessage({ id: 'detail.screenshot' }, { project: project.title, name: screenLabel(currentSlide.name) })
    : intl.formatMessage({ id: 'detail.media' }, { project: project.title })

  return (
    <section
      aria-label={intl.formatMessage({ id: 'detail.media' }, { project: project.title })}
      aria-roledescription={slides.length > 1 ? 'carousel' : undefined}
      onKeyDown={(event) => {
        if (lightboxOpen || event.altKey || event.ctrlKey || event.metaKey) return
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          carousel?.scrollPrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          carousel?.scrollNext()
        }
      }}
      className={cn(
        'surface-paper relative isolate mx-auto w-full overflow-hidden rounded-2xl border border-surface-border',
        portrait
          ? 'max-w-xl p-4 sm:p-6'
          : 'max-w-[min(100%,calc(52svh*2557/1390+2.5rem))] p-3 sm:p-5',
      )}
    >
      <div
        ref={viewportRef}
        className={cn(
          'group/stage relative overflow-hidden bg-background/80',
          portrait
            ? 'mx-auto max-w-[clamp(11.5rem,23svh,15.5rem)] rounded-2xl border border-foreground/12 shadow-sm'
            : 'rounded-xl border border-border/80',
        )}
      >
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
              <button
                type="button"
                tabIndex={index === selectedIndex ? 0 : -1}
                aria-haspopup="dialog"
                aria-label={`${intl.formatMessage({ id: 'detail.expandImage' })}: ${screenLabel(name)}`}
                onClick={(event) => {
                  openerRef.current = event.currentTarget
                  setLightboxOpen(true)
                }}
                className="relative block w-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4"
              >
                <Image
                  src={images[imageIndex]}
                  alt={intl.formatMessage({ id: 'detail.screenshot' }, { project: project.title, name: screenLabel(name) })}
                  {...preview.imageSize}
                  sizes={
                    portrait
                      ? '(max-width: 639px) 196px, 248px'
                      : '(max-width: 639px) calc(100vw - 56px), (max-width: 1023px) min(calc(100vw - 88px), 96svh), min(1040px, 96svh)'
                  }
                  className="block h-auto w-full"
                  style={filter ? { filter } : undefined}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : undefined}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-2.5 right-2.5 inline-grid size-8 place-items-center rounded-full border border-white/15 bg-black/65 text-white opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/stage:opacity-100 group-focus-within/stage:opacity-100"
                >
                  <Maximize2 className="size-3.5" />
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <div
          className={cn(
            'mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3.5',
            portrait && 'sm:gap-2',
          )}
        >
          <div className="flex min-w-0 flex-wrap gap-1.5" aria-label={intl.formatMessage({ id: 'detail.chooseScreen' })}>
            {slides.map(({ name }, index) => (
              <button
                key={name}
                type="button"
                onClick={() => carousel?.scrollTo(index)}
                aria-pressed={selectedIndex === index}
                className={cn(
                  'min-h-9 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-200 motion-reduce:transition-none sm:text-sm',
                  selectedIndex === index
                    ? 'bg-foreground/12 text-foreground'
                    : 'text-muted-foreground hover:bg-foreground/6 hover:text-foreground',
                )}
              >
                {screenLabel(name)}
              </button>
            ))}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <span className="mr-1.5 font-mono text-xs tabular-nums text-muted-foreground" aria-live="polite" aria-atomic="true">
              {intl.formatMessage({ id: 'detail.counter' }, { current: selectedIndex + 1, total: slides.length })}
            </span>
            <button
              type="button"
              onClick={() => carousel?.scrollPrev()}
              aria-label={intl.formatMessage({ id: 'detail.previousScreenshot' })}
              className="inline-grid size-9 cursor-pointer place-items-center rounded-full border border-surface-border bg-background/60 text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => carousel?.scrollNext()}
              aria-label={intl.formatMessage({ id: 'detail.nextScreenshot' })}
              className="inline-grid size-9 cursor-pointer place-items-center rounded-full border border-surface-border bg-background/60 text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <ImageLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        src={currentImageSrc}
        alt={currentImageAlt}
        dialogLabel={intl.formatMessage({ id: 'detail.media' }, { project: project.title })}
        closeLabel={intl.formatMessage({ id: 'project.closePreview' })}
        prevLabel={slides.length > 1 ? intl.formatMessage({ id: 'detail.previousScreenshot' }) : undefined}
        nextLabel={slides.length > 1 ? intl.formatMessage({ id: 'detail.nextScreenshot' }) : undefined}
        onPrev={slides.length > 1 ? () => carousel?.scrollPrev() : undefined}
        onNext={slides.length > 1 ? () => carousel?.scrollNext() : undefined}
        counterText={slides.length > 1 ? intl.formatMessage({ id: 'detail.counter' }, { current: selectedIndex + 1, total: slides.length }) : undefined}
        imageStyle={filter ? { filter } : undefined}
        returnFocusRef={openerRef}
      />
    </section>
  )
}
