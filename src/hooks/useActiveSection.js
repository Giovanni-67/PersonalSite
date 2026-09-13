import { useEffect, useState } from 'react'

export function useActiveSection(sectionIds) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = ['top', ...sectionIds].map(id => document.getElementById(id)).filter(Boolean)
    const visible = new Set()
    const observer = new IntersectionObserver(entries => {
      // Entries only contain changes, not every section currently in view.
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      const current = sections.find(section => visible.has(section))
      setActive(current && current.id !== 'top' ? current.id : '')
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [.05, .2, .5] })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [sectionIds])

  return active
}
