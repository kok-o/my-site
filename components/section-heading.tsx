// SectionHeading — Server Component
// Reusable heading pattern: eyebrow label + main heading + optional description.
// Used by every section (Projects, About, Skills, Contact).
// Follow design_system.md section heading spec.

import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  eyebrow: string
  heading: string
  description?: string
  /** Align text. Defaults to 'left'. */
  align?: 'left' | 'center'
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
      {/* Eyebrow — uppercase, accent blue, tracking-widest */}
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>

      {/* Main heading — h2 scale, tight tracking */}
      <h2
        id={id}
        className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
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
