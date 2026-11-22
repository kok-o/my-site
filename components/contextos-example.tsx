'use client'

import { useState } from 'react'
import { ArrowUpRight, FileDiff } from 'lucide-react'
import { useIntl } from 'react-intl'
import { CONTEXTOS_EXAMPLE } from '@/lib/project-details'
import { cn } from '@/lib/utils'

const stages = ['edited', 'exported'] as const

export function ContextOSExample() {
  const intl = useIntl()
  const [stage, setStage] = useState<(typeof stages)[number]>('edited')
  const message = (key: string) => intl.formatMessage({ id: `project.contextos.example.${key}` })

  return (
    <figure className="grid items-center gap-6 sm:gap-9 lg:grid-cols-[4fr_5fr] lg:gap-16">
      <figcaption>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <FileDiff className="size-4" aria-hidden="true" />
          <code>{CONTEXTOS_EXAMPLE.file}</code>
        </div>
        <h2 className="max-w-md text-balance text-2xl font-semibold sm:text-3xl">{message('rule')}</h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">{message('explanation')}</p>
      </figcaption>
      <div className="min-w-0 rounded-xl bg-secondary p-4 sm:p-6">
        <div role="group" aria-label={message('compare')} className="flex flex-wrap gap-1">
          {stages.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={stage === item}
              onClick={() => setStage(item)}
              className={cn(
                'min-h-11 rounded-md px-2.5 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none sm:px-3',
                stage === item
                  ? 'bg-foreground/10 text-foreground'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
              )}
            >
              {message(item)}
            </button>
          ))}
        </div>
        <div className="px-1 pt-5">
          <p className="flex items-baseline gap-2 font-mono text-sm leading-6 text-foreground" dir="ltr">
            <span aria-hidden="true" className="select-none text-muted-foreground">$</span>
            <code>{CONTEXTOS_EXAMPLE.command}</code>
          </p>
          <pre aria-live="polite" aria-atomic="true" className="mt-2 font-mono text-sm leading-5 text-foreground/85" dir="ltr">
            <code>{JSON.stringify(CONTEXTOS_EXAMPLE.results[stage], null, 2)}</code>
          </pre>
          <a
            href={CONTEXTOS_EXAMPLE.log}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-8 items-center gap-1 rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
          >
            <span className="link-ink link-ink-rest">{message('log')}</span>
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </figure>
  )
}
