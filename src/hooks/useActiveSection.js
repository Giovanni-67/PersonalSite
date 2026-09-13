import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = ['top', ...sectionIds].map(id => document.getElementById(id)).filter(Boolean)
    let destination = null
    let frame = 0
    const select = section => setActive(section && section.id !== 'top' ? section.id : '')
    const update = () => {
      frame = 0
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      if (destination) {
        const anchor = destination.closest('.pin-spacer') || destination
        const remaining = anchor.getBoundingClientRect().top
        if (Math.abs(remaining) > 2 && !(atBottom && remaining > 0)) return
        destination = null
      }
      // The short Contact section cannot always reach the normal activation line.
      const current = atBottom ? sections.at(-1) : sections.find(section => {
        const rect = section.getBoundingClientRect()
        return rect.top <= window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.35
      })
      select(current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const navigate = event => {
      const link = event.target.closest('a[href^="#"]')
      if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return
      const target = sections.find(section => `#${section.id}` === link.getAttribute('href'))
      if (!target) return
      destination = target
      select(target)
      schedule()
    }
    const cancel = () => {
      // Stop the native smooth scroll before handing control back to user input.
      if (destination) window.scrollTo({ top: window.scrollY, behavior: 'instant' })
      destination = null
      schedule()
    }
    const onKeyDown = event => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape'].includes(event.key)) cancel()
    }
    // Capture the intent before the pinned Work handler handles its anchor.
    document.addEventListener('click', navigate, true)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', cancel)
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    window.addEventListener('pointerdown', cancel)
    window.addEventListener('keydown', onKeyDown)
    update()
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', navigate, true)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', cancel)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('pointerdown', cancel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [sectionIds])

  return active
}
