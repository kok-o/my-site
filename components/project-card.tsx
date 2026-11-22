'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ExternalLink, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { GitHubIcon } from '@/components/icons'
import { type Project } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/components/language-provider'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useIntl } from 'react-intl'
import { TransitionLink } from '@/components/transition-link'

interface ProjectCardProps {
  project: Project
  className?: string
}

// Match the one/two-column grid, container padding and its 1200px cap.
const PROJECT_PREVIEW_SIZES = '(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 72px) / 2), (max-width: 1199px) calc((100vw - 96px) / 2), 552px'
const MOBILE_PREVIEW_SIZES = '(max-width: 639px) calc(26vw - 28px), (max-width: 1023px) calc(13vw - 29px), (max-width: 1199px) calc(13vw - 32px), 124px'

function MobileProjectPreview({ images, index, alt }: { images: string[]; index: number; alt: string }) {
  return (
    <span className="absolute inset-0 flex items-center justify-center gap-4 px-4 pb-8 pt-2">
      {[-1, 0, 1].map((offset) => {
        const isMain = offset === 0
        const source = images[(index + offset + images.length) % images.length]
        return (
          <span
            key={offset}
            aria-hidden={isMain ? undefined : true}
            className={cn(
              'relative aspect-[9/19.5] shrink-0 overflow-hidden rounded-xl border border-foreground/10 bg-background shadow-sm',
              isMain ? 'z-10 h-full' : 'h-[88%] translate-y-2 opacity-80',
            )}
          >
            <Image
              src={source}
              alt={isMain ? alt : ''}
              fill
              sizes={MOBILE_PREVIEW_SIZES}
              className="object-contain"
            />
          </span>
        )
      })}
    </span>
  )
}

const subscribeToHydration = () => () => {}
const hydratedSnapshot = () => true
const serverSnapshot = () => false

