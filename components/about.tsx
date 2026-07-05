'use client'

// About section

import { SITE_CONFIG, EXPERIENCE } from '@/lib/constants'
import { SectionHeading } from '@/components/section-heading'
import { ScrollReveal } from '@/components/scroll-reveal'
import { cn } from '@/lib/utils'
import { useIntl } from 'react-intl'

export function About() {
  const intl = useIntl()

  return (
    <section id="about" className="section-spacing section-container">
      <SectionHeading
        id="about-heading"
        eyebrow={intl.formatMessage({ id: 'about.eyebrow' })}
        heading={intl.formatMessage({ id: 'about.heading' })}
        description={intl.formatMessage({ id: 'about.description' })}
      />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        
        {/* Left Column — Philosophy / Bio */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32 h-fit self-start flex flex-col gap-6">
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {intl.formatMessage({ id: 'about.philosophy' })}
            </h3>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                {intl.formatMessage({ id: 'hero.tagline' })}
              </p>
              <p>
                {intl.formatMessage({ id: 'about.description_main' })}
              </p>
              <p>
                {intl.formatMessage({ id: 'about.philosophy_p1' })}
              </p>
            </div>

            {/* Stats / Highlights (Static for now, can be data-driven later) */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/50 pt-6">
              <div>
                <p className="text-3xl font-bold tracking-tighter text-foreground">10+</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{intl.formatMessage({ id: 'about.projectsShipped' })}</p>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter text-foreground">2</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{intl.formatMessage({ id: 'about.internships' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Experience Timeline */}
        <ScrollReveal stagger className="lg:col-span-7 lg:pl-12">
          <h3 className="mb-8 font-heading text-2xl font-semibold tracking-tight text-foreground">
            {intl.formatMessage({ id: 'about.experience' })}
          </h3>
          
          <div className="relative border-l border-border/50 pl-8 ml-4 lg:ml-0">
            {EXPERIENCE.map((exp, index) => (
              <div 
                key={exp.id} 
                className={cn(
                  'relative flex flex-col gap-2 pb-12 last:pb-0',
                  index === 0 ? 'opacity-100' : 'opacity-80'
                )}
              >
                {/* Timeline dot */}
                <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-background">
                  <span className={cn(
                    "h-2 w-2 rounded-full",
                    exp.current ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" : "bg-border"
                  )} />
                </span>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h4 className="text-lg font-semibold text-foreground">
                    {intl.formatMessage({ id: `exp.${exp.id.replace('exp-', '')}.role` })}
                  </h4>
                  <span className="text-sm font-medium text-muted-foreground bg-secondary/50 px-2.5 py-0.5 rounded-full w-fit">
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
    </section>
  )
}

export default About
