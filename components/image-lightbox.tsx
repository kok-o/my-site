'use client'

import { useCallback, useEffect, useSyncExternalStore, type CSSProperties, type RefObject } from 'react'
import Image from 'next/image'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const subscribeToHydration = () => () => {}
const hydratedSnapshot = () => true
const serverSnapshot = () => false

interface ImageLightboxProps {
  open: boolean
  onClose: () => void
  src: string
  alt: string
  dialogLabel: string
  closeLabel: string
  prevLabel?: string
  nextLabel?: string
  onPrev?: () => void
  onNext?: () => void
  counterText?: string
  imageStyle?: CSSProperties
  returnFocusRef?: RefObject<HTMLElement | null>
}

export function ImageLightbox({
  open,
  onClose,
  src,
  alt,
  dialogLabel,
  closeLabel,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
  counterText,
  imageStyle,
  returnFocusRef,
}: ImageLightboxProps) {
  const mounted = useSyncExternalStore(subscribeToHydration, hydratedSnapshot, serverSnapshot)
  const hasNavigation = Boolean(onPrev && onNext && prevLabel && nextLabel)

  const mountDialog = useCallback((dialog: HTMLDialogElement | null) => {
    if (!dialog) return
    dialog.showModal()
    return () => {
      dialog.close()
      returnFocusRef?.current?.focus({ preventScroll: true })
    }
  }, [returnFocusRef])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      const paddingRight = parseFloat(getComputedStyle(document.body).paddingRight) || 0
      document.body.style.paddingRight = `${paddingRight + scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }
  }, [open])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.dialog
          ref={mountDialog}
          aria-label={dialogLabel}
          onCancel={(event) => {
            event.preventDefault()
            onClose()
          }}
          onKeyDown={(event) => {
            if (!hasNavigation) return
            if (event.key === 'ArrowLeft') {
              event.preventDefault()
              onPrev?.()
            } else if (event.key === 'ArrowRight') {
              event.preventDefault()
              onNext?.()
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-black/92 p-4 backdrop-blur-md backdrop:bg-transparent sm:p-8"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-[110] inline-grid size-10 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label={closeLabel}
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          {hasNavigation && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onPrev?.()
                }}
                className="absolute top-1/2 left-3 z-[110] inline-grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6 sm:size-12"
                aria-label={prevLabel}
              >
                <ChevronLeft className="size-6 sm:size-7" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onNext?.()
                }}
                className="absolute top-1/2 right-3 z-[110] inline-grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:size-12"
                aria-label={nextLabel}
              >
                <ChevronRight className="size-6 sm:size-7" aria-hidden="true" />
              </button>
            </>
          )}

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full max-h-[86svh] w-full max-w-[90vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              key={src}
              src={src}
              alt={alt}
              fill
              className="object-contain"
              style={imageStyle}
              sizes="90vw"
              loading="eager"
              fetchPriority="high"
            />
          </motion.div>

          {counterText && (
            <span
              aria-live="polite"
              aria-atomic="true"
              className="pointer-events-none absolute bottom-4 left-1/2 z-[110] -translate-x-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-xs tabular-nums text-white/85"
            >
              {counterText}
            </span>
          )}
        </motion.dialog>
      )}
    </AnimatePresence>,
    document.body,
  )
}
