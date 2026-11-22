'use client'

import { Moon, Sun } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import { cn } from '@/lib/utils'

// #region ink
// Pure geometry: a star-shaped ink blot whose rim is fractal noise plus thin
// tendrils, with droplets that land just ahead of the front and get swallowed.
// No React, no DOM: the test lifts this region and runs it.

export type InkShape = {
  harmonics: number[][] // [frequency, amplitude, phase, drift]
  tendrils: number[][] // [angle, width (rad), length (x R), delay (0..1)]
  drops: number[][] // [angle, distance (x Rend), size (x Rend), stretch]
  dip: number // deepest the rim can fall below R, as a fraction of R
}

const TAU = Math.PI * 2
const FREQS = [3, 5, 8, 13, 21, 34, 55, 89, 144, 233]
const ROUGH = 0.22 // summed rim amplitude, as a fraction of R

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeInk(seed: number): InkShape {
  const r = mulberry32(seed)
  // a fractal rim: every octave keeps a fair share, so the edge reads as ink, not as a wobbly circle
  const harmonics = FREQS.map((k) => [k, (0.6 + r() * 0.8) / Math.pow(k, 0.55), r() * TAU, (r() - 0.5) * 9])
  let sum = 0
  for (const h of harmonics) sum += h[1]
  for (const h of harmonics) h[1] *= ROUGH / sum
  const tendrils: number[][] = []
  // many hairline fingers and a few long runs
  for (let i = 0; i < 70; i++) tendrils.push([r() * TAU, 0.005 + r() * 0.018, 0.015 + Math.pow(r(), 1.6) * 0.14, r() * 0.7])
  for (let i = 0; i < 9; i++) tendrils.push([r() * TAU, 0.014 + r() * 0.03, 0.12 + r() * 0.22, r() * 0.45])
  const drops: number[][] = []
  for (let i = 0; i < 130; i++) drops.push([r() * TAU, 0.05 + r() * 1.0, 0.0012 + Math.pow(r(), 2.6) * 0.009, 1 + r() * 2.2])
  return { harmonics, tendrils, drops, dip: ROUGH }
}

function wrap(a: number) {
  a = a % TAU
  return a > Math.PI ? a - TAU : a < -Math.PI ? a + TAU : a
}

/** Rim radius at angle `a` for a blot of nominal radius R at progress p. */
export function rimAt(ink: InkShape, a: number, R: number, p: number) {
  let n = 0
  for (const h of ink.harmonics) n += h[1] * Math.sin(h[0] * a + h[2] + h[3] * p)
  let spike = 0
  for (const t of ink.tendrils) {
    const grow = Math.min(1, Math.max(0, (p - t[3]) / 0.3))
    if (grow <= 0) continue
    const d = wrap(a - t[0]) / t[1]
    if (d > 3 || d < -3) continue
    spike += t[2] * grow * Math.exp(-d * d)
  }
  return R * (1 + n + spike)
}

/** The radius that guarantees every corner of a w x h box is inked from (ox, oy). */
export function coverRadius(ink: InkShape, ox: number, oy: number, w: number, h: number) {
  const far = Math.max(Math.hypot(ox, oy), Math.hypot(w - ox, oy), Math.hypot(ox, h - oy), Math.hypot(w - ox, h - oy))
  return (far / (1 - ink.dip)) * 1.02
}

export function easeSpill(p: number) {
  const out = 1 - Math.pow(1 - p, 3)
  const smooth = p * p * (3 - 2 * p)
  return out * 0.55 + smooth * 0.45
}

/** An SVG/CSS path for the blot plus its droplets, all wound clockwise. */
export function inkPath(ink: InkShape, ox: number, oy: number, Rend: number, p: number, steps = 1440) {
  const R = Rend * easeSpill(p)
  if (R <= 0.5) return ""
  let d = ""
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * TAU
    const r = rimAt(ink, a, R, p)
    d += (i ? "L" : "M") + (ox + r * Math.cos(a)).toFixed(1) + " " + (oy + r * Math.sin(a)).toFixed(1)
  }
  d += "Z"
  // droplets land just ahead of the front, stretched along the direction of travel
  for (const k of ink.drops) {
    const dist = k[1] * Rend
    const born = (R - dist * 0.8) / (dist * 0.12)
    if (born <= 0) continue
    const ry = Math.max(0.6, k[2] * Rend * Math.min(1, born))
    const rx = ry * k[3]
    const c = Math.cos(k[0])
    const s = Math.sin(k[0])
    const x = ox + dist * c
    const y = oy + dist * s
    const rot = ((k[0] * 180) / Math.PI).toFixed(1)
    const head = (x + rx * c).toFixed(1) + " " + (y + rx * s).toFixed(1)
    const tail = (x - rx * c).toFixed(1) + " " + (y - rx * s).toFixed(1)
    const radii = rx.toFixed(1) + " " + ry.toFixed(1) + " " + rot
    d += "M" + head + "A" + radii + " 1 1 " + tail + "A" + radii + " 1 1 " + head + "Z"
  }
  return d
}
// #endregion

