import { useEffect, type RefObject } from 'react'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function useHangingBadges(viewportRef: RefObject<HTMLDivElement | null>, reducedMotion: boolean) {
  useEffect(() => {
    const viewport = viewportRef.current
    const row = viewport?.querySelector('ul')
    if (!viewport || !row || reducedMotion) return

    const badges = Array.from(row.querySelectorAll<HTMLElement>('[data-skill-hanger]'),
      (hanger) => ({ hanger, angle: 0, velocity: 0 }))
    if (!badges.length) return

    const finePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)')
    let previous: { x: number; y: number; time: number } | null = null
    let frame = 0
    let lastFrame = 0

    function advance(now: number) {
      const dt = clamp((now - lastFrame) / 1000, 0, 1 / 30)
      lastFrame = now
      let moving = false
      for (const badge of badges) {
        if (!badge.angle && !badge.velocity) continue
        // A damped torsional spring around the pin, in degrees and seconds.
        badge.velocity += (-100 * badge.angle - 6 * badge.velocity) * dt
        badge.angle += badge.velocity * dt
        if (Math.abs(badge.angle) < 0.035 && Math.abs(badge.velocity) < 0.35) {
          badge.angle = badge.velocity = 0
          badge.hanger.style.removeProperty('rotate')
        } else {
          badge.hanger.style.rotate = `${badge.angle.toFixed(3)}deg`
          moving = true
        }
      }
      frame = moving ? requestAnimationFrame(advance) : 0
    }

    const brush = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !finePointer.matches) return
      const bounds = row.getBoundingClientRect()
      const width = bounds.width / badges.length
      if (!width) return
      const x = event.clientX
      const y = event.clientY
      const fromX = previous?.x ?? x - clamp(event.movementX, -width / 2, width / 2)
      const dy = previous ? y - previous.y : clamp(event.movementY, -20, 20)
      const elapsed = previous ? Math.max(event.timeStamp - previous.time, 1) : 16
      const dx = x - fromX
      const depth = clamp((y - bounds.top) / bounds.height, 0.2, 1)
      const speed = Math.min(1, Math.abs(dx) / elapsed)
      const current = clamp(Math.floor((x - bounds.left) / width), 0, badges.length - 1)
      const offset = (x - bounds.left) / width - current - 0.5
      const firstSample = previous === null
      previous = { x, y, time: event.timeStamp }

      // Distribute a fast sweep across every crossed tag, even between pointer samples.
      for (const [index, badge] of badges.entries()) {
        const left = bounds.left + index * width
        const travel = Math.max(0, Math.min(Math.max(fromX, x), left + width) - Math.max(Math.min(fromX, x), left))
        let impulse = -Math.sign(dx) * travel / width * (75 + 90 * speed) * depth
        if (index === current) {
          impulse += clamp(dy, -30, 30) * offset
          if (firstSample && !dx && !dy) impulse += offset < 0 ? -16 : 16
        }
        badge.velocity = clamp(badge.velocity + impulse, -170, 170)
      }
      if (!frame) {
        lastFrame = performance.now()
        frame = requestAnimationFrame(advance)
      }
    }

    const leave = () => { previous = null }
    viewport.addEventListener('pointermove', brush, { passive: true })
    viewport.addEventListener('pointerleave', leave)
    return () => {
      viewport.removeEventListener('pointermove', brush)
      viewport.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(frame)
      for (const badge of badges) badge.hanger.style.removeProperty('rotate')
    }
  }, [viewportRef, reducedMotion])
}