export function ProjectCard({ project, className }: ProjectCardProps) {
  const intl = useIntl()
  const { locale } = useLanguage()
  const { theme, resolvedTheme } = useTheme()
  const [prefetchDetails, setPrefetchDetails] = useState(false)
  const enablePrefetch = prefetchDetails ? undefined : () => setPrefetchDetails(true)
  const detailLinkProps = {
    href: `/projects/${project.id}`,
    prefetch: prefetchDetails ? null : false,
    onMouseMove: enablePrefetch,
    onFocus: enablePrefetch,
  }
  // Both SSR and the hydration render use dark images. Read the saved theme
  // only after hydration, so next/image src and srcSet agree on the first render.
  const mounted = useSyncExternalStore(subscribeToHydration, hydratedSnapshot, serverSnapshot)

  const currentTheme = (mounted ? (resolvedTheme || theme) : 'dark') === 'light' ? 'light' : 'dark'
  const imageStyle = currentTheme === 'light' && project.lightImageFilter
    ? { filter: project.lightImageFilter }
    : undefined

  // Resolve localized & theme-aware images
  const images = (() => {
    if (project.themeImages) {
      const langConfig = project.themeImages[locale] || project.themeImages.en || project.themeImages.ru
      if (langConfig) {
        const themeList = langConfig[currentTheme]
        if (themeList && themeList.length > 0) {
          return themeList
        }
      }
    }
    return project.images
  })()

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const hasMultipleSlides = images.length > 1
  const attachCarousel = useCallback((viewport: HTMLButtonElement | null) => {
    if (!viewport || !hasMultipleSlides) return
    if (typeof IntersectionObserver === 'undefined') {
      emblaRef(viewport)
      return () => emblaRef(null)
    }

    // The first slide already renders on the server. Measure the strip once
    // it approaches the viewport, then keep its swipe position for this visit.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      emblaRef(viewport)
    }, { rootMargin: '360px 0px' })
    // Observe the always-sized wrapper, including while its children are
    // skipped by content-visibility.
    observer.observe(viewport.parentElement ?? viewport)
    return () => {
      observer.disconnect()
      emblaRef(null)
    }
  }, [emblaRef, hasMultipleSlides])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const opener = useRef<HTMLButtonElement | null>(null)
  const mountLightbox = useCallback((dialog: HTMLDialogElement | null) => {
    if (!dialog) return
    dialog.showModal()
    return () => {
      dialog.close()
      opener.current?.focus({ preventScroll: true })
    }
  }, [])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!isLightboxOpen) return
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      const paddingRight = parseFloat(getComputedStyle(document.body).paddingRight) || 0
      document.body.style.paddingRight = `${paddingRight + scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }
  }, [isLightboxOpen])

  return (
    <>
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl',
        'border border-surface-border bg-card/50 text-card-foreground shadow-sm',
        'transition-colors duration-300',
        'hover:border-primary/30 hover:bg-card hover:shadow-glow',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Image Carousel Container */}
      {/* ------------------------------------------------------------------- */}
      <div className={cn(
        'relative aspect-video w-full overflow-hidden border-b border-border/50 group/carousel [content-visibility:auto]',
        project.id === 'ai-miky' ? 'bg-secondary/30' : 'bg-black/20',
      )}>
        {project.id !== 'ai-miky' && (
          <div className="absolute inset-0 z-20 bg-background/10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none" />
        )}
        
        <button
          type="button"
          ref={attachCarousel}
          aria-haspopup="dialog"
          aria-label={intl.formatMessage({ id: 'project.openPreview' }, { project: project.title })}
          className="block h-full w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-4"
          onClick={(event) => {
            opener.current = event.currentTarget
            if (hasMultipleSlides) emblaRef(event.currentTarget)
            setIsLightboxOpen(true)
          }}
        >
          <span className="flex h-full touch-pan-y">
            {/* Keep every snap point measurable; mount the other previews with the swipe engine. */}
            {images.map((img, index) => (
              <span
                className={cn('relative h-full min-w-0 flex-[0_0_100%]', project.lightImageFilter && 'bg-black')}
                key={index}
                style={imageStyle}
              >
                {(index === 0 || emblaApi) && (project.id === 'ai-miky' ? (
                  <MobileProjectPreview
                    images={images}
                    index={index}
                    alt={intl.formatMessage({ id: 'detail.media' }, { project: project.title })}
                  />
                ) : (
                  <Image
                    src={img}
                    alt={intl.formatMessage({ id: 'detail.media' }, { project: project.title })}
                    fill
                    sizes={PROJECT_PREVIEW_SIZES}
                    className={project.id === 'code-ai' ? 'object-cover' : 'object-contain'}
                  />
                ))}
              </span>
            ))}
          </span>
        </button>

        {/* Carousel Navigation Arrows */}
        {hasMultipleSlides && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-background hover:scale-110 group-hover/carousel:opacity-100"
              aria-label={intl.formatMessage({ id: 'detail.previousScreenshot' })}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-background hover:scale-110 group-hover/carousel:opacity-100"
              aria-label={intl.formatMessage({ id: 'detail.nextScreenshot' })}
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 rounded-full bg-background/50 px-2 py-1 backdrop-blur-sm">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === selectedIndex 
                      ? "w-4 bg-primary" 
                      : "w-1.5 bg-primary/40 hover:bg-primary/60"
                  )}
                  aria-label={intl.formatMessage({ id: 'project.showSlide' }, { number: index + 1 })}
                  aria-current={index === selectedIndex ? 'true' : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Content */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h3 className="font-heading text-xl font-semibold tracking-tight">
            <TransitionLink
              {...detailLinkProps}
              className="link-ink rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {intl.formatMessage({ id: `project.${project.id}.title` })}
            </TransitionLink>
          </h3>
          <span className="shrink-0 text-sm font-medium text-muted-foreground">
            {project.year}
          </span>
        </div>

        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {intl.formatMessage({ id: `project.${project.id}.description` })}
        </p>

        <div className="mt-auto flex flex-col gap-6">
          {/* Tags */}
          <ul className="flex flex-wrap gap-2" aria-label={intl.formatMessage({ id: 'detail.technologies' })}>
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-border/50 pt-4">
            <TransitionLink
              {...detailLinkProps}
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-medium text-[var(--folio-ink)]',
                'transition-colors hover:text-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
              )}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span className="link-ink">{intl.formatMessage({ id: 'project.details' })}</span>
            </TransitionLink>
            {project.githubHref && (
              <a
                href={project.githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground',
                  'transition-colors hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
                )}
              >
                <GitHubIcon className="h-4 w-4" aria-hidden="true" />
                <span className="link-ink">{intl.formatMessage({ id: 'project.source' })}</span>
              </a>
            )}
            
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'inline-flex items-center gap-1.5 text-sm font-medium text-primary',
                  'transition-colors hover:text-primary/80',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm',
                )}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span className="link-ink">{intl.formatMessage({ id: 'project.liveDemo' })}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>

    {mounted && createPortal(
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.dialog
            ref={mountLightbox}
            aria-label={intl.formatMessage({ id: 'detail.media' }, { project: project.title })}
            onCancel={(event) => {
              event.preventDefault()
              setIsLightboxOpen(false)
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault()
                if (event.key === 'ArrowLeft') scrollPrev()
                else scrollNext()
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-black/95 p-4 backdrop-blur-md backdrop:bg-transparent"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-4 top-4 z-[110] rounded-full bg-white/10 p-2 text-white hover:bg-white/25 transition-colors"
              aria-label={intl.formatMessage({ id: 'project.closePreview' })}
            >
              <X className="h-6 w-6" />
            </button>

            {hasMultipleSlides && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
                  className="absolute left-4 md:left-8 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/25 transition-colors"
                  aria-label={intl.formatMessage({ id: 'detail.previousScreenshot' })}
                >
                  <ChevronLeft className="h-8 w-8 md:h-12 md:w-12" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); scrollNext(); }}
                  className="absolute right-4 md:right-8 top-1/2 z-[110] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/25 transition-colors"
                  aria-label={intl.formatMessage({ id: 'detail.nextScreenshot' })}
                >
                  <ChevronRight className="h-8 w-8 md:h-12 md:w-12" />
                </button>
              </>
            )}
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative h-full w-full max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                key={images[selectedIndex] || images[0]}
                src={images[selectedIndex] || images[0]}
                alt={intl.formatMessage({ id: 'detail.media' }, { project: project.title })}
                fill
                className="object-contain"
                style={imageStyle}
                sizes="100vw"
                priority
              />
            </motion.div>
          </motion.dialog>
        )}
      </AnimatePresence>,
      document.body
    )}
    </>
  )
}

export default ProjectCard
