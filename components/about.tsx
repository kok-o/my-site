'use client'

// About section

import { EXPERIENCE } from '@/lib/constants'
import { SectionHeading } from '@/components/section-heading'
import { ScrollReveal } from '@/components/scroll-reveal'
import { cn } from '@/lib/utils'
import { useIntl } from 'react-intl'
import { OpenSource } from '@/components/open-source'

export function About() {
  const intl = useIntl()

  return (
    <section id="about" aria-labelledby="about-heading" className="experience-section section-spacing">
      <div className="section-container">
        <SectionHeading
          id="about-heading"
          eyebrow={intl.formatMessage({ id: 'about.eyebrow' })}
          heading={intl.formatMessage({ id: 'about.heading' })}
          description={intl.formatMessage({ id: 'about.description' })}
        />

        <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8">

          {/* Left Column — Philosophy / Bio */}
          <div className="relative lg:col-span-5 lg:sticky lg:top-32">
            <ScrollReveal className="flex h-fit flex-col gap-6">
              <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {intl.formatMessage({ id: 'about.philosophy' })}
              </h3>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  {intl.formatMessage({ id: 'about.description_main' })}
                </p>
                <p>
                  {intl.formatMessage({ id: 'about.philosophy_p1' })}
                </p>
              </div>

              {/* A conservative public contribution count, linked to accepted work. */}
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <a
                    href="https://github.com/MakazhanAlpamys/Soup/pulls?q=is%3Apr+author%3Akok-o+is%3Amerged"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-ink block w-fit rounded-sm text-3xl font-bold tracking-tighter text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >80+</a>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{intl.formatMessage({ id: 'about.contributions' })}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tighter text-foreground">2</p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{intl.formatMessage({ id: 'about.internships' })}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column — Experience Timeline */}
          <ScrollReveal stagger className="lg:col-span-7 lg:pl-12">
            <h3 className="mb-8 font-heading text-2xl font-semibold tracking-tight text-foreground">
              {intl.formatMessage({ id: 'about.experience' })}
            </h3>

            <div className="relative ml-2 border-l border-[color-mix(in_srgb,var(--folio-ink)_40%,transparent)] pl-7">
              {EXPERIENCE.map((exp) => (
                <div key={exp.id} className="relative flex flex-col gap-2 pb-12 last:pb-0">
                  {/* Timeline dot */}
                  <span aria-hidden="true" className={cn(
                    'absolute top-2 -left-[35px] size-3 rounded-full border-2 border-[var(--folio-ink)]',
                    exp.current ? 'bg-[var(--folio-ink)]' : 'bg-background',
                  )} />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <h4 className="text-lg font-semibold text-foreground">
                      {intl.formatMessage({ id: `exp.${exp.id.replace('exp-', '')}.role` })}
                    </h4>
                    <span className="w-fit shrink-0 text-sm font-medium text-[var(--folio-ink)]">
                      {intl.formatMessage({ id: `exp.${exp.id.replace('exp-', '')}.period` })}
                    </span>
                  </div>

                  <p className="text-base font-medium text-primary/90">
                    {intl.formatMessage({ id: `exp.${exp.id.replace('exp-', '')}.company` })}
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {intl.formatMessage({ id: `exp.${exp.id.replace('exp-', '')}.description` })}
                  </p>

                  <ul className="mt-4 flex flex-col gap-2">
                    {exp.highlights.map((_, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1 shrink-0">•</span>
                        <span className="leading-relaxed">{intl.formatMessage({ id: `exp.${exp.id.replace('exp-', '')}.hl${i + 1}` })}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollReveal>

        </div>
        <OpenSource />
      </div>
    </section>
  )
}

export default About
