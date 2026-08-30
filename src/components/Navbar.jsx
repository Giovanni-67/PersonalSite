import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'

const navItems = [['work', 'Work'], ['about', 'About'], ['experience', 'Experience'], ['education', 'Education'], ['skills', 'Skills'], ['contact', 'Contact']]
const sectionIds = navItems.map(([id]) => id)
export default function Navbar() {
  const activeSection = useActiveSection(sectionIds); const [isOpen, setIsOpen] = useState(false); const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => { const onScroll = () => setIsScrolled(window.scrollY > 24); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll) }, [])
  return <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}><div className="nav-shell"><a className="brand" href="#top" aria-label="Giovanni Peila, back to top">Giovanni Peila</a><button className="menu-button" type="button" aria-expanded={isOpen} aria-controls="primary-navigation" onClick={() => setIsOpen(open => !open)}><span className="sr-only">{isOpen ? 'Close' : 'Open'} navigation</span><span aria-hidden="true" /><span aria-hidden="true" /></button><nav id="primary-navigation" className={isOpen ? 'nav--open' : ''} aria-label="Primary navigation"><ul>{navItems.map(([id, label]) => <li key={id}><a className={activeSection === id ? 'is-active' : ''} href={`#${id}`} onClick={() => setIsOpen(false)}>{label}</a></li>)}</ul></nav></div><AnimatePresence>{isOpen && <motion.div className="mobile-nav-backdrop" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} />}</AnimatePresence></header>
}
