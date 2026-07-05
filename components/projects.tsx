'use client'

// Projects section
// Renders the list of projects using the ProjectCard component.

import { PROJECTS } from '@/lib/constants'
import { SectionHeading } from '@/components/section-heading'
import { ProjectCard } from '@/components/project-card'
import { ScrollReveal } from '@/components/scroll-reveal'
import { useIntl } from 'react-intl'

export function Projects() {
  const intl = useIntl()

  return (
    <section id="projects" className="section-spacing section-container">
      <SectionHeading
        id="projects-heading"
        eyebrow={intl.formatMessage({ id: 'projects.eyebrow' })}
        heading={intl.formatMessage({ id: 'projects.heading' })}
        description={intl.formatMessage({ id: 'projects.description' })}
      />

      {/* Grid of projects with staggered reveal animation */}
      <ScrollReveal stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ScrollReveal>
    </section>
  )
}

export default Projects
