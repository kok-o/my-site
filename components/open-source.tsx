'use client'

import { ArrowUpRight } from 'lucide-react'
import { useIntl } from 'react-intl'
import { GitHubIcon } from '@/components/icons'
import { ScrollReveal } from '@/components/scroll-reveal'
import { STROQ } from '@/lib/constants'

const contributions = [
  {
    id: 'soup',
    name: 'Soup',
    technologies: ['Python', 'PyTorch', 'Transformers', 'TRL', 'pytest'],
    repository: 'https://github.com/MakazhanAlpamys/Soup',
    changes: 'https://github.com/MakazhanAlpamys/Soup/pulls?q=is%3Apr+author%3Akok-o+is%3Amerged',
    highlights: [
      { pulls: [1972, 2024] },
      { pulls: [743] },
      { pulls: [1304] },
    ],
  },
  {
    id: 'stroq',
    name: 'Stroq',
    technologies: ['TypeScript', 'Node.js', 'MCP'],
    repository: STROQ.repository,
    changes: `${STROQ.repository}/pulls?q=is%3Apr+author%3Akok-o+is%3Amerged`,
    highlights: [
      { pulls: [194, 195] },
      { pulls: [STROQ.recoveryPull] },
    ],
  },
] as const

export function OpenSource() {
  const intl = useIntl()

  return (
    <div className="mt-20 sm:mt-24 lg:mt-36" aria-labelledby="open-source-heading">
      <h3 id="open-source-heading" className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        {intl.formatMessage({ id: 'contributions.heading' })}
      </h3>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        {intl.formatMessage({ id: 'contributions.description' })}
      </p>
      <ScrollReveal className="mt-8 grid gap-6 sm:grid-cols-2 lg:gap-8">
        {contributions.map((project) => (
          <article
            key={project.id}
            id={`contribution-${project.id}`}
            tabIndex={-1}
            className="surface-paper skill-work-target relative isolate flex flex-col overflow-hidden rounded-2xl border border-surface-border p-6 sm:p-7 focus-visible:outline-primary"
          >
            <div className="flex items-start justify-between gap-4">
              <h4 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/repo inline-flex items-center gap-2 rounded-sm transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <GitHubIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover/repo:text-foreground" aria-hidden="true" />
                  <span>{project.name}</span>
                  <ArrowUpRight
                    className="size-3.5 shrink-0 text-muted-foreground opacity-60 transition-transform duration-200 group-hover/repo:translate-x-0.5 group-hover/repo:-translate-y-0.5 group-hover/repo:opacity-100"
                    aria-hidden="true"
                  />
                </a>
              </h4>
            </div>

            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={intl.formatMessage({ id: 'detail.technologies' })}>
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md border border-border/80 bg-background/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
              {intl.formatMessage({ id: `contributions.${project.id}.summary` })}
            </p>

            <ul className="mt-5 divide-y divide-border/60 border-t border-border/60 text-sm leading-relaxed">
              {project.highlights.map((highlight, index) => (
                <li
                  key={highlight.pulls[0]}
                  className="flex flex-col gap-2 py-3 first:pt-3.5 last:pb-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="text-foreground/85">
                    {intl.formatMessage({ id: `contributions.${project.id}.hl${index + 1}` })}
                  </span>
                  <span className="flex shrink-0 flex-wrap gap-1.5">
                    {highlight.pulls.map((pull) => (
                      <a
                        key={pull}
                        href={`${project.repository}/pull/${pull}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} PR #${pull}`}
                        className="inline-flex items-center rounded-md border border-border bg-secondary/75 px-2 py-0.5 font-mono text-xs font-medium text-foreground transition-colors hover:border-[var(--folio-ink)] hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        #{pull}
                      </a>
                    ))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-border/50 pt-4">
              <a
                href={project.changes}
                target="_blank"
                rel="noopener noreferrer"
                className="group/prs inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-medium text-[var(--folio-ink)] transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="decoration-current decoration-1 underline-offset-4 group-hover/prs:underline group-focus-visible/prs:underline">
                  {intl.formatMessage({ id: 'contributions.viewChanges' })}
                </span>
                <ArrowUpRight
                  className="size-4 transition-transform duration-200 group-hover/prs:translate-x-0.5 group-hover/prs:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </article>
        ))}
      </ScrollReveal>
    </div>
  )
}
