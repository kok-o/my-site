'use client'

import { ArrowRight, ArrowUpRight, BookOpen, Braces, MessagesSquare, Settings2, SquareTerminal, UserRound } from 'lucide-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ContextOSExample } from '@/components/contextos-example'
import { useContactDialog } from '@/components/contact-dialog'
import { TransitionLink } from '@/components/transition-link'
import { ProjectGallery } from '@/components/project-gallery'
import { ProjectHeaderArt } from '@/components/project-header-art'
import { GitHubIcon } from '@/components/icons'
import { SITE_CONFIG, type Project } from '@/lib/constants'
import { PROJECT_DETAILS, type ProjectFeatureIcon } from '@/lib/project-details'
import styles from './project-header-art.module.css'

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
  const { openContactDialog } = useContactDialog()
  const details = PROJECT_DETAILS[project.id]
  const message = (suffix: string) => intl.formatMessage({ id: `project.${project.id}.detail.${suffix}` })
  const contactLinkClass =
    'rounded-sm text-foreground decoration-current decoration-1 underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  const article = (
    <article className="section-container flex flex-col gap-12 pt-28 pb-12 sm:gap-16 sm:pt-36 sm:pb-16 lg:gap-20 lg:pt-40 lg:pb-20">
      <header className={project.id === 'contextos' ? styles.header : styles.illustratedHeader}>
        <h1 className="text-balance font-heading text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {project.title}.
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:mt-5 sm:text-xl lg:text-2xl">
          {message('subtitle')}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 sm:mt-7">
          <dl className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-muted-foreground">
            {[
              ['year', String(project.year)],
              ['kind', intl.formatMessage({ id: `detail.${details.kind}` })],
              ['platform', intl.formatMessage({ id: `detail.${details.platform}` })],
            ].map(([label, value], idx) => (
              <div key={label} className="inline-flex items-center gap-2.5">
                {idx > 0 && <span aria-hidden="true" className="text-border">/</span>}
                <dt className="sr-only">{intl.formatMessage({ id: `detail.${label}` })}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-foreground">
            {project.githubHref && (
              <a
                href={project.githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-surface-border bg-background/65 px-3.5 transition-colors hover:border-[var(--folio-ink)] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <GitHubIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                <span>{intl.formatMessage({ id: 'project.source' })}</span>
              </a>
            )}
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{intl.formatMessage({ id: 'project.liveDemo' })}</span>
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
        <ProjectHeaderArt projectId={project.id} />
      </header>

      {details.preview.type === 'cli' ? (
        <ContextOSExample />
      ) : (
        <ProjectGallery key={project.id} project={project} preview={details.preview} />
      )}

      <div className="mt-6 grid gap-10 sm:mt-10 md:grid-cols-2 md:gap-12 lg:mt-14 lg:gap-20">
        <section aria-labelledby="project-about-heading">
          <h2 id="project-about-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {intl.formatMessage({ id: 'detail.about' })}
          </h2>
          <p className="mt-5 max-w-prose leading-7 text-muted-foreground">{message('about')}</p>
          <h3 className="mt-8 text-base font-medium">{intl.formatMessage({ id: 'detail.technologies' })}</h3>
          <p className="mt-2.5 text-sm leading-7 text-muted-foreground sm:text-base">{message('stack')}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={intl.formatMessage({ id: 'detail.technologies' })}>
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-border/80 bg-background/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="project-features-heading">
          <h2 id="project-features-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {intl.formatMessage({ id: 'detail.features' })}
          </h2>
          <ul className="mt-5 divide-y divide-border/50 border-t border-border/50">
            {details.features.map(({ key, icon }) => {
              const Icon = featureIcons[icon]
              return (
                <li key={key} className="flex gap-4 py-4 first:pt-5 last:pb-0">
                  <span className="mt-0.5 inline-grid size-8 shrink-0 place-items-center rounded-lg border border-surface-border bg-secondary/60 text-muted-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
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

      <div className="surface-paper relative isolate flex flex-col gap-6 overflow-hidden rounded-2xl border border-surface-border p-6 sm:flex-row sm:items-end sm:justify-between sm:gap-12 sm:p-8">
        <section aria-labelledby="project-contact-heading">
          <h2 id="project-contact-heading" className="text-xl font-medium tracking-tight sm:text-2xl">
            {intl.formatMessage({ id: 'detail.contact.heading' })}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <FormattedMessage
              id="detail.contact.description"
              values={{
                email: (words) => (
                  <button
                    type="button"
                    className={`${contactLinkClass} cursor-pointer`}
                    onClick={openContactDialog}
                  >
                    {words}
                  </button>
                ),
                telegram: (words) => (
                  <a className={contactLinkClass} href={SITE_CONFIG.telegram} target="_blank" rel="noopener noreferrer">
                    {words}
                  </a>
                ),
              }}
            />
          </p>
        </section>
        <TransitionLink
          href={`/projects/${nextProject.id}`}
          className="group/next flex w-fit flex-col items-start gap-1 rounded-sm sm:items-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-xs text-muted-foreground">{intl.formatMessage({ id: 'detail.nextProject' })}</span>
          <span className="inline-flex items-center gap-2 text-xl font-medium tracking-tight sm:text-2xl">
            <span className="decoration-current decoration-1 underline-offset-4 group-hover/next:underline group-focus-visible/next:underline">
              {nextProject.title}
            </span>
            <ArrowRight className="size-5 transition-transform duration-200 group-hover/next:translate-x-1" aria-hidden="true" />
          </span>
        </TransitionLink>
      </div>
    </article>
  )

  return (
    <div className={styles.frame}>
      <div className={styles.pageGlow} aria-hidden="true" />
      {article}
    </div>
  )
}