export type InkTheme = 'light' | 'dark'
type PointerOrigin = { x: number; y: number }
export type InkSpillContext = {
  theme: InkTheme
  toggle: (from?: Element | null, pointer?: PointerOrigin) => void
  spilling: boolean
}

export type InkSpillThemeSwitchProps = {
  children: ReactNode | ((context: InkSpillContext) => ReactNode)
  defaultTheme?: InkTheme
  duration?: number
  height?: string | number
  onThemeChange?: (theme: InkTheme) => void
  className?: string
  style?: CSSProperties
} & (
  | { viewport?: false; theme?: InkTheme }
  | { viewport: true; theme: InkTheme; onThemeChange: (theme: InkTheme) => void }
)

const InkContext = createContext<InkSpillContext | null>(null)
const NO_MOTION = '(prefers-reduced-motion: reduce)'
const idleToggle = () => {}

type ActiveViewportSpill = {
  theme: InkTheme
  finish: (commit?: boolean) => void
}

let activeViewportSpill: ActiveViewportSpill | undefined

/** Release the old viewport before a route takes a snapshot of its own. */
export function finishThemeTransition() {
  activeViewportSpill?.finish()
}

type SpillArea = { x: number; y: number; width: number; height: number }
// The texture is a raster of inkPath(makeInk(74123), ..., 0.53). Its tip
// points down and its solid center covers a radius of 32% of its width.
const INK_TEXTURE = '/ink-blot.png'
const SOLID_RADIUS = 0.32

function radialFrames({ x, y, width, height }: SpillArea, inverse: boolean) {
  const far = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
  return [24, far / SOLID_RADIUS].map(side => ({
    maskSize: (inverse ? '100% 100%, ' : '') + `${side}px ${side}px`,
    maskPosition: (inverse ? '0px 0px, ' : '') + `${x - side / 2}px ${y - side / 2}px`,
  }))
}

function viewportMask({ x, y, width, height }: SpillArea) {
  const side = Math.hypot(width, height) / (2 * SOLID_RADIUS)
  // The leading droplet touches the toggle first. At the end the solid
  // center of the blot encloses all four corners.
  const startX = x
  const startY = y - side * (0.997 - 0.5)
  const dx = width / 2 - startX
  const dy = height / 2 - startY
  // Size the mask once to the union of the start and end viewports.
  const left = Math.min(0, -dx) - 1
  const top = Math.min(0, -dy) - 1
  return {
    dx,
    dy,
    mask: {
      left: `${left}px`, top: `${top}px`,
      width: `${width + Math.abs(dx) + 2}px`, height: `${height + Math.abs(dy) + 2}px`,
      maskSize: `100% 100%, ${side}px ${side}px`,
      maskPosition: `0 0, ${startX - left - side / 2}px ${startY - top - side / 2}px`,
    },
    snapshot: { left: `${-left}px`, top: `${-top}px`, width: `${width}px`, height: `${height}px` },
  }
}

function slideFrames(dx: number, dy: number) {
  return [{ transform: 'translate(0px, 0px)' }, { transform: `translate(${dx}px, ${dy}px)` }]
}

const spillTiming = { easing: 'cubic-bezier(.18,.37,.52,.94)', fill: 'both' } as const

function getOrigin(rect: DOMRect, from?: Element | null) {
  const button = from?.getBoundingClientRect()
  return button
    ? { x: button.left + button.width / 2 - rect.left, y: button.top + button.height / 2 - rect.top }
    : { x: rect.width - 48, y: 40 }
}

function startViewportSpill(
  theme: InkTheme,
  from: Element | null | undefined,
  pointer: PointerOrigin | undefined,
  duration: number,
  apply: () => void,
  setSpilling: (spilling: boolean) => void,
) {
  const root = document.documentElement
  const width = window.innerWidth
  const height = window.innerHeight
  const { x, y } = pointer ?? getOrigin(new DOMRect(0, 0, width, height), from)
  const media = window.matchMedia(NO_MOTION)
  const currentTransition = (document as Document & {
    activeViewTransition?: ViewTransition | null
  }).activeViewTransition

  if (currentTransition) {
    void currentTransition.ready.catch(() => {})
    currentTransition.skipTransition()
    applyThemeWithoutTransition(apply)
    return
  }

  if (typeof document.startViewTransition !== 'function' ||
      !supportsInkMask() || typeof KeyframeEffect === 'undefined' || !('pseudoElement' in KeyframeEffect.prototype)) {
    applyThemeWithoutTransition(apply)
    return
  }

  const area = { x, y, width, height }
  const mask = y <= Math.min(96, height / 5) ? viewportMask(area) : null
  let transition: ViewTransition | undefined
  const effects: Animation[] = []
  let applied = false
  const finish = (commit = true) => {
    if (activeViewportSpill?.finish !== finish) return
    activeViewportSpill = undefined
    transition?.skipTransition()
    for (const effect of effects) effect.cancel()
    media.removeEventListener('change', cancel)
    window.removeEventListener('resize', cancel)
    window.removeEventListener('scroll', cancel)
    setSpilling(false)
    delete root.dataset.themeSpillPhase
    if (commit && !applied) applyThemeWithoutTransition(apply)
  }
  const cancel = () => finish()
  activeViewportSpill = { theme, finish }
  media.addEventListener('change', cancel)
  window.addEventListener('resize', cancel)
  // The old viewport is fixed in place. Release it before the page scrolls.
  window.addEventListener('scroll', cancel, { passive: true })
  root.dataset.themeSpillPhase = 'capture'

  try {
    transition = document.startViewTransition(() => {
      if (activeViewportSpill?.finish !== finish) return
      // Capture the old viewport and let the updated, live page accept input.
      root.dataset.themeSpillPhase = mask ? 'reveal' : 'radial'
      setSpilling(true)
      apply()
      applied = true
    })
    void transition.ready.then(() => {
      if (activeViewportSpill?.finish !== finish) return
      const timing = { ...spillTiming, duration }
      const old = '::view-transition-old(root)'
      const pair = '::view-transition-image-pair(root)'
      let animation: Animation
      if (mask) {
        // Set dimensions once on the two snapshots without changing the document stylesheet.
        const fixed = { duration: 0, fill: 'both' } as const
        effects.push(root.animate([mask.mask, mask.mask], { ...fixed, pseudoElement: pair }))
        effects.push(root.animate([mask.snapshot, mask.snapshot], { ...fixed, pseudoElement: old }))
        // The mask and the old screenshot travel by equal, opposite distances.
        // All pixels of the page stay still as the cached ink front advances.
        effects.push(root.animate(slideFrames(-mask.dx, -mask.dy), { ...timing, pseudoElement: old }))
        animation = root.animate(slideFrames(mask.dx, mask.dy), { ...timing, pseudoElement: pair })
      } else {
        animation = root.animate(radialFrames(area, true), { ...timing, pseudoElement: old })
      }
      effects.push(animation)
      void animation.finished.then(cancel, cancel)
    }).catch(cancel)
    void transition.finished.then(cancel, cancel)
  } catch {
    finish()
  }
}

type LayerSpill = SpillArea & { theme: InkTheme }

function supportsInkMask() {
  return typeof Element.prototype.animate === 'function' && CSS.supports('mask-composite', 'subtract')
}

function applyThemeWithoutTransition(apply: () => void) {
  const root = document.documentElement
  root.dataset.themeSwitchInstant = ''
  try {
    apply()
    // Compute the new palette before re-enabling color transitions.
    getComputedStyle(document.body).getPropertyValue('background-color')
  } finally {
    delete root.dataset.themeSwitchInstant
  }
}

