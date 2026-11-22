'use client'

import { ExternalLink } from 'lucide-react'
import { useIntl } from 'react-intl'
import { ScrollReveal } from '@/components/scroll-reveal'
import { STROQ } from '@/lib/constants'

const contributions = [
  {
    id: 'soup',
    name: 'Soup',
    technologies: 'Python, PyTorch, Transformers, TRL, pytest',
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
    technologies: 'TypeScript, Node.js, MCP',
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
    <div className="mt-16 lg:mt-20" aria-labelledby="open-source-heading">
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
            className="skill-work-target flex flex-col rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-md focus-visible:outline-primary"
          >
            <h4 className="font-heading text-xl font-semibold tracking-tight">{project.name}</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{project.technologies}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {intl.formatMessage({ id: `contributions.${project.id}.summary` })}
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {project.highlights.map((highlight, index) => (
                <li key={highlight.pulls[0]}>
                  {intl.formatMessage({ id: `contributions.${project.id}.hl${index + 1}` })}{' '}
                  {highlight.pulls.map((pull, pullIndex) => (
                    <span key={pull}>
                      {pullIndex > 0 ? ', ' : ''}
                      <a
                        href={`${project.repository}/pull/${pull}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} PR #${pull}`}
                        className="link-ink link-ink-rest rounded-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >#{pull}</a>
                    </span>
                  ))}
                </li>
              ))}
            </ul>
            <a
              href={project.changes}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-sm pt-6 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="link-ink">{intl.formatMessage({ id: 'contributions.viewChanges' })}</span>
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>
        ))}
      </ScrollReveal>
    </div>
  )
}
