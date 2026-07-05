'use client'

// Skills section — animated tags and card reveals

import { motion, useReducedMotion } from 'framer-motion'
import { SKILL_CATEGORIES } from '@/lib/constants'
import { SectionHeading } from '@/components/section-heading'
import { ScrollReveal } from '@/components/scroll-reveal'
import { tagPop, tagStagger, fadeInUp, VIEWPORT_ONCE } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { useIntl } from 'react-intl'

export function Skills() {
  const intl = useIntl()
  const shouldReduceMotion = useReducedMotion()

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
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {SKILL_CATEGORIES.map((category, catIndex) => (
          <motion.div
            key={category.category}
            variants={shouldReduceMotion ? undefined : fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            custom={catIndex}
            transition={{ delay: catIndex * 0.1 }}
            whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.2 } }}
            className={cn(
              'flex flex-col gap-6 rounded-2xl p-6',
              'border border-border/50 bg-card/50 shadow-sm backdrop-blur-md',
              'transition-colors hover:bg-card hover:border-primary/20 hover:shadow-glow',
            )}
          >
            <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground border-b border-border/50 pb-4">
              {category.category}
            </h3>

            <motion.ul
              variants={shouldReduceMotion ? undefined : tagStagger}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="flex flex-wrap gap-2"
              aria-label={`Skills for ${category.category}`}
            >
              {category.skills.map((skill) => (
                <motion.li
                  key={skill.name}
                  variants={shouldReduceMotion ? undefined : tagPop}
                  whileHover={shouldReduceMotion ? undefined : {
                    scale: 1.08,
                    transition: { type: 'spring', damping: 15, stiffness: 300 },
                  }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                  className={cn(
                    'inline-flex cursor-default items-center rounded-md px-3 py-1.5 text-sm font-medium',
                    'bg-secondary text-secondary-foreground',
                    'transition-colors duration-200 hover:bg-primary hover:text-primary-foreground',
                  )}
                >
                  {skill.name}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default Skills
