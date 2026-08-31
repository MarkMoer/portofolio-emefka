import { useState } from 'react'
import type { FormEvent } from 'react'
import { i18n } from '../lib/i18n'
import { useLang } from '../lib/useLang'

type Status =
  | { type: 'idle' }
  | { type: 'sending' }
  | { type: 'success' }
  | { type: 'error'; message: string }

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ type: 'idle' })
  const lang = useLang()

  const t = (k: string) =>
    (i18n as Record<string, Record<string, string>>)[lang]?.[k] ?? k

  const inputClass =
    'w-full bg-surface-2 border border-line text-primary p-3 rounded-lg focus:outline-none focus:border-secondary transition-colors placeholder:text-muted/60'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    // Honeypot: jika terisi, kemungkinan bot
    if (formData.get('botcheck')) {
      setStatus({ type: 'success' })
      form.reset()
      return
    }

    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()

    if (!name || !email || !message) {
      setStatus({ type: 'error', message: t('contact.error.empty') })
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', message: t('contact.error.email') })
      return
    }

    setStatus({ type: 'sending' })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY,
          name,
          email,
          message,
        }),
        signal: controller.signal,
      })

      if (response.ok) {
        form.reset()
        setStatus({ type: 'success' })
      } else {
        throw new Error('failed')
      }
    } catch (error) {
      const isTimeout = error instanceof DOMException && error.name === 'AbortError'
      setStatus({
        type: 'error',
        message: t(isTimeout ? 'contact.error.timeout' : 'contact.error.general'),
      })
    } finally {
      clearTimeout(timeout)
    }
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-5" noValidate>
      <input
        type="text"
        name="botcheck"
        class="hidden"
        tabindex={-1}
        autocomplete="off"
        aria-hidden="true"
      />

      {status.type === 'success' ? (
        <p class="text-sm font-semibold text-emerald-400" role="status">
          {t('contact.success')}
        </p>
      ) : status.type === 'error' ? (
        <p class="text-sm font-semibold text-red-400" role="alert">
          {status.message}
        </p>
      ) : null}

      <div>
        <label for="name" class="block text-sm font-semibold text-primary mb-1.5">
          {t('contact.name')}
        </label>
        <input type="text" id="name" name="name" required maxlength={100} class={inputClass} />
      </div>

      <div>
        <label for="email" class="block text-sm font-semibold text-primary mb-1.5">
          {t('contact.email')}
        </label>
        <input type="email" id="email" name="email" required maxlength={254} class={inputClass} />
      </div>

      <div>
        <label for="message" class="block text-sm font-semibold text-primary mb-1.5">
          {t('contact.message')}
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxlength={2000}
          rows={5}
          class={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={status.type === 'sending'}
        class="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-secondary text-[#1a1a1d] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status.type === 'sending' ? t('contact.sending') : t('contact.send')}
      </button>
    </form>
  )
}