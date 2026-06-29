'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { IntlProvider as ReactIntlProvider } from 'react-intl'
import enMessages from '@/locales/en.json'
import ruMessages from '@/locales/ru.json'
import kzMessages from '@/locales/kz.json'

type Locale = 'en' | 'ru' | 'kz'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const messages: Record<Locale, Record<string, string>> = {
  en: enMessages,
  ru: ruMessages,
  kz: kzMessages,
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load locale from localStorage if available
    const savedLocale = localStorage.getItem('locale') as Locale
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'ru' || savedLocale === 'kz')) {
      setLocaleState(savedLocale)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'ru') {
        setLocaleState('ru')
      } else if (browserLang === 'kk' || browserLang === 'kz') {
        setLocaleState('kz')
      }
    }
    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
  }

  // To prevent hydration errors, we can either delay rendering or just render with default 'en'
  // react-intl doesn't cause severe hydration errors if the text is wrapped in suppressHydrationWarning
  // However, it's safer to just provide the context and let it render.
  
  if (!mounted) {
    // Return with default 'en' during SSR to match the initial render
    return (
      <LanguageContext.Provider value={{ locale: 'en', setLocale }}>
        <ReactIntlProvider messages={messages.en} locale="en" defaultLocale="en">
          {children}
        </ReactIntlProvider>
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <ReactIntlProvider messages={messages[locale]} locale={locale} defaultLocale="en">
        {children}
      </ReactIntlProvider>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
