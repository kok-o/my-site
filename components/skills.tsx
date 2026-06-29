'use client'

// Skills section

import { SKILL_CATEGORIES } from '@/lib/constants'
import { SectionHeading } from '@/components/section-heading'
import { ScrollReveal } from '@/components/scroll-reveal'
import { cn } from '@/lib/utils'
import { useIntl } from 'react-intl'

export function Skills() {
  const intl = useIntl()

  return (
    <section id="skills" className="section-spacing section-container">
      <SectionHeading
        id="skills-heading"
        eyebrow={intl.formatMessage({ id: 'skills.eyebrow' })}
        heading={intl.formatMessage({ id: 'skills.heading' })}
        description={intl.formatMessage({ id: 'skills.description' })}
        align="center"
      />

      {/* Grid of skill categories */}
      <ScrollReveal stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {SKILL_CATEGORIES.map((category) => (
          <div
            key={category.category}
            className={cn(
              'flex flex-col gap-6 rounded-2xl p-6',
              'border border-border/50 bg-card/50 shadow-sm backdrop-blur-md transition-colors hover:bg-card',
            )}
          >
            <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground border-b border-border/50 pb-4">
              {category.category}
            </h3>
            
            <ul className="flex flex-wrap gap-2" aria-label={`Skills for ${category.category}`}>
              {category.skills.map((skill) => (
                <li
                  key={skill.name}
                  className={cn(
                    'inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium',
                    'bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground'
                  )}
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ScrollReveal>
    </section>
  )
}

export default Skills
