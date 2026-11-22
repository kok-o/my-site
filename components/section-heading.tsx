// SectionHeading — Server Component
// Reusable heading pattern: eyebrow label + main heading + optional description.
// Used by every section (Projects, About, Skills, Contact).
// Follow design_system.md section heading spec.

import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow: string
  heading: string
  description?: string
  align?: 'left' | 'center'
  compact?: boolean
  /** Additional class names for the wrapper */
  className?: string
  /** ID for aria-labelledby on the parent <section> */
  id?: string
}

export function SectionHeading({
  eyebrow,
  heading,
  description,
  align = 'left',
  compact = false,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12 flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <p className={compact ? 'text-xs font-semibold uppercase tracking-[0.2em] text-primary' : 'section-label'}>
        {eyebrow}
      </p>

      <h2
        id={id}
        className={cn(
          'font-semibold tracking-tight text-foreground',
          compact ? 'text-3xl sm:text-4xl' : 'text-balance text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08]',
        )}
      >
        {heading}
      </h2>

      {/* Optional description — body-lg, muted, max-width for readability */}
      {description && (
        <p
          className={cn(
            'text-lg leading-relaxed text-muted-foreground',
            align === 'center' ? 'max-w-2xl' : 'max-w-xl',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeading
