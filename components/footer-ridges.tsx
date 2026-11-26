'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { createRidgeRenderer, type RidgePalette } from './footer-ridgelines'
import styles from './footer.module.css'

function parseRgb(raw: string, fallback: [number, number, number]): [number, number, number] {
  const parts = raw.trim().split(/\s+/).map(Number)
  return parts.length === 3 && parts.every(Number.isFinite)
    ? [parts[0], parts[1], parts[2]]
    : fallback
}

interface FooterRidgesProps {
  landscapeRef: RefObject<HTMLDivElement | null>
}

export function FooterRidges({ landscapeRef }: FooterRidgesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let paint: ReturnType<typeof createRidgeRenderer> | undefined
    let palette: RidgePalette | undefined
    let visible = false
    let frame = 0
    let lastDraw = 0
    let fogTime = 0
    let gust = 0
    let inside = false
    let targetX = 0.5
    let targetY = 0.5
    let x = targetX
    let y = targetY
    let clearing = 0
    let parallax = 0
    let targetProgress = 0
    let progress = 0
    let progressInitialized = false

    const measureProgress = () => {
      if (motion.matches) return 1
      const stage = landscapeRef.current ?? canvas
      const rect = stage.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const startTop = vh * 0.94
      const endTop = vh - rect.height
      const span = Math.max(120, startTop - endTop)
      return Math.min(1, Math.max(0, (startTop - rect.top) / span))
    }

    const syncSignatureProgress = (value: number) => {
      landscapeRef.current?.style.setProperty('--footer-progress', value.toFixed(4))
    }

    const wake = () => {
      if ((visible || progress > 0.002 || targetProgress > 0.002) && !document.hidden && !frame) {
        frame = requestAnimationFrame(draw)
      }
    }

    const draw = (now: number) => {
      frame = 0
      if (!palette) {
        const computed = getComputedStyle(canvas)
        const farInk = parseRgb(computed.getPropertyValue('--ridge-far-rgb'), [112, 134, 141])
        const nearInk = parseRgb(computed.getPropertyValue('--ridge-near-rgb'), [32, 44, 48])
        const crestBoost = Number.parseFloat(computed.getPropertyValue('--ridge-crest-boost')) || 0.12
        palette = { farInk, nearInk, crestBoost }
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

      targetProgress = measureProgress()
      if (!progressInitialized || motion.matches) {
        progress = targetProgress
        progressInitialized = true
      }

      const elapsed = lastDraw ? now - lastDraw : 0
      const settlingScroll = Math.abs(targetProgress - progress) > 0.0025
      if (!lastDraw || settlingScroll || elapsed >= (inside ? 32 : 64) || motion.matches) {
        const dt = Math.min(elapsed || 16, 100)
        lastDraw = now
        if (motion.matches) {
          progress = 1
          clearing = parallax = gust = 0
        } else {
          const scrollSmooth = 1 - Math.exp(-dt / 95)
          progress += (targetProgress - progress) * scrollSmooth
          if (Math.abs(targetProgress - progress) <= 0.001) progress = targetProgress
          const follow = 1 - Math.exp(-dt / 85)
          const settle = 1 - Math.exp(-dt / 220)
          x += (targetX - x) * follow
          y += (targetY - y) * follow
          clearing += (Number(inside) - clearing) * settle
          parallax += ((inside ? targetX * 2 - 1 : 0) - parallax) * settle
          gust *= Math.exp(-dt / 470)
          fogTime += dt / 1000 * (0.045 + gust)
        }
        syncSignatureProgress(progress)
        paint({ progress, fogTime, pointerX: x, pointerY: y, clearing, parallax, palette })
        if (!canvas.hasAttribute('data-drawn')) canvas.dataset.drawn = ''
      }
      if (!motion.matches && (visible || settlingScroll)) wake()
    }

    const refresh = () => {
      cancelAnimationFrame(frame)
      frame = lastDraw = 0
      targetProgress = measureProgress()
      if (!progressInitialized || motion.matches) {
        progress = targetProgress
        progressInitialized = true
        syncSignatureProgress(progress)
      }
      wake()
    }

    const onScroll = () => {
      targetProgress = measureProgress()
      if (!frame) wake()
    }

    const invalidateColor = () => {
      palette = undefined
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
    }, { rootMargin: '120px 0px' })
    viewport.observe(landscapeRef.current ?? canvas)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
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
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      motion.removeEventListener('change', refresh)
      document.removeEventListener('visibilitychange', refresh)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      canvas.removeEventListener('click', blowMist)
    }
  }, [landscapeRef])

  return (
    <div className={styles.ridges}>
      <canvas ref={canvasRef} />
      <div className={styles.ridgeFallback} />
    </div>
  )
}
