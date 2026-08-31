import { useEffect, useState } from 'react'
import type { Lang } from './i18n'

export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lang')
      return saved === 'en' || saved === 'id' ? saved : 'id'
    }
    return 'id'
  })

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Lang
      if (detail === 'id' || detail === 'en') setLang(detail)
    }
    window.addEventListener('langchange', handler)
    return () => window.removeEventListener('langchange', handler)
  }, [])

  return lang
}