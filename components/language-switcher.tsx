'use client'

import { useLanguage } from '@/components/language-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale('en')} className={locale === 'en' ? 'bg-accent' : ''}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale('ru')} className={locale === 'ru' ? 'bg-accent' : ''}>
          Русский
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale('kz')} className={locale === 'kz' ? 'bg-accent' : ''}>
          Қазақша
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
