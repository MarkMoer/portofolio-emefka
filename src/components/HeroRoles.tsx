import RotatingText from './ui/RotatingText'
import { useLang } from '../lib/useLang'
import { i18n } from '../lib/i18n'

export default function HeroRoles() {
  const lang = useLang()
  const words = [
    i18n[lang]['hero.role.1'],
    i18n[lang]['hero.role.2'],
    i18n[lang]['hero.role.3'],
  ]

  return <RotatingText words={words} />
}