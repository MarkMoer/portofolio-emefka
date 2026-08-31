import { i18n, type I18nKey, type Lang } from './i18n'

export function getInitialLang(): Lang {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'id') return saved
    return 'id'
  }
  return 'id'
}

export function setLang(lang: Lang): void {
  localStorage.setItem('lang', lang)
  document.documentElement.setAttribute('lang', lang)
  applyTranslations(lang)
  updateLangButtons(lang)
  window.dispatchEvent(new CustomEvent('langchange', { detail: lang }))
}

export function t(key: I18nKey, lang: Lang): string {
  return i18n[lang][key] ?? key
}

function applyTranslations(lang: Lang): void {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n') as I18nKey
    if (key && i18n[lang][key]) {
      el.textContent = i18n[lang][key]
    }
  })
}

function updateLangButtons(lang: Lang): void {
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    const active = btn.getAttribute('data-lang-btn') === lang
    btn.classList.toggle('text-secondary', active)
    btn.classList.toggle('opacity-60', !active)
  })
}

export function initLang(): void {
  const lang = getInitialLang()
  document.documentElement.setAttribute('lang', lang)
  applyTranslations(lang)
  updateLangButtons(lang)
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-lang-btn') as Lang
      if (target) setLang(target)
    })
  })
}