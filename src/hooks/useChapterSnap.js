import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useChapterSnap() {
  useEffect(() => {
    const media = window.matchMedia('(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)')
    let timer
    let wheelScrolling = false
    let direction = 0

    const cancel = () => {
      window.clearTimeout(timer)
      wheelScrolling = false
    }
    const onWheel = event => {
      if (!event.deltaY || event.ctrlKey) return
      window.clearTimeout(timer)
      direction = Math.sign(event.deltaY)
      wheelScrolling = true
    }
    const settle = () => {
      wheelScrolling = false
      if (!media.matches || ScrollTrigger.getById('project-rail')?.isActive) return
      const threshold = Math.min(180, window.innerHeight * 0.15)
      let offset = null
      for (const section of document.querySelectorAll('.section:not(.section--contact)')) {
        const rect = section.getBoundingClientRect()
        // Never pull a user back to the chapter they are trying to leave.
        if (rect.top * direction <= 0) continue
        // Longer chapters must remain freely scrollable, including open coursework.
        if (rect.top < 0 && rect.height > window.innerHeight + 1) continue
        if (Math.abs(rect.top) <= threshold && (offset === null || Math.abs(rect.top) < Math.abs(offset))) offset = rect.top
      }
      if (offset !== null && Math.abs(offset) > 1) window.scrollTo({ top: window.scrollY + offset, behavior: 'smooth' })
    }
    const onScroll = () => {
      if (!wheelScrolling) return
      window.clearTimeout(timer)
      timer = window.setTimeout(settle, 180)
    }

    // Only settle after wheel input ends; leave anchors, touch and keyboard alone.
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointerdown', cancel)
    window.addEventListener('keydown', cancel)
    return () => {
      cancel()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointerdown', cancel)
      window.removeEventListener('keydown', cancel)
    }
  }, [])
}