export default function InkSpillThemeSwitch({
  children,
  theme: controlledTheme,
  defaultTheme = 'light',
  duration = 1400,
  height = '100svh',
  onThemeChange,
  className,
  style,
  viewport = false,
}: InkSpillThemeSwitchProps) {
  const [localTheme, setLocalTheme] = useState(defaultTheme)
  const theme = controlledTheme ?? localTheme
  const [spill, setSpill] = useState<LayerSpill | null>(null)
  const [viewportSpilling, setViewportSpilling] = useState(false)
  const [stage, setStage] = useState<HTMLDivElement | null>(null)
  const base = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const spilling = viewport ? viewportSpilling : !!spill

  useEffect(() => {
    const texture = new Image()
    texture.src = INK_TEXTURE
    void texture.decode().catch(() => {})
  }, [])

  const applyTheme = useCallback((next: InkTheme) => {
    if (controlledTheme === undefined) setLocalTheme(next)
    onThemeChange?.(next)
  }, [controlledTheme, onThemeChange])

  const toggle = useCallback((from?: Element | null, pointer?: PointerOrigin) => {
    const pending = viewport ? activeViewportSpill : undefined
    const current = pending?.theme ?? theme
    const next = current === 'dark' ? 'light' : 'dark'
    const motion = !window.matchMedia(NO_MOTION).matches && duration > 0

    if (viewport) {
      pending?.finish(false)
      const apply = () => flushSync(() => applyTheme(next))
      if (motion && !pending) startViewportSpill(next, from, pointer, duration, apply, setViewportSpilling)
      else applyThemeWithoutTransition(apply)
      return
    }

    if (!stage || spill) return
    if (!motion || !supportsInkMask()) {
      applyTheme(next)
      return
    }
    const rect = stage.getBoundingClientRect()
    setSpill({
      theme: next,
      ...getOrigin(rect, from),
      width: rect.width,
      height: rect.height,
    })
  }, [applyTheme, duration, spill, stage, theme, viewport])

  useLayoutEffect(() => {
    const upper = top.current
    const lower = base.current
    if (!spill || !upper || !lower) return

    const syncScroll = () => { upper.scrollTop = lower.scrollTop }
    syncScroll()
    lower.addEventListener('scroll', syncScroll, { passive: true })
    const media = window.matchMedia(NO_MOTION)
    let animation: Animation | undefined
    let disposed = false
    const finish = () => {
      if (disposed) return
      setSpill(null)
      applyTheme(spill.theme)
    }
    try {
      animation = upper.animate(radialFrames(spill, false), { ...spillTiming, duration })
      void animation.finished.then(finish, finish)
    } catch {
      finish()
    }
    media.addEventListener('change', finish)
    window.addEventListener('resize', finish)
    return () => {
      disposed = true
      animation?.cancel()
      lower.removeEventListener('scroll', syncScroll)
      media.removeEventListener('change', finish)
      window.removeEventListener('resize', finish)
    }
  }, [spill, duration, applyTheme])

  useEffect(() => {
    if (viewport) return () => activeViewportSpill?.finish(false)
  }, [viewport])

  const context = { theme, toggle, spilling }
  const content = typeof children === 'function' ? children(context) : children

  if (viewport) return <InkContext.Provider value={context}>{content}</InkContext.Provider>

  return (
    <InkContext.Provider value={context}>
      <div ref={setStage} className={cn('ink-spill-stage', className)} style={{ height, ...style }}>
        <div ref={base} className="ink-spill-layer" data-theme={theme}>
          {content}
        </div>
        {spill && (
          <div ref={top} className="ink-spill-layer ink-spill-top" data-theme={spill.theme} aria-hidden inert>
            {typeof children === 'function' ? children({ theme: spill.theme, toggle: idleToggle, spilling: true }) : children}
          </div>
        )}
      </div>
    </InkContext.Provider>
  )
}

export function useInkSpillTheme() {
  const context = useContext(InkContext)
  if (!context) throw new Error('InkThemeToggle must be inside InkSpillThemeSwitch')
  return context
}

/** A sun/moon button that anchors the ink spill at its center. */
export function InkThemeToggle({
  theme,
  toggle,
  'aria-label': label,
  className,
  style,
}: {
  theme: InkTheme
  toggle: InkSpillContext['toggle']
  'aria-label'?: string
  className?: string
  style?: CSSProperties
}) {
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={(event) => toggle(event.currentTarget, event.detail > 0 ? { x: event.clientX, y: event.clientY } : undefined)}
      aria-label={label ?? (dark ? 'Switch to light mode' : 'Switch to dark mode')}
      aria-pressed={dark}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full border border-current/20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      style={style}
    >
      {dark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  )
}
