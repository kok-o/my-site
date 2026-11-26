'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Mail, Send, X } from 'lucide-react'
import { useIntl } from 'react-intl'
import { buttonVariants } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ContactDialogContextValue {
  openContactDialog: () => void
}

const ContactDialogContext = createContext<ContactDialogContextValue>({
  openContactDialog: () => {},
})

export function useContactDialog() {
  return useContext(ContactDialogContext)
}

const subscribeToHydration = () => () => {}
const hydratedSnapshot = () => true
const serverSnapshot = () => false

interface ContactDialogProviderProps {
  directEmailEnabled: boolean
  children: ReactNode
}

export function ContactDialogProvider({ directEmailEnabled, children }: ContactDialogProviderProps) {
  const [open, setOpen] = useState(false)
  const openerRef = useRef<HTMLElement | null>(null)

  const openContactDialog = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      openerRef.current = document.activeElement
    }
    setOpen(true)
  }, [])

  const closeContactDialog = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <ContactDialogContext.Provider value={{ openContactDialog }}>
      {children}
      <ContactDialog
        open={open}
        onClose={closeContactDialog}
        directEmailEnabled={directEmailEnabled}
        openerRef={openerRef}
      />
    </ContactDialogContext.Provider>
  )
}

interface ContactDialogProps {
  open: boolean
  onClose: () => void
  directEmailEnabled: boolean
  openerRef: React.RefObject<HTMLElement | null>
}

function ContactDialog({ open, onClose, directEmailEnabled, openerRef }: ContactDialogProps) {
  const intl = useIntl()
  const mounted = useSyncExternalStore(subscribeToHydration, hydratedSnapshot, serverSnapshot)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('')
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'gmail' | 'error'>('idle')

  const mountDialog = useCallback((dialog: HTMLDialogElement | null) => {
    if (!dialog) return
    dialog.showModal()
    return () => {
      dialog.close()
      openerRef.current?.focus({ preventScroll: true })
    }
  }, [openerRef])

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

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2500)
    return () => window.clearTimeout(timer)
  }, [copied])

  const buildDraft = () => {
    const trimmedSubject = subject.trim()
    const trimmedName = name.trim()
    const resolvedSubject = trimmedSubject
      || (trimmedName
        ? intl.formatMessage({ id: 'contact.form.subjectPrefix' }, { name: trimmedName })
        : intl.formatMessage({ id: 'contact.form.subjectDefault' }))
    return {
      subject: resolvedSubject,
      body: message.trim(),
    }
  }

  const openGmailDraft = () => {
    const draft = buildDraft()
    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: SITE_CONFIG.email,
      su: draft.subject,
      body: draft.body,
    })
    window.open(`https://mail.google.com/mail/?${params.toString()}`, '_blank', 'noopener,noreferrer')
    setStatus('gmail')
  }

  const mailtoHref = (() => {
    const draft = buildDraft()
    const params = new URLSearchParams()
    if (draft.subject) params.set('subject', draft.subject)
    if (draft.body) params.set('body', draft.body)
    const query = params.toString()
    return `mailto:${SITE_CONFIG.email}${query ? `?${query}` : ''}`
  })()

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(SITE_CONFIG.email)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!directEmailEnabled) {
      openGmailDraft()
      return
    }

    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, website }),
      })
      if (!response.ok) {
        setStatus('error')
        return
      }
      setStatus('sent')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  const handleClose = () => {
    setStatus('idle')
    onClose()
  }

  if (!mounted) return null

  const fieldClass =
    'w-full rounded-xl border border-surface-border bg-background/75 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-[var(--folio-ink)] focus:outline-none focus:ring-2 focus:ring-ring/40'

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.dialog
          ref={mountDialog}
          aria-labelledby="contact-dialog-title"
          onCancel={(event) => {
            event.preventDefault()
            handleClose()
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-black/70 p-4 backdrop-blur-sm backdrop:bg-transparent"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
            className="surface-paper relative isolate w-full max-w-md overflow-hidden rounded-2xl border border-surface-border bg-card p-6 text-left text-foreground shadow-xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="contact-dialog-title" className="font-heading text-xl font-semibold tracking-tight">
                  {intl.formatMessage({ id: 'contact.form.title' })}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {intl.formatMessage({ id: 'contact.form.subtitle' })}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label={intl.formatMessage({ id: 'contact.form.close' })}
                className="inline-grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-surface-border bg-background/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-background/65 py-1 pr-1.5 pl-3 text-xs text-muted-foreground">
              <span className="select-all font-mono text-foreground/90">{SITE_CONFIG.email}</span>
              <button
                type="button"
                onClick={() => void handleCopyAddress()}
                aria-label={intl.formatMessage({ id: 'contact.copyEmail' })}
                title={intl.formatMessage({ id: 'contact.copyEmail' })}
                className="inline-grid size-6 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
              </button>
            </div>

            <form onSubmit={(event) => void handleSubmit(event)} className="mt-5 space-y-3.5">
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                className="sr-only"
                aria-hidden="true"
              />

              {directEmailEnabled && (
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      {intl.formatMessage({ id: 'contact.form.name' })}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={intl.formatMessage({ id: 'contact.form.namePlaceholder' })}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      {intl.formatMessage({ id: 'contact.form.email' })}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={intl.formatMessage({ id: 'contact.form.emailPlaceholder' })}
                      className={fieldClass}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {intl.formatMessage({ id: 'contact.form.subject' })}
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder={intl.formatMessage({ id: 'contact.form.subjectPlaceholder' })}
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {intl.formatMessage({ id: 'contact.form.message' })}
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={intl.formatMessage({ id: 'contact.form.messagePlaceholder' })}
                  className={cn(fieldClass, 'resize-y')}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={buttonVariants({ className: 'h-10 flex-1 cursor-pointer gap-2 rounded-full px-5' })}
                >
                  <Send className="size-4" aria-hidden="true" />
                  {status === 'sending'
                    ? intl.formatMessage({ id: 'contact.form.sending' })
                    : intl.formatMessage({ id: directEmailEnabled ? 'contact.form.send' : 'contact.form.sendGmail' })}
                </button>
                <a
                  href={mailtoHref}
                  className={buttonVariants({ variant: 'outline', className: 'h-10 gap-1.5 rounded-full px-4' })}
                >
                  <Mail className="size-3.5" aria-hidden="true" />
                  {intl.formatMessage({ id: 'contact.form.openMailApp' })}
                </a>
              </div>

              {status === 'sent' && (
                <p role="status" className="text-xs text-foreground">
                  {intl.formatMessage({ id: 'contact.form.sent' })}
                </p>
              )}
              {status === 'gmail' && (
                <p role="status" className="text-xs text-muted-foreground">
                  {intl.formatMessage({ id: 'contact.form.openedGmail' })}
                </p>
              )}
              {status === 'error' && (
                <div role="alert" className="flex flex-wrap items-center justify-between gap-2 text-xs text-destructive">
                  <span>{intl.formatMessage({ id: 'contact.form.error' })}</span>
                  <button
                    type="button"
                    onClick={openGmailDraft}
                    className="cursor-pointer underline underline-offset-4"
                  >
                    {intl.formatMessage({ id: 'contact.form.sendGmail' })}
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </motion.dialog>
      )}
    </AnimatePresence>,
    document.body,
  )
}
