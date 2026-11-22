'use client'

import { Mail } from 'lucide-react'
import { useIntl } from 'react-intl'
import { TelegramIcon } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/constants'

export function ContactLinks() {
  const intl = useIntl()
  const buttonClass = 'h-11 gap-2 rounded-full px-5'

  return (
    <div className="flex w-full flex-col gap-2 min-[480px]:w-fit min-[480px]:flex-row">
      <a href={`mailto:${SITE_CONFIG.email}`} className={buttonVariants({ className: buttonClass })}>
        <Mail className="size-4" aria-hidden="true" />
        {intl.formatMessage({ id: 'contact.sayHello' })}
      </a>
      <a
        href={SITE_CONFIG.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: 'outline', className: buttonClass })}
      >
        <TelegramIcon className="size-4" aria-hidden="true" />
        {intl.formatMessage({ id: 'contact.telegram' })}
      </a>
    </div>
  )
}
