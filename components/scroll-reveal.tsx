'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, VIEWPORT_ONCE } from '@/lib/animations'
import type { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** Whether to use staggered entrance for children. Defaults to false. */
  stagger?: boolean
}

export function ScrollReveal({ children, className, stagger = false }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  // If reduced motion is enabled, just render a regular div without animation
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      variants={stagger ? staggerContainer : undefined}
      initial={stagger ? 'hidden' : undefined}
      whileInView={stagger ? 'visible' : undefined}
      viewport={VIEWPORT_ONCE}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
