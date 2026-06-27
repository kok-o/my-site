// =============================================================================
// ANIMATION PRESETS — Framer Motion variants
// All animation definitions live here. Import into components as needed.
// Timing: 150-300ms micro-interactions, 400-600ms reveals, exit < enter.
// GPU-only: animate `transform` and `opacity` only.
// =============================================================================

import type { Variants, Transition } from 'framer-motion'

// ---------------------------------------------------------------------------
// Shared Transitions
// ---------------------------------------------------------------------------
export const SPRING_SMOOTH: Transition = {
  type: 'spring',
  damping: 20,
  stiffness: 90,
}

export const EASE_OUT_EXPO: Transition = {
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
}

export const EASE_OUT_FAST: Transition = {
  duration: 0.2,
  ease: [0.16, 1, 0.3, 1],
}

// ---------------------------------------------------------------------------
// Entrance Animations (scroll-triggered)
// ---------------------------------------------------------------------------

/** Fade up — primary entrance for sections and cards */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: EASE_OUT_EXPO,
  },
}

/** Fade in — for overlays, modals, images */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

/** Scale up — for featured cards or hero elements */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: EASE_OUT_EXPO,
  },
}

/** Slide in from left */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: EASE_OUT_EXPO,
  },
}

/** Slide in from right */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: EASE_OUT_EXPO,
  },
}

// ---------------------------------------------------------------------------
// Container / Stagger
// ---------------------------------------------------------------------------

/** Stagger container — wraps grids/lists to stagger children */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

/** Hero stagger — slower stagger for hero section */
export const heroStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

// ---------------------------------------------------------------------------
// Interactive (hover / tap)
// ---------------------------------------------------------------------------

/** Card hover — scale with GPU-only transform */
export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
}

/** Button hover — subtle scale */
export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.15 } },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
}

/** Icon button hover — rotate on hover */
export const iconHover: Variants = {
  rest: { rotate: 0 },
  hover: { rotate: 12, transition: { duration: 0.2 } },
}

// ---------------------------------------------------------------------------
// Ambient / Decorative (used sparingly — hero only)
// ---------------------------------------------------------------------------

/** Slow float — for decorative hero background elements */
export const float: Variants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/** Gradient blob pulse */
export const blobPulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.6, 0.8, 0.6],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

/** Navbar entrance on page load */
export const navbarEntrance: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', delay: 0.1 },
  },
}

/** Mobile menu overlay */
export const mobileMenuOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const mobileMenuItems: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: EASE_OUT_EXPO,
  },
}

// ---------------------------------------------------------------------------
// Viewport defaults (used with whileInView)
// ---------------------------------------------------------------------------

/** Standard viewport config for scroll-triggered animations */
export const VIEWPORT_ONCE = { once: true, margin: '-80px' } as const
