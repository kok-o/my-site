'use client'

import { useEffect, useRef } from 'react'
import { createRidgeRenderer } from './footer-ridgelines'
import styles from './footer.module.css'

export function FooterRidges() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let paint: ReturnType<typeof createRidgeRenderer> | undefined
    let ink: [number, number, number] | undefined
    let visible = false
    let frame = 0
    let lastDraw = 0
    let age = motion.matches ? Infinity : 0
    let fogTime = 0
    let gust = 0
    let inside = false
    let targetX = 0.5
    let targetY = 0.5
    let x = targetX
    let y = targetY
    let clearing = 0
    let parallax = 0

    const wake = () => {
      if (visible && !document.hidden && !frame) frame = requestAnimationFrame(draw)
    }

    const draw = (now: number) => {
      frame = 0
      // Reading a theme token can force style calculation across the page.
      // Resolve the palette only when the panorama is visible and needs paint.
      if (!ink) {
        const [r, g, b] = getComputedStyle(canvas).getPropertyValue('--ridge-rgb').trim().split(/\s+/).map(Number)
        ink = [r, g, b]
      }
      if (!paint) {
        const bounds = canvas.getBoundingClientRect()
        if (!bounds.width || !bounds.height) return
        // Keep the dither pixels crisp and the cost bounded on ultrawide displays.
        const pixel = Math.max(2, Math.ceil(Math.sqrt(bounds.width * bounds.height / 110_000)))
        canvas.width = Math.ceil(bounds.width / pixel)
        canvas.height = Math.ceil(bounds.height / pixel)
        paint = createRidgeRenderer(ctx, canvas.width, canvas.height, pixel)
      }
      const elapsed = lastDraw ? now - lastDraw : 0
      if (!lastDraw || elapsed >= (inside || age < 2700 ? 32 : 64) || motion.matches) {
        const dt = Math.min(elapsed, 100)
        lastDraw = now
        if (motion.matches) {
          age = Infinity
          clearing = parallax = gust = 0
        } else {
          age += dt
          const follow = 1 - Math.exp(-dt / 85)
          const settle = 1 - Math.exp(-dt / 220)
          x += (targetX - x) * follow
          y += (targetY - y) * follow
          clearing += (Number(inside) - clearing) * settle
          parallax += ((inside ? targetX * 2 - 1 : 0) - parallax) * settle
          gust *= Math.exp(-dt / 470)
          fogTime += dt / 1000 * (0.045 + gust)
        }
        paint({ age, fogTime, pointerX: x, pointerY: y, clearing, parallax, ink })
        if (!canvas.hasAttribute('data-drawn')) canvas.dataset.drawn = ''
      }
      if (!motion.matches) wake()
    }

    const refresh = () => {
      cancelAnimationFrame(frame)
      frame = lastDraw = 0
      wake()
    }
    const invalidateColor = () => {
      ink = undefined
      refresh()
    }
    const move = (event: PointerEvent) => {
      if (motion.matches || event.pointerType === 'touch') return
      const bounds = canvas.getBoundingClientRect()
      targetX = (event.clientX - bounds.left) / bounds.width
      targetY = (event.clientY - bounds.top) / bounds.height
      if (!inside) {
        x = targetX
        y = targetY
      }
      inside = true
    }
    const leave = () => { inside = false }
    const blowMist = (event: MouseEvent) => {
      if (motion.matches) return
      const bounds = canvas.getBoundingClientRect()
      gust = event.clientX < bounds.left + bounds.width / 2 ? 1.4 : -1.4
    }

    const theme = new MutationObserver(invalidateColor)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const size = new ResizeObserver(() => {
      paint = undefined
      refresh()
    })
    size.observe(canvas)
    const viewport = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (!visible) leave()
      refresh()
    })
    viewport.observe(canvas)
    motion.addEventListener('change', refresh)
    document.addEventListener('visibilitychange', refresh)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    canvas.addEventListener('click', blowMist)
    return () => {
      cancelAnimationFrame(frame)
      theme.disconnect()
      size.disconnect()
      viewport.disconnect()
      motion.removeEventListener('change', refresh)
      document.removeEventListener('visibilitychange', refresh)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('click', blowMist)
    }
  }, [])

  return (
    <div className={styles.ridges}>
      <canvas ref={canvasRef} />
      <div className={styles.ridgeFallback} />
    </div>
  )
}
