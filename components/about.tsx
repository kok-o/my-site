// About section — Server Component

import { SITE_CONFIG, EXPERIENCE } from '@/lib/constants'
import { SectionHeading } from '@/components/section-heading'
import { ScrollReveal } from '@/components/scroll-reveal'
import { cn } from '@/lib/utils'

export function About() {
  return (
    <section id="about" className="section-spacing section-container">
      <SectionHeading
        id="about-heading"
        eyebrow="About Me"
        heading="Background & Experience"
        description="A blend of engineering, design, and AI to build products that solve real problems."
      />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        
        {/* Left Column — Philosophy / Bio */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-32 h-fit self-start flex flex-col gap-6">
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              My Philosophy
            </h3>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                {SITE_CONFIG.tagline}
              </p>
              <p>
                {SITE_CONFIG.description}
              </p>
              <p>
                I believe that the best software is not just functional, but an absolute joy to use. By combining cutting-edge AI capabilities with meticulous frontend architecture, I strive to create web experiences that feel native, fast, and intelligent.
              </p>
            </div>

            {/* Stats / Highlights (Static for now, can be data-driven later) */}
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border/50 pt-6">
              <div>
                <p className="text-3xl font-bold tracking-tighter text-foreground">5+</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">Projects Shipped</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Experience Timeline */}
        <ScrollReveal stagger className="lg:col-span-7 lg:pl-12">
          <h3 className="mb-8 font-heading text-2xl font-semibold tracking-tight text-foreground">
            Experience
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
                    {exp.role}
                  </h4>
                  <span className="text-sm font-medium text-muted-foreground bg-secondary/50 px-2.5 py-0.5 rounded-full w-fit">
                    {exp.period}
                  </span>
                </div>

                <p className="text-base font-medium text-primary/90">
                  {exp.company}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>

                <ul className="mt-4 flex flex-col gap-2">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1 shrink-0">•</span>
                      <span className="leading-relaxed">{highlight}</span>
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
