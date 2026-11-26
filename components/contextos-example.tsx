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
    <figure className="surface-paper relative isolate grid items-center gap-6 overflow-hidden rounded-2xl border border-surface-border p-5 sm:gap-8 sm:p-8 lg:grid-cols-[4fr_5fr] lg:gap-12 lg:p-10">
      <figcaption>
        <div className="mb-3.5 inline-flex items-center gap-2 rounded-md border border-border/80 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground">
          <FileDiff className="size-3.5" aria-hidden="true" />
          <code className="font-mono">{CONTEXTOS_EXAMPLE.file}</code>
        </div>
        <h2 className="max-w-md text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{message('rule')}</h2>
        <p className="mt-3.5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">{message('explanation')}</p>
      </figcaption>
      <div className="min-w-0 rounded-xl border border-border/75 bg-background/70 p-4 sm:p-5">
        <div role="group" aria-label={message('compare')} className="flex flex-wrap gap-1.5 border-b border-border/60 pb-3">
          {stages.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={stage === item}
              onClick={() => setStage(item)}
              className={cn(
                'min-h-9 cursor-pointer rounded-md px-3 text-xs font-medium transition-colors duration-200 motion-reduce:transition-none sm:text-sm',
                stage === item
                  ? 'bg-foreground/12 text-foreground'
                  : 'text-muted-foreground hover:bg-foreground/6 hover:text-foreground',
              )}
            >
              {message(item)}
            </button>
          ))}
        </div>
        <div className="px-1 pt-4">
          <p className="flex items-baseline gap-2 overflow-x-auto font-mono text-xs leading-6 text-foreground sm:text-sm" dir="ltr">
            <span aria-hidden="true" className="select-none text-muted-foreground">$</span>
            <code>{CONTEXTOS_EXAMPLE.command}</code>
          </p>
          <pre aria-live="polite" aria-atomic="true" className="mt-2.5 overflow-x-auto rounded-lg border border-border/60 bg-background/80 p-3 font-mono text-xs leading-5 text-foreground/85 sm:text-sm" dir="ltr">
            <code>{JSON.stringify(CONTEXTOS_EXAMPLE.results[stage], null, 2)}</code>
          </pre>
          <a
            href={CONTEXTOS_EXAMPLE.log}
            target="_blank"
            rel="noopener noreferrer"
            className="group/log mt-4 inline-flex min-h-8 items-center gap-1 rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="decoration-current decoration-1 underline-offset-4 group-hover/log:underline group-focus-visible/log:underline">
              {message('log')}
            </span>
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </figure>
  )
}
