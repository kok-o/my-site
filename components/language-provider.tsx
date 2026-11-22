'use client'
import { createContext, useContext, useDeferredValue, useEffect, useMemo, useSyncExternalStore } from 'react'
import { IntlProvider } from 'react-intl'
import enMessages from '@/locales/en.json'
import ruMessages from '@/locales/ru.json'
import kzMessages from '@/locales/kz.json'

export type Locale = 'en' | 'ru' | 'kz'
interface LanguageContextType { locale: Locale; setLocale: (locale: Locale) => void }
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)
const messages = { en: enMessages, ru: ruMessages, kz: kzMessages }
let sessionLocale: Locale | undefined

function getLocale(): Locale {
  try {
    const saved = localStorage.getItem('locale')
    if (saved === 'en' || saved === 'ru' || saved === 'kz') return saved
  } catch { /* Storage may be disabled; retain the in-session preference. */ }
  if (sessionLocale) return sessionLocale
  const language = navigator.language.split('-')[0]
  return language === 'ru' ? 'ru' : language === 'kk' || language === 'kz' ? 'kz' : 'en'
}
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener('portfolio-locale', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('portfolio-locale', callback)
  }
}
function setLocale(locale: Locale) {
  sessionLocale = locale
  try { localStorage.setItem('locale', locale) } catch { /* The session still works. */ }
  window.dispatchEvent(new Event('portfolio-locale'))
}
const serverLocale = (): Locale => 'en'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const preference = useSyncExternalStore(subscribe, getLocale, serverLocale)
  const locale = useDeferredValue(preference)
  const context = useMemo(() => ({ locale, setLocale }), [locale])
  const intlLocale = locale === 'kz' ? 'kk' : locale
  useEffect(() => {
    if (document.documentElement.lang !== intlLocale) document.documentElement.lang = intlLocale
  }, [intlLocale])
  return (
    <LanguageContext.Provider value={context}>
      <IntlProvider messages={messages[locale]} locale={intlLocale} defaultLocale="en">{children}</IntlProvider>
    </LanguageContext.Provider>
  )
}
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider')
  return context
}
