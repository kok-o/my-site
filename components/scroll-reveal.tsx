'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  staggerContainer,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeIn,
  VIEWPORT_ONCE,
} from '@/lib/animations'
import type { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** Whether to use staggered entrance for children. Defaults to false. */
  stagger?: boolean
  /** Direction of entrance animation. Defaults to 'up'. */
  direction?: Direction
  /** Delay before animation starts (seconds). Defaults to 0. */
  delay?: number
  /** Custom Framer Motion variants (overrides direction). */
  variants?: Variants
}

const directionVariants: Record<Direction, Variants> = {
  up: fadeInUp,
  down: fadeInDown,
  left: fadeInLeft,
  right: fadeInRight,
  none: fadeIn,
}

export function ScrollReveal({
  children,
  className,
  stagger = false,
  direction = 'up',
  delay = 0,
  variants: customVariants,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  // If stagger, use stagger container — children animate themselves
  if (stagger) {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  // Single element reveal
  const chosen = customVariants ?? directionVariants[direction]

  // Inject delay into the visible transition
  const withDelay: Variants = delay > 0
    ? {
        hidden: chosen.hidden,
        visible: {
          ...(typeof chosen.visible === 'object' ? chosen.visible : {}),
          transition: {
            ...(typeof chosen.visible === 'object' && 'transition' in chosen.visible
              ? (chosen.visible as { transition?: object }).transition
              : {}),
            delay,
          },
        },
      }
    : chosen

  return (
    <motion.div
      variants={withDelay}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
