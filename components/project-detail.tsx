'use client'

import { ArrowRight, ArrowUpRight, BookOpen, Braces, MessagesSquare, Settings2, SquareTerminal, UserRound } from 'lucide-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ContextOSExample } from '@/components/contextos-example'
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
  const details = PROJECT_DETAILS[project.id]
  const message = (suffix: string) => intl.formatMessage({ id: `project.${project.id}.detail.${suffix}` })
  const contactLinkClass = 'link-ink link-ink-rest rounded-sm text-foreground'

  const article = (
    <article className="section-container flex flex-col gap-16 pt-28 pb-16 sm:gap-24 sm:pt-36 sm:pb-24 lg:gap-32 lg:pt-44">
      <header className={project.id === 'contextos' ? styles.header : styles.illustratedHeader}>
        <h1 className="text-balance font-heading text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl">
          {project.title}.
        </h1>
        <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:mt-6 sm:text-2xl">
          {message('subtitle')}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-1 sm:mt-8">
          <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {[
              ['year', project.year],
              ['kind', intl.formatMessage({ id: `detail.${details.kind}` })],
              ['platform', intl.formatMessage({ id: `detail.${details.platform}` })],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="sr-only">{intl.formatMessage({ id: `detail.${label}` })}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-x-5 text-sm font-medium text-foreground">
            {project.githubHref && (
              <a href={project.githubHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-sm">
                <GitHubIcon className="size-4" aria-hidden="true" />
                <span className="link-ink">{intl.formatMessage({ id: 'project.source' })}</span>
              </a>
            )}
            {project.href && (
              <a href={project.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-sm">
                <span className="link-ink">{intl.formatMessage({ id: 'project.liveDemo' })}</span>
                <ArrowUpRight className="size-4" aria-hidden="true" />
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

      <div className="grid gap-14 md:grid-cols-2 md:gap-16 lg:gap-28">
        <section aria-labelledby="project-about-heading">
          <h2 id="project-about-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {intl.formatMessage({ id: 'detail.about' })}
          </h2>
          <p className="mt-6 max-w-prose leading-7 text-muted-foreground">{message('about')}</p>
          <h3 className="mt-10 text-base font-medium">{intl.formatMessage({ id: 'detail.technologies' })}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{message('stack')}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={intl.formatMessage({ id: 'detail.technologies' })}>
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-md bg-secondary px-2.5 py-1 text-xs text-muted-foreground">{tag}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="project-features-heading">
          <h2 id="project-features-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {intl.formatMessage({ id: 'detail.features' })}
          </h2>
          <ul className="mt-6 space-y-7 sm:space-y-8">
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

      <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
        <section aria-labelledby="project-contact-heading">
          <h2 id="project-contact-heading" className="text-xl font-medium tracking-tight sm:text-2xl">
            {intl.formatMessage({ id: 'detail.contact.heading' })}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <FormattedMessage id="detail.contact.description" values={{
              email: (words) => <a className={contactLinkClass} href={`mailto:${SITE_CONFIG.email}`}>{words}</a>,
              telegram: (words) => <a className={contactLinkClass} href={SITE_CONFIG.telegram} target="_blank" rel="noopener noreferrer">{words}</a>,
            }} />
          </p>
        </section>
        <TransitionLink
          href={`/projects/${nextProject.id}`}
          className="flex w-fit flex-col items-start gap-1 rounded-sm sm:items-end"
        >
          <span className="text-xs text-muted-foreground">{intl.formatMessage({ id: 'detail.nextProject' })}</span>
          <span className="inline-flex items-center gap-2 text-xl font-medium tracking-tight sm:text-2xl">
            <span className="link-ink">{nextProject.title}</span>
            <ArrowRight className="size-5" aria-hidden="true" />
          </span>
        </TransitionLink>
      </div>
    </article>
  )

  return <div className={styles.frame}>{article}</div>
}
