import { useEffect, useState } from 'react'

interface Props {
  words: string[]
  typeSpeed?: number
  deleteSpeed?: number
  pauseTime?: number
}

export default function RotatingText({
  words,
  typeSpeed = 70,
  deleteSpeed = 40,
  pauseTime = 1800,
}: Props) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex % words.length]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting) {
      if (text.length < current.length) {
        timeout = setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          typeSpeed
        )
      } else {
        timeout = setTimeout(() => setDeleting(true), pauseTime)
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(
          () => setText(current.slice(0, text.length - 1)),
          deleteSpeed
        )
      } else {
        setDeleting(false)
        setWordIndex((i) => (i + 1) % words.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, wordIndex, words, typeSpeed, deleteSpeed, pauseTime])

  return (
    <span className="inline-flex items-center font-display font-semibold text-secondary">
      {text}
      <span className="rotating-caret" aria-hidden="true" />
    </span>
  )
}