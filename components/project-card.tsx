'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { GitHubIcon } from '@/components/icons'
import { type Project } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { fadeInUp } from '@/lib/animations'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion()

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

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
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <motion.article
      variants={shouldReduceMotion ? undefined : fadeInUp}
      whileHover={shouldReduceMotion ? undefined : 'hover'}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl',
        'border border-border/50 bg-card/50 text-card-foreground shadow-sm',
        'backdrop-blur-md transition-colors duration-300',
        'hover:border-primary/30 hover:bg-card hover:shadow-glow',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Image Carousel Container */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-border/50 bg-black/20 group/carousel">
        <div className="absolute inset-0 z-20 bg-background/10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none" />
        
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {project.images.map((img, index) => (
              <div className="relative flex-[0_0_100%] min-w-0 h-full" key={index}>
                {/* Blurred Background to fill empty space */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover opacity-40 blur-xl scale-110 saturate-150"
                    aria-hidden="true"
                  />
                </div>
                
                {/* Main Image */}
                <Image
                  src={img}
                  alt={`Screenshot ${index + 1} of ${project.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain drop-shadow-2xl transition-transform duration-500 z-10"
                  priority={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        {project.images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-background hover:scale-110 group-hover/carousel:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-background hover:scale-110 group-hover/carousel:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 rounded-full bg-background/50 px-2 py-1 backdrop-blur-sm">
              {project.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === selectedIndex 
                      ? "w-4 bg-primary" 
                      : "w-1.5 bg-primary/40 hover:bg-primary/60"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
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
            {project.title}
          </h3>
          <span className="shrink-0 text-sm font-medium text-muted-foreground">
            {project.year}
          </span>
        </div>

        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-auto flex flex-col gap-6">
          {/* Tags */}
          <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
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
          <div className="flex items-center gap-4 border-t border-border/50 pt-4">
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
                Source
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
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectCard
