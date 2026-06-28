'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { GitHubIcon } from '@/components/icons'
import { type Project } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { cardHover, fadeInUp } from '@/lib/animations'

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.article
      variants={shouldReduceMotion ? undefined : fadeInUp}
      whileHover={shouldReduceMotion ? undefined : 'hover'}
      whileTap={shouldReduceMotion ? undefined : 'tap'}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl',
        'border border-border/50 bg-card/50 text-card-foreground shadow-sm',
        'backdrop-blur-md transition-colors duration-300',
        'hover:border-primary/30 hover:bg-card hover:shadow-glow',
        className,
      )}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Image Container */}
      {/* ------------------------------------------------------------------- */}
      <div className="relative aspect-video w-full overflow-hidden border-b border-border/50 bg-black/20">
        <div className="absolute inset-0 z-20 bg-background/10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none" />
        <motion.div variants={shouldReduceMotion ? undefined : cardHover} className="relative h-full w-full">
          {/* Blurred Background to fill empty space */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={project.image}
              alt=""
              fill
              className="object-cover opacity-40 blur-xl scale-110 saturate-150"
              aria-hidden="true"
            />
          </div>
          
          {/* Main Image */}
          <Image
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain drop-shadow-2xl transition-transform duration-500 z-10"
            // Ensure no priority as this is below fold (Projects section)
            priority={false}
          />
        </motion.div>
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
