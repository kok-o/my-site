'use client'

import { ArrowRight, ArrowUpRight, BookOpen, Braces, ExternalLink, MessagesSquare, Settings2, SquareTerminal, UserRound } from 'lucide-react'
import { useIntl } from 'react-intl'
import { TransitionLink } from '@/components/transition-link'
import { ProjectGallery } from '@/components/project-gallery'
import { GitHubIcon } from '@/components/icons'
import { type Project, SITE_CONFIG } from '@/lib/constants'
import { PROJECT_DETAILS, type ProjectFeatureIcon } from '@/lib/project-details'

const featureIcons = {
  book: BookOpen,
  terminal: SquareTerminal,
  braces: Braces,
  chat: MessagesSquare,
  profile: UserRound,
  settings: Settings2,
} satisfies Record<ProjectFeatureIcon, typeof BookOpen>

interface ProjectDetailProps {
  project: Project
  nextProject: Project
}

export function ProjectDetail({ project, nextProject }: ProjectDetailProps) {
  const intl = useIntl()
  const details = PROJECT_DETAILS[project.id]
  const message = (suffix: string) => intl.formatMessage({ id: `project.${project.id}.detail.${suffix}` })

  return (
    <article className="section-container pb-8 pt-16">
      <header className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-3xl flex-col justify-center py-12 text-center sm:py-16">
        <h1 className="font-heading text-5xl font-bold tracking-tight text-foreground min-[375px]:text-6xl sm:text-7xl lg:text-8xl">
          {project.title}.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-xl font-normal tracking-tight text-muted-foreground sm:text-2xl lg:text-3xl">
          {message('subtitle')}
        </p>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {intl.formatMessage({ id: `project.${project.id}.description` })}
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label={intl.formatMessage({ id: 'detail.technologies' })}>
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-border/60 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-85"
            >
              {intl.formatMessage({ id: 'project.liveDemo' })}
              <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          )}
          {project.githubHref && (
            <a
              href={project.githubHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-secondary"
            >
              <GitHubIcon className="size-4" aria-hidden="true" />
              {intl.formatMessage({ id: 'project.source' })}
            </a>
          )}
        </div>
      </header>

      <ProjectGallery key={project.id} project={project} screens={details.screens} mediaType={details.mediaType} />

      <dl className="mt-9 grid grid-cols-3 gap-3 border-y border-border/60 py-6 sm:gap-8 sm:py-7">
        {[
          { label: 'kind', value: intl.formatMessage({ id: `detail.${details.kind}` }) },
          { label: 'platform', value: intl.formatMessage({ id: `detail.${details.platform}` }) },
          { label: 'year', value: project.year },
        ].map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{intl.formatMessage({ id: `detail.${label}` })}</dt>
            <dd className="mt-2 text-xs font-medium text-foreground sm:text-sm">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-10 py-12 sm:py-16 md:grid-cols-2 md:gap-16 lg:gap-24">
        <section aria-labelledby="project-about-heading">
          <h2 id="project-about-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {intl.formatMessage({ id: 'detail.about' })}
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">{message('about')}</p>
          <h3 className="mt-8 text-base font-medium">{intl.formatMessage({ id: 'detail.technologies' })}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{message('stack')}</p>
        </section>

        <section aria-labelledby="project-features-heading">
          <h2 id="project-features-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {intl.formatMessage({ id: 'detail.features' })}
          </h2>
          <ul className="mt-6 space-y-6">
            {details.features.map(({ key, icon }) => {
              const Icon = featureIcons[icon]
              return (
                <li key={key} className="flex gap-4">
                  <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div>
                    <h3 className="text-sm font-medium sm:text-base">{message(`feature.${key}.title`)}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{message(`feature.${key}.text`)}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <section className="flex flex-col items-start justify-between gap-6 border-t border-border/60 py-9 sm:flex-row sm:items-center" aria-labelledby="project-contact-heading">
        <div>
          <h2 id="project-contact-heading" className="text-xl font-medium tracking-tight sm:text-2xl">
            {intl.formatMessage({ id: 'detail.contact.heading' })}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{intl.formatMessage({ id: 'detail.contact.description' })}</p>
        </div>
        <a
          href={`mailto:${SITE_CONFIG.email}`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity duration-150 hover:opacity-85"
        >
          {intl.formatMessage({ id: 'contact.sayHello' })}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </section>

      <TransitionLink
        href={`/projects/${nextProject.id}`}
        className="group flex items-center justify-between gap-5 rounded-xl border border-border/60 px-5 py-6 transition-colors duration-200 hover:border-foreground/25 hover:bg-secondary/30 sm:px-7"
      >
        <span>
          <span className="block text-xs text-muted-foreground">{intl.formatMessage({ id: 'detail.nextProject' })}</span>
          <span className="mt-2 block text-2xl font-medium tracking-tight sm:text-3xl">{nextProject.title}</span>
        </span>
        <ArrowRight className="size-6 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden="true" />
      </TransitionLink>
    </article>
  )
}
