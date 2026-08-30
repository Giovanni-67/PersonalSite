import { AnimatePresence, motion } from 'motion/react'
import LiquidGlass from 'liquid-glass-react'
import { useEffect, useRef, useState } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'

const navItems = [['about', 'About'], ['work', 'Work'], ['experience', 'Experience'], ['education', 'Education'], ['skills', 'Skills'], ['contact', 'Contact']]
const sectionIds = navItems.map(([id]) => id)

function NavGlass({ mouseContainer }) {
  return <LiquidGlass className="nav-item__liquid" mouseContainer={mouseContainer} displacementScale={64} blurAmount={0.1} saturation={130} aberrationIntensity={2} elasticity={0} cornerRadius={999} padding="0" mode="standard" style={{ position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%' }}>
    <span aria-hidden="true" style={{ display: 'block', width: '100%', height: '100%' }} />
  </LiquidGlass>
}

export default function Navbar() {
  const activeSection = useActiveSection(sectionIds)
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [useLiquidNav, setUseLiquidNav] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const headerRef = useRef(null)
  const highlightedId = hoveredId ?? activeSection

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 781px)')
    const update = () => setUseLiquidNav(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return <header ref={headerRef} className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}>
    <div className="nav-shell nav-shell--fallback">
      <a className="brand" href="#top" aria-label="Giovanni Peila, back to top">Giovanni Peila</a>
      <button className="menu-button" type="button" aria-expanded={isOpen} aria-controls="primary-navigation" onClick={() => setIsOpen(open => !open)}><span className="sr-only">{isOpen ? 'Close' : 'Open'} navigation</span><span aria-hidden="true" /><span aria-hidden="true" /></button>
      <nav id="primary-navigation" className={isOpen ? 'nav--open' : ''} aria-label="Primary navigation" onMouseLeave={() => setHoveredId(null)}>
        <ul>{navItems.map(([id, label]) => {
          const isHighlighted = highlightedId === id
          return <li key={id} className={isHighlighted ? 'nav-item nav-item--highlighted' : 'nav-item'}>
            {useLiquidNav && <span className="nav-item__glass-stage" aria-hidden="true"><NavGlass mouseContainer={headerRef} /></span>}
            <a className={activeSection === id ? 'is-active' : ''} href={`#${id}`} onMouseEnter={() => setHoveredId(id)} onFocus={() => setHoveredId(id)} onClick={() => setIsOpen(false)}>{label}</a>
          </li>
        })}</ul>
      </nav>
    </div>
    <AnimatePresence>{isOpen && <motion.div className="mobile-nav-backdrop" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} />}</AnimatePresence>
  </header>
}
