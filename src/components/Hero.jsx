import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const heroRef = useRef(null)
  const reduced = useReducedMotion()
  const enter = (y) => reduced ? false : { opacity: 0, y }

  useLayoutEffect(() => {
    if (reduced) return undefined
    const context = gsap.context(() => {
      const media = gsap.matchMedia()
      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=92%',
            pin: true,
            scrub: 0.4,
            anticipatePin: 1,
          },
        })
        timeline
          .to('.hero-content', { yPercent: -28, scale: 0.8, opacity: 0.16, ease: 'none', duration: 0.8 }, 0)
          .to('.hero-terrain', { yPercent: 18, scale: 1.16, opacity: 1, ease: 'none', duration: 0.8 }, 0)
          .to('.hero-transition-field', { scale: 1.16, xPercent: -7, yPercent: -8, opacity: 1, ease: 'none', duration: 0.72 }, 0.08)
          .to('.hero-work-preview', { y: -10, opacity: 1, ease: 'none', duration: 0.64 }, 0.22)
          .to('.hero-scroll-cue', { opacity: 0, y: 16, ease: 'none', duration: 0.3 }, 0)
      })
      return () => media.revert()
    }, heroRef)
    return () => context.revert()
  }, [reduced])

  return (
    <section id="top" ref={heroRef} className="hero" aria-labelledby="hero-title">
      <motion.div className="hero-terrain" aria-hidden="true"><span /><span /><span /></motion.div>
      <div className="hero-transition-field" aria-hidden="true" />
      <motion.div className="hero-content">
        <motion.h1 id="hero-title" initial={enter(28)} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>Giovanni Peila</motion.h1>
        <motion.p className="hero-role" initial={enter(20)} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>Computer Science @ Cal Poly SLO</motion.p>
        <motion.p className="hero-summary" initial={enter(18)} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}>Building software and exploring AI, systems, and the web.</motion.p>
        <motion.div className="hero-actions" initial={enter(16)} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}>
          <a className="button button--primary" href="#work">View selected work <span aria-hidden="true">↓</span></a>
          <a className="button button--quiet" href="https://github.com/Giovanni-67" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          <a className="button button--quiet" href="#contact">Contact <span aria-hidden="true">↘</span></a>
        </motion.div>
      </motion.div>
      <div className="hero-work-preview" aria-hidden="true"><span>01 / SELECTED WORK</span><strong>Exam Registration System</strong></div>
      <a className="hero-scroll-cue" href="#work" aria-label="Scroll to selected work"><span>SCROLL TO EXPLORE</span><i aria-hidden="true" /></a>
    </section>
  )
}
